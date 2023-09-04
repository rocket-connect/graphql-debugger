import { BACKEND_PORT } from '@graphql-debugger/backend';
import { prisma } from './prisma';
import { getBrowser, getPage, Browser } from './puppeteer';
import { IDS } from '@graphql-debugger/ui/src/testing';
import util from 'util';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { traceSchema, GraphQLOTELContext } from '@graphql-debugger/trace-schema';
import { graphql, hashSchema } from '@graphql-debugger/utils';

const sleep = util.promisify(setTimeout);

describe('schema', () => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await getBrowser();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('should fetch and display the schema with stats', async () => {
    const schemas = await prisma.schema.count();
    expect(schemas).toBe(0);

    const typeDefs = `
      type User {
        id: ID!
        name: String!
      }

      type Query {
        users: [User]
      }
    `;

    const resolvers = {
      Query: {
        users: () => {
          return [
            {
              id: 1,
              name: 'John',
            },
          ];
        },
      },
    };

    const executableSchema = makeExecutableSchema({
      typeDefs: typeDefs,
      resolvers,
    });

    const tracedSchema = traceSchema({
      schema: executableSchema,
    });

    const hash = hashSchema(tracedSchema);

    const schema = await prisma.schema.create({
      data: {
        hash,
        typeDefs,
      },
    });

    await sleep(1000);

    const page = await getPage({ browser });

    await page.goto(`http://localhost:${BACKEND_PORT}/#/schema/${schema.id}`);

    await page.waitForNetworkIdle();

    await page.waitForSelector(`#${IDS.SCHEMA}`);
    const dataValues = await page.$$eval(`#${IDS.SCHEMA}`, (divs) =>
      divs.map((div) => div.dataset.schema)
    );

    expect(dataValues).toHaveLength(1);
    expect(dataValues[0]).toBe(schema.id);

    const response = await graphql.graphql({
      schema: tracedSchema,
      source: '{ users { id name } }',
      contextValue: {
        GraphQLOTELContext: new GraphQLOTELContext({
          includeResult: true,
          includeContext: true,
          includeVariables: true,
        }),
      },
    });
    expect(response.errors).toBeUndefined();

    await sleep(5000);
    await page.reload();
    await page.waitForNetworkIdle();

    await page.waitForSelector(`#${IDS.SCHEMA}`);
    await page.waitForSelector(`#${IDS.SCHEMA_TRACES}`);

    const traces = await prisma.traceGroup.findMany({
      where: {
        schemaId: schema.id,
      },
      select: {
        spans: true,
      },
    });

    expect(traces).toHaveLength(1);

    const trace = traces[0];
    expect(trace.spans.length).toEqual(3);

    const rootSpan = trace.spans.find((span) => !span.parentSpanId);
    expect(rootSpan).toBeDefined();
    expect(rootSpan?.name).toEqual(`query users`);
    expect(graphql.print(graphql.parse(rootSpan?.graphqlDocument as string))).toEqual(
      graphql.print(graphql.parse('{ users { id name } }'))
    );
    expect(rootSpan?.graphqlResult).toBeDefined();

    const idSpan = trace.spans.find((span) => span.name === 'User id');
    expect(idSpan).toBeDefined();

    const nameSpan = trace.spans.find((span) => span.name === 'User name');
    expect(nameSpan).toBeDefined();

    await page.waitForSelector(`[data-spanid*="${rootSpan?.id}"]`);

    await page.waitForSelector(`#${IDS.TRACE_VIEWER}`);

    await page.waitForSelector(`[data-trace-view-spanid*="${rootSpan?.id}"]`);

    await page.waitForSelector(`#${IDS.QUERY_VIEWER}`);

    await page.waitForSelector(`[data-query-view-spanid*="${rootSpan?.id}"]`);

    await page.waitForSelector(`#${IDS.RESULT_BUTTON}`);
    await page.click(`#${IDS.RESULT_BUTTON}`);
    await page.waitForSelector(`#${IDS.JSON_VIEWER}`);

    const jsonValues = await page.$$eval(`#${IDS.JSON_VIEWER}`, (divs) =>
      divs.map((div) => div.dataset.json)
    );

    expect(jsonValues[0]).toEqual(rootSpan?.graphqlResult);

    await sleep(1000);
    await page.close();
  });
});
