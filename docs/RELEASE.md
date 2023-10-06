# Releasing GraphQL Debugger

This monorepo contains several packages and apps and most of them are deployed to npm. This document describes the process of releasing a new version of Debugger.

## Releasing a new version

To release a new version of the packages make sure that you are on the `main` branch and that you have the latest changes from the remote repository.

Then, you can bump all the packages to the new version:

```bash
VERSION=1.0.0 START_PATH=. pnpm run release
```

This will change all the packages to the new version and will create a commit and tag with the changes.

> Note that the release command will not modify the monorepo `^workspace` version in the `package.json` files. It will only change the version of the packages. **Changes to the workspace settings are done in the pipelines and are not part of the release process.**

After the release command is finished, you can push the changes to the remote repository:

```bash
git push && git push --tags
```

This will trigger a release pipeline on GitHub Actions that will publish the packages to npm.
