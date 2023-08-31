import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Schema, Trace } from '../graphql-types';
import { getSchema } from '../api/list-schemas';
import { listTraceGroups } from '../api/list-trace-groups';
import { TraceViewer } from '../components/TraceViewer';
import { SchemaViewer } from '../components/SchemaViewer';
import moment from 'moment';

function SchemaTraces({ schemaId }: { schemaId: string }) {
  const navigate = useNavigate();
  const params = useParams();
  const [traces, setTraces] = useState<Trace[]>([]);
  const [selectedTrace, setSelectedTrace] = useState<Trace | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const _traces = await listTraceGroups({
          where: {
            schemaId,
          },
          includeRootSpan: true,
        });

        if (!params.traceId && _traces.length) {
          navigate(`/schema/${schemaId}/trace/${_traces[0].id}`);
        }
        setTraces(_traces);
      } catch (error) {
        console.error(error);
        setTraces([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedTrace) {
      navigate(`/schema/${schemaId}/trace/${selectedTrace?.id}`);
    }
  }, [selectedTrace, traces]);

  return (
    <div className="relative overflow-x-auto h-full overflow-y-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Duration
            </th>
            <th scope="col" className="px-6 py-3">
              When
            </th>
          </tr>
        </thead>
        <tbody>
          {traces.map((trace) => {
            const rootSpan = trace.rootSpan;
            const errorMessage = trace?.firstSpanErrorMessage;
            const startTimeMillis = BigInt(rootSpan?.startTimeUnixNano || 0) / BigInt(1000000);
            const startDate = new Date(Number(startTimeMillis));
            const isSelected = trace.id === params.traceId;

            let traceClasses = 'absolute h-3 ';
            if (isSelected) {
              traceClasses += ' font-bold underline';
            }

            if (errorMessage) {
              traceClasses += ' text-red-500 underline-graphql-otel-red-500';
            } else {
              traceClasses += ' text-green-500 underline-graphql-otel-green';
            }

            return (
              <tr key={trace.id} className="border-b" onClick={() => setSelectedTrace(trace)}>
                <th
                  scope="row"
                  className={`px-6 py-4 font-medium whitespace-nowrap ${traceClasses}`}
                >
                  {rootSpan?.name}
                </th>
                <td className="px-6 py-4">
                  {Number(BigInt(rootSpan?.durationNano || 0) / BigInt(1000000)).toFixed(2)} ms
                </td>
                <td className="px-6 py-4">{moment(startDate).fromNow()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function Schema() {
  const [schema, setSchema] = useState<Schema>();
  const [trace, setTrace] = useState<Trace>();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const _schema = await getSchema(params.schemaId as string);
        setSchema(_schema);
      } catch (error) {
        navigate('/');
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (params.traceId) {
      (async () => {
        try {
          const _trace = await listTraceGroups({
            where: {
              id: params.traceId,
            },
            includeRootSpan: true,
          });

          setTrace(_trace[0]);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [params.traceId, setTrace]);

  return (
    <div className="p-5">
      {schema && (
        <div className="flex p-5 gap-5">
          <div className="w-1/6 overflow-scroll flex-1 h-screen">
            <SchemaViewer typeDefs={schema.typeDefs} schemaId={schema.id} />
          </div>
          <div className="flex flex-col w-4/6 gap-5 h-screen">
            <div className="overflow-scroll h-2/3">{trace && <TraceViewer />}</div>
            <div className="h-1/3 overflow-scroll">
              <SchemaTraces schemaId={schema.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
