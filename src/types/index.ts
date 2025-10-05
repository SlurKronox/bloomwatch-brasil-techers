export interface Region {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  descricao?: string;
  state?: string;
  climate_zone?: string;
  biodiversity_index?: number;
  created_at?: string;
}

export interface Plant {
  id: string;
  nome: string;
  nome_cientifico: string;
  descricao: string;
  cor_flor?: string;
  family?: string;
  bloom_start?: number;
  bloom_end?: number;
  optimal_conditions?: Record<string, any>;
  conservation_status?: string;
  image_url?: string;
  regiao_id?: string;
  created_at?: string;
}

export interface BloomEvent {
  id: string;
  regiao_id: string;
  planta_id: string;
  status: 'nao_florindo' | 'previsao' | 'florindo';
  dias_para_florada: number;
  progresso: number;
  data_atualizacao: string;
  created_at?: string;
}

export interface Regiao {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  descricao?: string;
}

export interface Planta {
  id: string;
  nome: string;
  nome_cientifico: string;
  descricao: string;
  status: 'nao_florindo' | 'previsao' | 'florindo';
  dias_para_florada: number;
  cor: string;
  progresso: number;
}

export interface FloradaResponse {
  regiao: string;
  coordenadas: [number, number];
  plantas: Planta[];
  atualizacao: string;
}
