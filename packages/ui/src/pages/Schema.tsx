import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Schema, Trace } from '../graphql-types';
import { getSchema } from '../api/list-schemas';
import { listTraceGroups } from '../api/list-trace-groups';
import { TraceList } from '../components/TraceList';
import { TraceViewer } from '../components/TraceViewer';
import { SchemaViewer } from '../components/SchemaViewer';

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
    <div className="">
      <TraceList traces={traces} onSelect={setSelectedTrace} />
    </div>
  );
}

export function Schema() {
  const [schema, setSchema] = useState<Schema>();
  const [trace, setTrace] = useState<Trace>();
  const params = useParams();

  useEffect(() => {
    (async () => {
      try {
        const _schema = await getSchema(params.schemaId as string);
        setSchema(_schema);
      } catch (error) {
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
    <div className="p-10">
      {schema && (
        <div className="flex p-10 gap-10">
          <div className="w-1/6 overflow-scroll flex-1 h-screen">
            <SchemaViewer typeDefs={schema.typeDefs} />
          </div>
          <div className="flex flex-col w-4/6 gap-10 h-screen">
            <div className="overflow-scroll h-1/2">{trace && <TraceViewer />}</div>
            <div className="h-1/2 overflow-scroll ">
              <SchemaTraces schemaId={schema.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
