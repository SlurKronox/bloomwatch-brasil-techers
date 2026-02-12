import { Regiao, FloradaResponse } from '../types';

const API_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bloomwatch-api`;

const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

export async function fetchRegioes(): Promise<Regiao[]> {
  const response = await fetch(`${API_BASE_URL}/regioes`, { headers });

  if (!response.ok) {
    throw new Error('Erro ao buscar regioes');
  }

  const data = await response.json();
  return data.regioes;
}

export async function fetchFloradaPorRegiao(regiaoId: string): Promise<FloradaResponse> {
  const response = await fetch(`${API_BASE_URL}/florada/${regiaoId}`, { headers });

  if (!response.ok) {
    throw new Error('Erro ao buscar dados de floracao');
  }

  return response.json();
}
