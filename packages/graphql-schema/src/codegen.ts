import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./src/schema.graphql",
  generates: {
    "../ui/src/graphql-types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;
