import { prisma } from "@graphql-debugger/data-access";

import util from "util";

import { Schema } from "./components/schema";
import { Trace } from "./components/trace";
import { Traces } from "./components/traces";
import { Dashboard } from "./pages/dashboard";
import { createTestSchema } from "./utils/create-test-schema";
import { Browser, getBrowser, getPage } from "./utils/puppeteer";
import { querySchema } from "./utils/query-schema";

const sleep = util.promisify(setTimeout);

describe("traces", () => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await getBrowser();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("should load and display a list of traces", async () => {
    const page = await getPage({ browser });
    const { dbSchema, schema, query } = await createTestSchema();

    const dashboardPage = new Dashboard({
      browser,
      page,
    });
    await dashboardPage.init();

    const sidebar = await dashboardPage.getSidebar();
    await sidebar.toggleView("schemas");

    const schemaComponent = new Schema({
      browser,
      page: dashboardPage,
      dbSchema,
    });
    await schemaComponent.init();

    const response = await querySchema({
      schema: schema,
      query: query,
    });
    expect(response.errors).toBeUndefined();
    await page.reload();
    await sleep(2000);

    const [trace] = await prisma.traceGroup.findMany({
      where: {
        schemaId: dbSchema.id,
      },
      include: {
        spans: true,
      },
    });

    console.log(trace.spans);

    const traceComponent = new Trace({
      browser,
      page: dashboardPage,
      dbTraceGroup: trace,
    });
    await traceComponent.init();

    const tracesComponent = new Traces({
      browser,
      page: dashboardPage,
      trace: traceComponent,
    });
    await tracesComponent.init();

    const uiTraces = await tracesComponent.getUITraces();
    const uiTrace = uiTraces.find((t) => t.id === trace.id);
    expect(uiTrace).toBeDefined();

    expect(uiTraces.length).toEqual(1);
    expect(uiTraces[0].id).toEqual(trace.id);
    expect(uiTraces[0].name).toEqual(
      trace.spans.find((span) => span.isGraphQLRootSpan)?.name,
    );

    await tracesComponent.clickTrace(trace.id);

    await sleep(10000);
    // const rootSpan = trace.spans.find((span) => !span.parentSpanId);
    // expect(rootSpan).toBeDefined();
    // expect(rootSpan?.name).toEqual(`query users`);
    // expect(print(parse(rootSpan?.graphqlDocument as string))).toEqual(
    //   print(parse("{ users { id name } }")),
    // );
    // expect(rootSpan?.graphqlResult).toBeDefined();

    // const idSpan = trace.spans.find((span) => span.name === "User id");
    // expect(idSpan).toBeDefined();

    // const nameSpan = trace.spans.find((span) => span.name === "User name");
    // expect(nameSpan).toBeDefined();

    // await page.waitForSelector(`#${IDS.TRACE_VIEWER}`);

    // await page.waitForSelector(`[data-trace-view-spanid*="${rootSpan?.id}"]`);

    // await page.waitForSelector(`#${IDS.EXPAND_VARIABLES}`);
    // await page.click(`#${IDS.EXPAND_VARIABLES}`);
    // await page.waitForSelector(`#${IDS.QUERY_VIEWER}`);

    // await page.waitForSelector(`[data-query-view-spanid*="${rootSpan?.id}"]`);

    // await page.waitForSelector(`#${IDS.RESULT_BUTTON}`);
    // await page.click(`#${IDS.RESULT_BUTTON}`);
    // await page.waitForSelector(`#${IDS.JSON_VIEWER}`);

    // const jsonValues = await page.$$eval(`#${IDS.JSON_VIEWER}`, (divs) =>
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   divs.map((div) => div.dataset.json),
    // );

    // expect(jsonValues[0]).toEqual(rootSpan?.graphqlResult);

    // await page.close();
  });
});
