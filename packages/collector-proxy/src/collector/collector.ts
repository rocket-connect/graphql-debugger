import express, { Express } from 'express';
import { prisma } from '../prisma';
import { z } from 'zod';
import { ExportTraceServiceRequestSchema } from './schema';
import { debug } from '../debug';

export const collector: Express = express();
collector.use(express.json());

const schema = z.object({
  body: ExportTraceServiceRequestSchema.required(),
});

collector.post('/v1/traces', async (req, res) => {
  try {
    let body: z.infer<typeof schema>['body'];

    try {
      const parsed = schema.parse({ body: req.body });
      body = parsed.body;
    } catch (error) {
      debug('Error parsing body', error);

      return res
        .status(400)
        .json({
          message: (error as Error).message,
        })
        .end();
    }

    const spans = (body.resourceSpans || []).flatMap((rS) => {
      const _spans = rS.scopeSpans.flatMap((sS) => {
        return (sS.spans || []).map((s) => {
          const attributes = s.attributes.reduce((acc, val) => {
            const value = val.value;
            let realValue: any;

            if (value.boolValue !== undefined) {
              realValue = value.boolValue;
            } else if (value.stringValue !== undefined) {
              realValue = value.stringValue;
            } else if (value.intValue !== undefined) {
              realValue = value.intValue;
            } else if (value.doubleValue !== undefined) {
              realValue = value.doubleValue;
            } else if (value.arrayValue !== undefined) {
              realValue = value.arrayValue;
            }

            return { ...acc, [val.key]: realValue };
          }, {});

          return {
            spanId: s.spanId,
            traceId: s.traceId,
            parentSpanId: s.parentSpanId,
            name: s.name,
            kind: s.kind,
            startTimeUnixNano: s.startTimeUnixNano,
            endTimeUnixNano: s.endTimeUnixNano,
            attributes: JSON.stringify(attributes),
          };
        });
      });

      return _spans;
    });

    for await (const span of spans) {
      let traceGroupId = '';

      const foundTraceGroup = await prisma.traceGroup.findFirst({
        where: {
          traceId: span.traceId,
        },
      });

      if (foundTraceGroup) {
        traceGroupId = foundTraceGroup?.id;
      } else {
        const createdTraceGroup = await prisma.traceGroup.create({
          data: {
            traceId: span.traceId,
          },
        });
        traceGroupId = createdTraceGroup.id;
      }

      await prisma.span.create({
        data: {
          spanId: span.spanId,
          parentSpanId: span.parentSpanId,
          name: span.name,
          kind: span.kind.toString(),
          startTimeUnixNano: span.startTimeUnixNano,
          endTimeUnixNano: span.endTimeUnixNano,
          attributes: span.attributes,
          traceId: span.traceId,
          traceGroupId,
        },
      });
    }

    return res.status(200).json({}).end();
  } catch (error) {
    debug('Error posting traces', error);

    return res.status(500).json({}).end();
  }
});
