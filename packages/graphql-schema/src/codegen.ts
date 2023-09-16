import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./src/schema.graphql",
  generates: {
    "../types/src/graphql-types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;
