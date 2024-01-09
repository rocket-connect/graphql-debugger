import {
  makeValidJSON,
  printTraceErrors,
  sumTraceTime,
} from "@graphql-debugger/utils";

import { faker } from "@faker-js/faker";
import { parse, print } from "graphql";

import { UnixNanoTimeStamp } from "../../packages/time/build";
import { client } from "../src/client";
import { Schemas } from "./components/schemas";
import { Trace } from "./components/trace";
import { Traces } from "./components/traces";
import { Dashboard } from "./pages/dashboard";
import { colors } from "./utils/colors";
import { createTestSchema } from "./utils/create-test-schema";
import { Browser, getBrowser, getPage } from "./utils/puppeteer";
import { querySchema } from "./utils/query-schema";
import { sleep } from "./utils/sleep";

describe("trace", () => {
  let browser: Browser;

  beforeEach(async () => {
    browser = await getBrowser();
  });

  afterEach(async () => {
    await browser.close();
  });

  const randomFieldName = faker.string.alpha(8);

  const variants = [
    {
      name: "should load a success trace correctly",
      shouldError: false,
      randomFieldName,
      client,
    },
    {
      name: "should load an error trace correctly",
      shouldError: true,
      randomFieldName,
      client,
    },
    {
      name: "should load a named query correctly",
      shouldError: false,
      randomFieldName,
      shouldNameQuery: true,
      client,
    },
  ];

  for (const variant of variants) {
    test(variant.name, async () => {
      const page = await getPage({ browser });
      const { dbSchema, schema, query } = await createTestSchema(variant);

      const response = await querySchema({ schema, query });
      if (variant.shouldError) {
        expect(response.errors).toBeDefined();
      } else {
        expect(response.errors).toBeUndefined();
      }
      await sleep(200);
      await page.reload();

      const [trace] = await client.trace.findMany({
        where: {
          schemaId: dbSchema.id,
        },
        includeSpans: true,
      });

      const dashboardPage = new Dashboard({ browser, page });
      const sidebar = await dashboardPage.getSidebar();
      await sidebar.toggleView("schemas");

      const schemasComponent = new Schemas({ browser, page: dashboardPage });
      await schemasComponent.clickSchema(dbSchema);

      const traceComponent = new Trace({ browser, page: dashboardPage });
      const tracesComponent = new Traces({ browser, page: dashboardPage });
      await tracesComponent.clickTrace({
        schemaId: dbSchema.id,
        traceId: trace.id,
      });

      const rootSpan = trace.spans.find((span) => span.isGraphQLRootSpan);
      const startTimeUnixNano = UnixNanoTimeStamp.fromString(
        rootSpan?.startTimeUnixNano.toString() || "0",
      );
      const traceDurationUnixNano = sumTraceTime({
        id: trace.id,
        traceId: trace.traceId,
        spans: trace.spans,
      });
      const traceDurationSIUnits = traceDurationUnixNano?.toSIUnits();

      const pill = await traceComponent.getPill();
      expect(pill).toBeTruthy();
      if (variant.shouldNameQuery) {
        expect(pill.name).toBe(
          `${rootSpan?.graphqlOperationType} ${variant.randomFieldName}`,
        );
      } else {
        expect(pill.name).toBe(rootSpan?.name);
      }

      if (variant.shouldError) {
        expect(pill.color).toBe(colors.red_text);
      } else {
        expect(pill.color).toBe(colors.netural_text);
        expect(pill.start).toBe(startTimeUnixNano.formatUnixNanoTimestamp());
        expect(pill.duration).toBe(
          `${traceDurationSIUnits?.value.toFixed(
            2,
          )} ${traceDurationSIUnits?.unit}`,
        );
      }

      const editorValues = await traceComponent.getEditorValues({
        includeError: variant.shouldError,
      });
      expect(editorValues).toBeTruthy();

      expect(print(parse(editorValues.query))).toEqual(
        rootSpan?.graphqlDocument,
      );
      expect(JSON.parse(editorValues.variables as string)).toMatchObject(
        JSON.parse(rootSpan?.graphqlVariables as string),
      );

      if (variant.shouldError) {
        const sanitizedUIError = JSON.parse(
          makeValidJSON(editorValues.error as string),
        );
        expect(sanitizedUIError).toMatchObject(
          JSON.parse(
            printTraceErrors({
              id: trace.id,
              traceId: trace.traceId,
              spans: trace.spans,
            }),
          ),
        );
      } else {
        expect(JSON.parse(editorValues.result as string)).toMatchObject(
          JSON.parse(rootSpan?.graphqlResult as string),
        );
      }
    });
  }
});
