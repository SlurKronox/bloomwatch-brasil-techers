# BloomWatch Brasil Techers (Primary)

![CI](https://github.com/SlurKronox/bloomwatch-brasil-techers/actions/workflows/ci.yml/badge.svg)
![Security](https://github.com/SlurKronox/bloomwatch-brasil-techers/actions/workflows/security.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Repositorio principal do BloomWatch para monitoramento e previsao de floracao na Caatinga.

## Objetivo
Consolidar a implementacao oficial em TypeScript com base tecnica para evolucao continua.
A aplicacao integra React + Vite no frontend e Supabase no backend para dados e funcoes serverless.
O foco e fornecer previsao de florada, visualizacao geografica e suporte a decisao para agricultura e apicultura.

## Stack
- React 18 + TypeScript
- Vite 7
- Supabase
- Vitest 4
- GitHub Actions

## Arquitetura
- `src/components`: UI e visualizacoes
- `src/services`: regras de previsao e integracoes
- `src/lib`: cliente API/Supabase
- `supabase/`: funcoes e migracoes
- `docs/`: documentacao tecnica

## Setup Local
```bash
git clone https://github.com/SlurKronox/bloomwatch-brasil-techers.git
cd bloomwatch-brasil-techers
npm ci
```

Crie `.env`:
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Comandos
```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Documentacao
- `docs/README.md`
- `docs/ARCHITECTURE.md`
- `docs/TESTING.md`
- `docs/CI.md`
- `docs/SECURITY.md`

## Governanca
- Politica de seguranca: `SECURITY.md`
- Guia de contribuicao: `CONTRIBUTING.md`

## English Summary
This is the primary BloomWatch repository.
It is documented with engineering governance and secured with CI and security workflows.
