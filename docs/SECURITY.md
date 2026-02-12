# Security Baseline

## Objectives
- Protect user and environmental data
- Reduce client-side and integration attack surface
- Prevent secret leakage and insecure dependency usage

## Controls
- Pull requests are required for changes on `main`
- CI validates lint, type safety, tests, and build
- Security workflow runs dependency review and CodeQL scanning

## Application Practices
- Do not expose service role keys in frontend runtime
- Restrict Supabase policies by least privilege
- Validate and sanitize external API responses
- Avoid unsafe dynamic HTML rendering

## Dependency Hygiene
- Keep `package-lock.json` versioned
- Review dependency changes in PRs
- Patch known vulnerabilities in regular cycles

## Incident Response
1. Revoke affected credentials.
2. Isolate vulnerable component.
3. Publish mitigation in changelog/PR.
4. Re-run full CI and security checks.

## English Summary
This document defines security controls for frontend, integrations, and CI operations.
