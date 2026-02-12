import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Plant } from '../../types';

const insertMock = vi.fn();
const orderMock = vi.fn();
const eqMock = vi.fn();
const selectMock = vi.fn();
const fromMock = vi.fn();

vi.mock('../nasaService', () => ({
  NASADataService: {
    getEnvironmentalData: vi.fn(),
  },
}));

vi.mock('../../lib/supabaseClient', () => ({
  supabase: {
    from: (...args: unknown[]) => fromMock(...args),
  },
}));

import { PredictionService } from '../predictionService';
import { NASADataService } from '../nasaService';

function buildPlant(overrides: Partial<Plant> = {}): Plant {
  return {
    id: 'plant-1',
    nome: 'Umbuzeiro',
    nome_cientifico: 'Spondias tuberosa',
    descricao: 'Planta nativa da Caatinga',
    bloom_start: 1,
    bloom_end: 3,
    optimal_conditions: {
      temperature: [20, 30],
      rainfall: [200, 400],
    },
    ...overrides,
  };
}

function buildEnvironmentalData({
  temperatureValues = [24, 25, 26, 25],
  precipitationValues = [300, 300, 300, 300],
  ndviValues = [0.7, 0.8],
}: {
  temperatureValues?: number[];
  precipitationValues?: number[];
  ndviValues?: number[];
} = {}) {
  return {
    ndvi: ndviValues.map((value, index) => ({
      date: `2026-01-${String(index + 1).padStart(2, '0')}`,
      value,
      quality: 'good' as const,
    })),
    temperature: temperatureValues.map((value, index) => ({
      date: `2026-01-${String(index + 1).padStart(2, '0')}`,
      value,
      quality: 'good' as const,
    })),
    precipitation: precipitationValues.map((value, index) => ({
      date: `2026-01-${String(index + 1).padStart(2, '0')}`,
      value,
      quality: 'good' as const,
    })),
    humidity: [{ date: '2026-01-01', value: 0.5, quality: 'good' as const }],
  };
}

describe('PredictionService', () => {
  beforeEach(() => {
    insertMock.mockResolvedValue({ error: null });
    orderMock.mockResolvedValue({ data: [{ id: '1' }], error: null });
    eqMock.mockReturnValue({ order: orderMock });
    selectMock.mockReturnValue({ eq: eqMock, order: orderMock });
    fromMock.mockReturnValue({ insert: insertMock, select: selectMock });

    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-10T12:00:00.000Z'));
    vi.spyOn(Math, 'random').mockReturnValue(0);

    vi.mocked(NASADataService.getEnvironmentalData).mockResolvedValue(buildEnvironmentalData());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('predicts bloom date and persists prediction', async () => {
    const result = await PredictionService.predictBloomDate(buildPlant(), 'region-1', -9.5, -40.2);

    expect(result.plantId).toBe('plant-1');
    expect(result.regionId).toBe('region-1');
    expect(result.predictedDate).toBe('2026-01-17');
    expect(result.confidence).toBeGreaterThanOrEqual(0.4);
    expect(result.confidence).toBeLessThanOrEqual(0.95);
    expect(insertMock).toHaveBeenCalledTimes(1);
  });

  it('predicts immediate bloom when score is high and season crosses year boundary', async () => {
    vi.mocked(NASADataService.getEnvironmentalData).mockResolvedValue(
      buildEnvironmentalData({
        temperatureValues: [25, 25, 25, 25],
        precipitationValues: [75, 75, 75, 75],
        ndviValues: [0.8, 0.8],
      })
    );

    const result = await PredictionService.predictBloomDate(
      buildPlant({ bloom_start: 11, bloom_end: 2 }),
      'region-1',
      -9.5,
      -40.2
    );

    expect(result.predictedDate).toBe('2026-01-11');
    expect(result.confidence).toBe(0.95);
  });

  it('predicts medium-term bloom when score is moderate', async () => {
    vi.setSystemTime(new Date('2026-02-10T12:00:00.000Z'));
    vi.mocked(NASADataService.getEnvironmentalData).mockResolvedValue(
      buildEnvironmentalData({
        temperatureValues: [15, 15, 15, 15],
        precipitationValues: [25, 25, 25, 25],
        ndviValues: [0.45, 0.45],
      })
    );

    const result = await PredictionService.predictBloomDate(
      buildPlant({ bloom_start: 5, bloom_end: 6 }),
      'region-1',
      -9.5,
      -40.2
    );

    expect(result.predictedDate).toBe('2026-02-24');
    expect(result.confidence).toBeGreaterThanOrEqual(0.4);
    expect(result.confidence).toBeLessThan(0.6);
  });

  it('predicts late bloom for low score and handles save error', async () => {
    vi.setSystemTime(new Date('2026-07-10T12:00:00.000Z'));
    insertMock.mockRejectedValueOnce(new Error('insert failed'));
    vi.mocked(NASADataService.getEnvironmentalData).mockResolvedValue(
      buildEnvironmentalData({
        temperatureValues: [45, 45, 45, 45],
        precipitationValues: [2000, 2000, 2000, 2000],
        ndviValues: [0.1, 0.1],
      })
    );

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const result = await PredictionService.predictBloomDate(
      buildPlant({ bloom_start: 5, bloom_end: 6 }),
      'region-1',
      -9.5,
      -40.2
    );

    expect(result.predictedDate).toBe('2026-08-09');
    expect(result.confidence).toBe(0.4);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving prediction:', expect.any(Error));
  });

  it('returns predictions for region', async () => {
    const data = await PredictionService.getPredictionsForRegion('region-1');

    expect(data).toHaveLength(1);
    expect(fromMock).toHaveBeenCalledWith('predictions');
    expect(selectMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith('regiao_id', 'region-1');
  });

  it('returns predictions for plant', async () => {
    const data = await PredictionService.getPredictionsForPlant('plant-1');

    expect(data).toHaveLength(1);
    expect(eqMock).toHaveBeenCalledWith('planta_id', 'plant-1');
  });

  it('returns an empty list when region query fails', async () => {
    orderMock.mockResolvedValueOnce({ data: null, error: new Error('db error') });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const data = await PredictionService.getPredictionsForRegion('region-1');

    expect(data).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching predictions:', expect.any(Error));
  });

  it('returns an empty list when plant query fails', async () => {
    orderMock.mockResolvedValueOnce({ data: null, error: new Error('db error') });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const data = await PredictionService.getPredictionsForPlant('plant-1');

    expect(data).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching predictions:', expect.any(Error));
  });
});
