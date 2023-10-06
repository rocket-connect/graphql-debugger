# Releasing GraphQL Debugger

This monorepo contains several packages and apps and most of them are deployed to npm. This document describes the process of releasing a new version of Debugger.

## Releasing a new version

To release a new version of the packages make sure that you are on the `main` branch and that you have the latest changes.

Then, you can bump all the packages to the new version:

```bash
$ VERSION=0.0.0-alpha.53 START_PATH=. pnpm run release
```

This will change all the packages to the new version and will create a commit and tag with the changes.

> Note that the release command will not modify the monorepo `^workspace` version in the `package.json` files. It will only change the version of the packages. **Changes to the workspace settings are done in the pipelines and are not part of the release process.**

After the release command is finished, it is wize to check the changes and make sure that everything is as expected.

You can do that by running:

```bash
$ git log --name-status HEAD^..HEAD

(HEAD -> main, tag: 0.0.0-alpha.53)

M       apps/backend/package.json
M       apps/collector-proxy/package.json
M       apps/landing-page/app/package.json
M       apps/landing-page/server/package.json
M       apps/ui/package.json
M       e2e/package.json
M       packages/data-access/package.json
M       packages/graphql-debugger/package.json
M       packages/graphql-schema/package.json
M       packages/opentelemetry/package.json
M       packages/queue/package.json
M       packages/schemas/package.json
M       packages/time/package.json
M       packages/trace-directive/package.json
M       packages/trace-schema/package.json
M       packages/types/package.json
M       packages/utils/package.json
M       pnpm-lock.yaml
(END)
```

This will output the contents of the last commit. Make sure that the changes are as expected(only package versions should be changed).

Then, make sure that the tag is created:

```bash
$ git tag

0.0.0-alpha.38
0.0.0-alpha.39
0.0.0-alpha.4
0.0.0-alpha.40
0.0.0-alpha.41
0.0.0-alpha.42
0.0.0-alpha.43
0.0.0-alpha.44
0.0.0-alpha.45
0.0.0-alpha.46
0.0.0-alpha.47
0.0.0-alpha.48
0.0.0-alpha.53 <--- This is the new tag
```

Finally, push the changes to GitHub:

```bash
$ git push && git push --tags
```

This will trigger a release pipeline on GitHub Actions that will publish the packages to npm.
