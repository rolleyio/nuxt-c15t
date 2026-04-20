# Releasing

## Cutting a release

From `main`, with a clean working tree:

```bash
pnpm release
```

That runs lint + tests + build, then invokes `changelogen --release --push`, which:

1. Bumps `package.json` version based on conventional-commit history.
2. Writes `CHANGELOG.md`.
3. Commits both changes.
4. Tags the commit (e.g. `v0.2.1`).
5. Pushes the commit and tag.

The pushed tag fires `.github/workflows/release.yml`, which publishes to npm with provenance and creates the GitHub Release.

### Prereleases

```bash
pnpm release:next
```

Adds `--prerelease` to `changelogen` (producing tags like `v0.3.0-beta.1`) and the CI workflow publishes under the `next` npm dist-tag.

### First-time setup in a fresh clone

- `NPM_TOKEN` must be set as a GitHub Actions secret (Settings → Secrets and variables → Actions).
- Squash-merge is recommended in repo settings — changelogen reads conventional commits from the PR title that lands on `main`.

### Switching to npm Trusted Publishing

npm Trusted Publishing (OIDC) removes the need for `NPM_TOKEN`. To switch:

1. In the npmjs.com package settings → **Trusted Publishers** → add GitHub repo `rolleyio/nuxt-c15t`, workflow `release.yml`, environment (leave blank if not using environments).
2. Delete the `NODE_AUTH_TOKEN` / `NPM_TOKEN` env var from the publish step in `.github/workflows/release.yml` — `--provenance` and auth are inferred from the GitHub OIDC token (already granted via `id-token: write`).
3. Publishing still uses `npm publish` (not `pnpm publish` — see [pnpm/pnpm#9812](https://github.com/pnpm/pnpm/issues/9812)).

## Troubleshooting

- **`ERR_PNPM_OUTDATED_LOCKFILE` in CI** — the lockfile drifted from `package.json`. Run `pnpm install` locally, commit `pnpm-lock.yaml`, push.
- **Tag already exists** — `changelogen` bumped but the push failed. Inspect with `git tag` and delete locally (`git tag -d vX.Y.Z`) if you need to retry. Avoid force-pushing tags that have already hit the remote.
- **Publish workflow ran but no npm release** — check the workflow run; `npm publish` can fail silently if provenance can't be signed. Requires Node 22.14+ and `id-token: write` permissions (both configured).
