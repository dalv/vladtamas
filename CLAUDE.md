# Project preferences

## Git workflow

- When changes are ready to ship, commit and push to `origin/main` without asking
  for confirmation. This project auto-deploys from `main` via Vercel, so pushing
  is the expected end of any task.
- Never use destructive git operations (`push --force`, `reset --hard`, branch
  deletion, etc.) without an explicit request.
