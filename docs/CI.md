# CI

## Workflows
- `.github/workflows/ci.yml`
- `.github/workflows/security.yml`

## CI Jobs
- `lint` (inclui `typecheck`)
- `test`
- `build`

## Security Jobs
- `dependency-review` (PR)
- `codeql` (push, PR, schedule)

## Ambiente
- Node 20
- Instalacao via `npm ci`

## Criterio de aprovacao
Merge em `main` somente com CI e Security verdes.

## English Summary
CI validates lint, type safety, tests, and build; Security adds dependency review and CodeQL scanning.
