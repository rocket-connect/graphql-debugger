import { traceSchema } from "../src";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { printSchemaWithDirectives } from "@graphql-tools/utils";

describe("tracedSchema", () => {
  test("should add trace directive to all fields in schema", () => {
    const typeDefs = `
        type User {
            name: String!
        }

        type Query {
            user: User!
        }
      `;

    const resolvers = {
      Query: {
        user: () => ({ name: "John" }),
      },
    };

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    const tracedSchema = traceSchema({ schema });

    const outputTypedefs = printSchemaWithDirectives(tracedSchema);

    expect(outputTypedefs).toMatchInlineSnapshot(`
"schema {
  query: Query
}

directive @trace on FIELD_DEFINITION

type User {
  name: String! @trace
}

type Query {
  user: User! @trace
}"
`);
  });
});
