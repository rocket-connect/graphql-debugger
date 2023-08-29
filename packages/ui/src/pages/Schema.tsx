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

  return TraceList({ traces, onSelect: setSelectedTrace });
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
    <div>
      {schema && (
        <div>
          {schema.name && <h2 className="text-2xl">{schema.name}</h2>}
          <div className="flex h-screen">
            <div className="p-10 overflow-scroll w-1/5">
              <SchemaViewer typeDefs={schema.typeDefs} />
            </div>
            <div className="h-screen flex-1 flex flex-col p-5 w-4/5">
              <div className="h-1/2 overflow-scroll p-5">{trace && <TraceViewer />}</div>
              <div className="flex-1 h-1/2 overflow-scroll p-5">
                <SchemaTraces schemaId={schema.id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
