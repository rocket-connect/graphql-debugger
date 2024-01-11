# GraphQL Debugger Docker

We have docker images for the GraphQL Debugger, to build it locally you can run the following command from the root of the monorepo:

```bash
docker build . -t graphql-debugger -f docker/Dockerfile
```

Then if you want to run you can run the following command:

```bash
docker run --name graphql-debugger -p 16686:16686 -p 4318:4318 graphql-debugger
```

You can add the DEBUG env to the docker run command if you wish to debug things:

```
docker run ..... -e DEBUG="*" graphql-debugger
```
