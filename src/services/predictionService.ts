import { supabase } from '../lib/supabaseClient';
import { NASADataService, type EnvironmentalData } from './nasaService';
import type { Plant } from '../types';

export interface BloomPrediction {
  plantId: string;
  regionId: string;
  predictedDate: string;
  confidence: number;
  factors: {
    temperature: number;
    rainfall: number;
    ndvi: number;
    seasonality: number;
  };
}

export class PredictionService {
  private static readonly MODEL_VERSION = 'v1.0-simple-ml';

  static async predictBloomDate(
    plant: Plant,
    regionId: string,
    lat: number,
    lon: number
  ): Promise<BloomPrediction> {
    const envData = await NASADataService.getEnvironmentalData(regionId, lat, lon);

    const optimalConditions = plant.optimal_conditions as any;
    const currentConditions = this.getCurrentConditions(envData);

    const temperatureScore = this.calculateTemperatureScore(
      currentConditions.temperature,
      optimalConditions?.temperature || [20, 30]
    );

    const rainfallScore = this.calculateRainfallScore(
      currentConditions.rainfall,
      optimalConditions?.rainfall || [800, 1500]
    );

    const ndviScore = this.calculateNDVIScore(currentConditions.ndvi);

    const seasonalityScore = this.calculateSeasonalityScore(
      new Date().getMonth() + 1,
      plant.bloom_start || 1,
      plant.bloom_end || 12
    );

    const overallScore = (
      temperatureScore * 0.3 +
      rainfallScore * 0.3 +
      ndviScore * 0.2 +
      seasonalityScore * 0.2
    );

    const daysUntilBloom = this.estimateDaysUntilBloom(overallScore, seasonalityScore);

    const predictedDate = new Date(Date.now() + daysUntilBloom * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const confidence = Math.min(0.95, Math.max(0.4, overallScore));

    const prediction: BloomPrediction = {
      plantId: plant.id,
      regionId,
      predictedDate,
      confidence,
      factors: {
        temperature: temperatureScore,
        rainfall: rainfallScore,
        ndvi: ndviScore,
        seasonality: seasonalityScore
      }
    };

    await this.savePrediction(prediction);

    return prediction;
  }

  private static getCurrentConditions(envData: EnvironmentalData) {
    const recentTemp = envData.temperature.slice(-4);
    const recentRain = envData.precipitation.slice(-4);
    const recentNDVI = envData.ndvi.slice(-2);

    return {
      temperature: recentTemp.reduce((sum, d) => sum + d.value, 0) / recentTemp.length || 25,
      rainfall: recentRain.reduce((sum, d) => sum + d.value, 0) || 50,
      ndvi: recentNDVI.reduce((sum, d) => sum + d.value, 0) / recentNDVI.length || 0.5
    };
  }

  private static calculateTemperatureScore(current: number, optimal: number[]): number {
    const [min, max] = optimal;
    const mid = (min + max) / 2;

    if (current >= min && current <= max) {
      return 1.0 - Math.abs(current - mid) / (max - min);
    } else if (current < min) {
      return Math.max(0, 1.0 - (min - current) / 10);
    } else {
      return Math.max(0, 1.0 - (current - max) / 10);
    }
  }

  private static calculateRainfallScore(current: number, optimal: number[]): number {
    const [min, max] = optimal;

    if (current >= min && current <= max) {
      return 1.0;
    } else if (current < min) {
      return Math.max(0, current / min);
    } else {
      return Math.max(0, 1.0 - (current - max) / max);
    }
  }

  private static calculateNDVIScore(ndvi: number): number {
    if (ndvi >= 0.6) return 1.0;
    if (ndvi >= 0.4) return 0.8;
    if (ndvi >= 0.3) return 0.6;
    return 0.4;
  }

  private static calculateSeasonalityScore(
    currentMonth: number,
    bloomStart: number,
    bloomEnd: number
  ): number {
    const isInBloomSeason = this.isInBloomSeason(currentMonth, bloomStart, bloomEnd);

    if (isInBloomSeason) {
      return 1.0;
    }

    const distanceToBloom = this.monthsUntilBloomSeason(currentMonth, bloomStart);

    if (distanceToBloom <= 1) return 0.8;
    if (distanceToBloom <= 2) return 0.6;
    if (distanceToBloom <= 3) return 0.4;
    return 0.2;
  }

  private static isInBloomSeason(month: number, start: number, end: number): boolean {
    if (start <= end) {
      return month >= start && month <= end;
    } else {
      return month >= start || month <= end;
    }
  }

  private static monthsUntilBloomSeason(currentMonth: number, bloomStart: number): number {
    if (currentMonth <= bloomStart) {
      return bloomStart - currentMonth;
    } else {
      return 12 - currentMonth + bloomStart;
    }
  }

  private static estimateDaysUntilBloom(overallScore: number, seasonalityScore: number): number {
    if (overallScore >= 0.8 && seasonalityScore >= 0.8) {
      return Math.floor(Math.random() * 7) + 1;
    } else if (overallScore >= 0.6) {
      return Math.floor(Math.random() * 14) + 7;
    } else if (overallScore >= 0.4) {
      return Math.floor(Math.random() * 30) + 14;
    } else {
      return Math.floor(Math.random() * 60) + 30;
    }
  }

  private static async savePrediction(prediction: BloomPrediction): Promise<void> {
    try {
      await supabase.from('predictions').insert({
        planta_id: prediction.plantId,
        regiao_id: prediction.regionId,
        predicted_bloom_date: prediction.predictedDate,
        confidence_score: prediction.confidence,
        model_version: this.MODEL_VERSION,
        input_features: prediction.factors
      });
    } catch (error) {
      console.error('Error saving prediction:', error);
    }
  }

  static async getPredictionsForRegion(regionId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*, plantas(*), regioes(*)')
        .eq('regiao_id', regionId)
        .order('predicted_bloom_date');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching predictions:', error);
      return [];
    }
  }

  static async getPredictionsForPlant(plantId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*, plantas(*), regioes(*)')
        .eq('planta_id', plantId)
        .order('predicted_bloom_date');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching predictions:', error);
      return [];
    }
  }
}
