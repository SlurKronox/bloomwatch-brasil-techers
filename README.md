# BloomWatch Brasil Techers (Primary)

![CI](https://github.com/SlurKronox/bloomwatch-brasil-techers/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Repositório principal do BloomWatch para monitoramento e previsão de floração na Caatinga.

## Objetivo
Consolidar a implementação oficial em TypeScript com base técnica para evolução contínua.
A aplicação integra React + Vite no frontend e Supabase no backend para dados e funções serverless.
O foco é fornecer previsão de florada, visualização geográfica e suporte à decisão para agricultura/apicultura.

## Stack
- React 18 + TypeScript
- Vite 5
- Supabase
- Vitest
- GitHub Actions

## Arquitetura
- `src/components`: UI e visualizações
- `src/services`: regras de previsão e integração externa
- `src/lib`: cliente API/Supabase
- `supabase/`: funções e migrações
- `docs/`: documentação técnica

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

## Documentação
- `docs/ARCHITECTURE.md`
- `docs/TESTING.md`
- `docs/CI.md`

## English Summary
This is the primary BloomWatch repository.
It standardizes the TypeScript codebase with automated tests and CI quality gates.
