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

### Authentication

Publishing uses **npm Trusted Publishing** (OIDC) — no `NPM_TOKEN` secret is stored in the repo. The OIDC token is granted by the `id-token: write` permission in `release.yml`, and the npmjs.com package is configured with `rolleyio/nuxt-c15t` + `release.yml` as a Trusted Publisher.

If the Trusted Publishing config on npmjs.com ever gets removed or the workflow filename changes, publish will fail with a 403. Re-add the repo as a Trusted Publisher on the package's Access page.

### Repo settings that matter

- Squash-merge only, with "default commit message = pull request title" — `changelogen` reads conventional commits from the PR title that lands on `main`.
- Branch protection on `main` should allow tag creation from any commit; no direct pushes are needed for releases (the tag is pushed from your laptop).

## Troubleshooting

- **`ERR_PNPM_OUTDATED_LOCKFILE` in CI** — the lockfile drifted from `package.json`. Run `pnpm install` locally, commit `pnpm-lock.yaml`, push.
- **Tag already exists** — `changelogen` bumped but the push failed. Inspect with `git tag` and delete locally (`git tag -d vX.Y.Z`) if you need to retry. Avoid force-pushing tags that have already hit the remote.
- **Publish workflow ran but no npm release** — check the workflow run; `npm publish` can fail silently if provenance can't be signed. Requires Node 22.14+ and `id-token: write` permissions (both configured).
