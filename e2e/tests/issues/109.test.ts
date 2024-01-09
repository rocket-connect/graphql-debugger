import { client } from "../../src/client";
import { Schemas } from "../components/schemas";
import { Traces } from "../components/traces";
import { Dashboard } from "../pages/dashboard";
import { createTestSchema } from "../utils/create-test-schema";
import { Browser, getBrowser, getPage } from "../utils/puppeteer";
import { querySchema } from "../utils/query-schema";
import { sleep } from "../utils/sleep";

describe("issues 109", () => {
  let browser: Browser;

  beforeEach(async () => {
    browser = await getBrowser();
  });

  afterEach(async () => {
    await browser.close();
  });

  test("should not display a trace when there is no root graphql span", async () => {
    const page = await getPage({ browser });
    const { dbSchema, schema, query } = await createTestSchema();

    const response = await querySchema({
      schema: schema,
      query: query,
    });
    expect(response.errors).toBeUndefined();

    await sleep(500);

    const dashboardPage = new Dashboard({
      browser,
      page,
    });

    const traces = await client.trace.findMany({
      where: {
        schemaId: dbSchema.id,
      },
      includeRootSpan: true,
      includeSpans: true,
    });

    const rootSpanId = traces[0]?.spans?.find((s) => s.isGraphQLRootSpan)
      ?.id as unknown as string;
    expect(rootSpanId).toBeDefined();

    await client.span.deleteOne({
      where: {
        id: rootSpanId,
      },
    });

    await sleep(500);

    const sidebar = await dashboardPage.getSidebar();
    await sidebar.toggleView("schemas");

    const schemasComponent = new Schemas({
      browser,
      page: dashboardPage,
    });
    await schemasComponent.clickSchema(dbSchema);

    await page.reload();
    await sleep(500);

    const tracesComponent = new Traces({
      browser,
      page: dashboardPage,
    });
    await tracesComponent.assert();

    // No traces, cant find the table
    await expect(() => tracesComponent.getUITraces()).rejects.toThrow();
  });
});
