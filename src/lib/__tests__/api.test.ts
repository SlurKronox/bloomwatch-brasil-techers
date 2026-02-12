import { afterEach, describe, expect, it, vi } from 'vitest';

function setupEnv() {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key');
}

describe('api client', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('fetches regions', async () => {
    setupEnv();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        regioes: [{ id: 'r1', nome: 'Sertao', latitude: -9.1, longitude: -40.3 }],
      }),
    });

    vi.stubGlobal('fetch', fetchMock);

    const { fetchRegioes } = await import('../api');
    const data = await fetchRegioes();

    expect(data).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.supabase.co/functions/v1/bloomwatch-api/regioes',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer anon-key' }),
      })
    );
  });

  it('throws when regions endpoint returns non-ok', async () => {
    setupEnv();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    const { fetchRegioes } = await import('../api');

    await expect(fetchRegioes()).rejects.toThrow(/Erro ao buscar regioes/);
  });

  it('fetches bloom data for a region', async () => {
    setupEnv();

    const payload = {
      regiao: { id: 'r1', nome: 'Sertao' },
      predicoes: [],
      metadata: { generated_at: '2026-01-10T00:00:00.000Z' },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => payload,
    });

    vi.stubGlobal('fetch', fetchMock);

    const { fetchFloradaPorRegiao } = await import('../api');
    const data = await fetchFloradaPorRegiao('r1');

    expect(data).toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.supabase.co/functions/v1/bloomwatch-api/florada/r1',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer anon-key' }),
      })
    );
  });

  it('throws when region endpoint returns non-ok', async () => {
    setupEnv();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    const { fetchFloradaPorRegiao } = await import('../api');

    await expect(fetchFloradaPorRegiao('r1')).rejects.toThrow(/Erro ao buscar dados de floracao/);
  });
});
