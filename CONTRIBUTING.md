# Contributing Guide

## Workflow
- Default branch: `main`
- Use pull requests for all changes
- Keep PRs focused and reviewable

## Commit Standard
Use conventional style when possible:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `chore:` maintenance

## Local Validation
```bash
npm ci
npm run lint
npm run typecheck
npm run test:ci
npm run build
```

## Pull Request Requirements
- CI and Security workflows green
- No secrets in code or commit history
- Updated docs for behavior or API changes

## Security by Default
- Never commit `.env`
- Validate external data before use
- Keep dependencies updated
