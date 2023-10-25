import { prisma } from "@graphql-debugger/data-access";
import {
  dbSpanToNetwork,
  makeValidJSON,
  printTraceErrors,
  sumTraceTime,
} from "@graphql-debugger/utils";

import { parse, print } from "graphql";
import util from "util";

import { UnixNanoTimeStamp } from "../../packages/time/build";
import { Schemas } from "./components/schemas";
import { Trace } from "./components/trace";
import { Traces } from "./components/traces";
import { Dashboard } from "./pages/dashboard";
import { createTestSchema } from "./utils/create-test-schema";
import { Browser, getBrowser, getPage } from "./utils/puppeteer";
import { querySchema } from "./utils/query-schema";

const sleep = util.promisify(setTimeout);

describe("trace", () => {
  let browser: Browser;

  beforeEach(async () => {
    browser = await getBrowser();
  });

  afterEach(async () => {
    await browser.close();
  });

  test("should load the inital trace view", async () => {
    const page = await getPage({ browser });
    const { dbSchema } = await createTestSchema();

    const dashboardPage = new Dashboard({
      browser,
      page,
    });
    await dashboardPage.init();

    const sidebar = await dashboardPage.getSidebar();
    await sidebar.toggleView("schemas");

    const schemasComponent = new Schemas({
      browser,
      page: dashboardPage,
    });
    await schemasComponent.clickSchema(dbSchema);

    const traceComponent = new Trace({
      browser,
      page: dashboardPage,
    });
    await traceComponent.init();

    const tracesComponent = new Traces({
      browser,
      page: dashboardPage,
      trace: traceComponent,
    });
    await tracesComponent.init();
  });

  test("should load a trace correctly", async () => {
    const page = await getPage({ browser });
    const { dbSchema, schema, query } = await createTestSchema();

    const response = await querySchema({
      schema: schema,
      query: query,
    });
    expect(response.errors).toBeUndefined();
    await sleep(200);
    await page.reload();

    const [trace] = await prisma.traceGroup.findMany({
      where: {
        schemaId: dbSchema.id,
      },
      include: {
        spans: true,
      },
    });

    const dashboardPage = new Dashboard({
      browser,
      page,
    });

    const sidebar = await dashboardPage.getSidebar();
    await sidebar.toggleView("schemas");

    const schemasComponent = new Schemas({
      browser,
      page: dashboardPage,
    });
    await schemasComponent.clickSchema(dbSchema);

    const traceComponent = new Trace({
      browser,
      page: dashboardPage,
    });
    await traceComponent.init();

    const tracesComponent = new Traces({
      browser,
      page: dashboardPage,
      trace: traceComponent,
    });
    await tracesComponent.init();
    await tracesComponent.clickTrace({
      schemaId: dbSchema.id,
      traceId: trace.id,
    });

    const rootSpan = trace.spans.find((span) => span.isGraphQLRootSpan);

    const startTimeUnixNano = UnixNanoTimeStamp.fromString(
      rootSpan?.startTimeUnixNano.toString() || "0",
    );

    const traceDurationUnixNano =
      trace &&
      sumTraceTime({
        id: trace.id,
        traceId: trace.traceId,
        spans: trace.spans.map((span) => dbSpanToNetwork(span)),
      });

    const traceDurationSIUnits = traceDurationUnixNano?.toSIUnits();

    const pill = await traceComponent.getPill();
    expect(pill).toBeTruthy();
    expect(pill.name).toBe(
      trace.spans.find((span) => span.isGraphQLRootSpan)?.name,
    );

    const neturalColor = "rgb(59, 75, 104)";
    expect(pill.color).toBe(neturalColor);
    expect(pill.start).toBe(startTimeUnixNano.formatUnixNanoTimestamp());
    expect(pill.duration).toBe(
      `${traceDurationSIUnits?.value.toFixed(2)} ${traceDurationSIUnits?.unit}`,
    );

    const editorValues = await traceComponent.getEditorValues({
      includeError: false,
    });
    expect(editorValues).toBeTruthy();

    expect(print(parse(editorValues.query))).toEqual(rootSpan?.graphqlDocument);

    expect(JSON.parse(editorValues.variables as string)).toMatchObject(
      JSON.parse(rootSpan?.graphqlVariables as string),
    );

    expect(JSON.parse(editorValues.result as string)).toMatchObject(
      JSON.parse(rootSpan?.graphqlResult as string),
    );
  });

  test("should load a error trace correctly", async () => {
    const page = await getPage({ browser });
    const { dbSchema, schema, query } = await createTestSchema({
      shouldError: true,
    });

    const response = await querySchema({
      schema: schema,
      query: query,
    });
    expect(response.errors).toBeDefined();
    await sleep(200);
    await page.reload();

    const [trace] = await prisma.traceGroup.findMany({
      where: {
        schemaId: dbSchema.id,
      },
      include: {
        spans: true,
      },
    });

    const dashboardPage = new Dashboard({
      browser,
      page,
    });

    const sidebar = await dashboardPage.getSidebar();
    await sidebar.toggleView("schemas");

    const schemasComponent = new Schemas({
      browser,
      page: dashboardPage,
    });
    await schemasComponent.clickSchema(dbSchema);

    const traceComponent = new Trace({
      browser,
      page: dashboardPage,
    });
    await traceComponent.init();

    const tracesComponent = new Traces({
      browser,
      page: dashboardPage,
      trace: traceComponent,
    });
    await tracesComponent.init();
    await tracesComponent.clickTrace({
      schemaId: dbSchema.id,
      traceId: trace.id,
    });

    const rootSpan = trace.spans.find((span) => span.isGraphQLRootSpan);

    const pill = await traceComponent.getPill();
    expect(pill).toBeTruthy();
    expect(pill.name).toBe(
      trace.spans.find((span) => span.isGraphQLRootSpan)?.name,
    );
    const red = "rgb(239, 68, 68)";
    expect(pill.color).toBe(red);

    const editorValues = await traceComponent.getEditorValues({
      includeError: true,
    });
    expect(editorValues).toBeTruthy();

    expect(print(parse(editorValues.query))).toEqual(rootSpan?.graphqlDocument);

    expect(JSON.parse(editorValues.variables as string)).toMatchObject(
      JSON.parse(rootSpan?.graphqlVariables as string),
    );

    const sanaitizedUIError = JSON.parse(
      makeValidJSON(editorValues.error as string),
    );
    expect(sanaitizedUIError).toMatchObject(
      JSON.parse(
        printTraceErrors({
          id: trace.id,
          traceId: trace.traceId,
          spans: trace.spans.map((span) => dbSpanToNetwork(span)),
        }),
      ),
    );
  });
});
