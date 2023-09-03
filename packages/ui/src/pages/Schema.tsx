import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Schema, Trace } from '../graphql-types';
import { getSchema } from '../api/list-schemas';
import { listTraceGroups } from '../api/list-trace-groups';
import { TraceViewer } from '../components/trace-viewer/TraceViewer';
import { SchemaViewer } from '../components/schema-viewer/SchemaViewer';
import { logo } from '../utils/images';
import { QueryViewer } from '../components/query-viewer/QueryViewer';
import { JsonViewer } from '../components/json-viewer/JsonViewer';
import { SideBar } from '../components/SideBar';
import { SchemaTraces } from '../components/SchemaTraces';
import { deleteTraces } from '../api/delete-traces';
import { UnixNanoTimeStamp } from '@graphql-debugger/time';

export function Schema() {
  const [schema, setSchema] = useState<Schema>();
  const [trace, setTrace] = useState<Trace>();
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedMeta, setSelectedMeta] = useState<'variables' | 'result' | 'context' | 'errors'>(
    'variables'
  );

  const startTimeUnixNano = UnixNanoTimeStamp.fromString(trace?.rootSpan?.startTimeUnixNano || '0');
  const traceDurationUnixNano = UnixNanoTimeStamp.fromString(trace?.rootSpan?.durationNano || '0');

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
            includeSpans: true,
          });

          setTrace(_trace[0]);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [params.traceId, setTrace, searchParams]);

  const _deleteTraces = useCallback(async () => {
    try {
      const where = {
        schemaId: params.schemaId as string,
        rootSpanName: searchParams.get('rootSpanName') || undefined,
      };

      const response = confirm('are you sure you want to delete all traces?');

      if (response) {
        await deleteTraces({ where });
        navigate(`/schema/${params.schemaId}`);
      }
    } catch (error) {
      console.error(error);
    }
  }, [navigate]);

  return (
    <div className="flex flex-row h-screen">
      <div>
        <SideBar />
      </div>
      <div className="grid grid-cols-4 h-full p-3 overflow-y-auto">
        <div className="col-span-1 p-3 flex flex-col overflow-y-auto gap-2">
          <div>
            <h2 className="text-graphiql-light font-bold">Schema</h2>
            <p className="text-graphiql-light py-2 text-xs">
              Your GraphQL Schema with analytics on each field.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto overflow-scoll">
            {schema && <SchemaViewer typeDefs={schema.typeDefs} schemaId={schema.id} />}
          </div>
        </div>

        <div className="col-span-3 flex flex-col bg-graphiql-medium rounded-3xl p-3 gap-3">
          <div className="flex flex-row mx-2 text-graphiql-light text-lg font-bold gap-2 justify-between">
            <div className="py-1 px-4 bg-graphiql-highlight rounded-xl">
              {trace?.rootSpan?.name && (
                <div className="text-graphiql-light text-sm">
                  <div className="flex flex-row gap-3 justify-center align-center">
                    <p>{trace?.rootSpan?.name}</p>
                    <p>-</p>
                    <p className="text-xs my-auto">{traceDurationUnixNano.toMS().toFixed(2)} ms</p>
                  </div>
                  <p className="py-1 text-xs text-graphiql-dark italic">
                    {startTimeUnixNano.toTimeStamp().moment.fromNow()}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-row gap-2 py-1">
              <img className="w-10 my-auto" src={logo}></img>
              <p className="my-auto text-large">GraphQL Debugger</p>
            </div>
          </div>

          <div className="flex flex-row gap-5 w-full h-full overflow-y-hidden">
            <div className="h-full bg-graphiql-dark rounded-3xl w-2/3 flex flex-col justify-between">
              <div className="grow h-96 max-h-96 pt-6 px-6 flex flex-col gap-3">
                <h2 className="text-graphiql-light font-bold">Query</h2>
                <p className="text-graphiql-light text-xs">The issued GraphQL Query.</p>
                <div className="overflow-scroll">
                  {trace?.rootSpan?.graphqlDocument && (
                    <QueryViewer doc={trace?.rootSpan?.graphqlDocument} />
                  )}
                </div>
              </div>
              <div className="grow h-96 max-h-96 p-6 border-t border-graphiql-border flex flex-col gap-3">
                <div className="flex flex-row gap-6 text-graphiql-border font-bold">
                  <p
                    onClick={() => setSelectedMeta('variables')}
                    className={`${
                      selectedMeta === 'variables'
                        ? 'text-graphiql-light'
                        : 'hover:text-graphiql-light hover:font-bold hover:cursor-pointer'
                    }`}
                  >
                    Variables
                  </p>
                  <p
                    onClick={() => setSelectedMeta('result')}
                    className={`${
                      selectedMeta === 'result'
                        ? 'text-graphiql-light'
                        : 'hover:text-graphiql-light hover:font-bold hover:cursor-pointer'
                    }`}
                  >
                    Result
                  </p>
                  <p
                    onClick={() => setSelectedMeta('context')}
                    className={`${
                      selectedMeta === 'context'
                        ? 'text-graphiql-light'
                        : 'hover:text-graphiql-light hover:font-bold hover:cursor-pointer'
                    }`}
                  >
                    Context
                  </p>
                  <p
                    onClick={() => setSelectedMeta('errors')}
                    className={`${
                      selectedMeta === 'errors'
                        ? 'text-graphiql-light'
                        : 'hover:text-graphiql-light hover:font-bold hover:cursor-pointer'
                    }`}
                  >
                    Errors
                  </p>
                </div>

                {selectedMeta === 'variables' && (
                  <p className="text-graphiql-light text-xs">
                    JSON variables attached to the Query.
                  </p>
                )}
                {selectedMeta === 'result' && (
                  <p className="text-graphiql-light text-xs">The result of the Query.</p>
                )}
                {selectedMeta === 'context' && (
                  <p className="text-graphiql-light text-xs">
                    Safe JSON of the GraphQL context obj.
                  </p>
                )}
                {selectedMeta === 'errors' && (
                  <p className="text-graphiql-light text-xs">Errors of each resolver</p>
                )}

                <div className="overflow-scroll h-96 max-h-96 w-96 max-w-96">
                  {selectedMeta === 'variables' && (
                    <JsonViewer json={trace?.rootSpan?.graphqlVariables || '{}'} />
                  )}
                  {selectedMeta === 'result' && (
                    <JsonViewer json={trace?.rootSpan?.graphqlResult || '{}'} />
                  )}
                  {selectedMeta === 'context' && (
                    <JsonViewer json={trace?.rootSpan?.graphqlContext || '{}'} />
                  )}
                  {selectedMeta === 'errors' && (
                    <JsonViewer
                      json={JSON.stringify(
                        (trace?.spans || []).reduce((result, span) => {
                          console.log(span);
                          if (span.errorMessage || span.errorStack) {
                            result[span.name] = {
                              errorMessage: span.errorMessage,
                              errorStack: span.errorStack,
                            };
                          }

                          return result;
                        }, {})
                      )}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 w-full">
              <div className="p-3 h-96 max-h-96 p-6">
                <h2 className="text-graphiql-light font-bold">Trace</h2>
                <p className="text-graphiql-light text-xs py-3">
                  Breakdown of resolver execution time during the query.
                </p>

                <div className="overflow-scroll h-5/6">{trace && <TraceViewer />}</div>
              </div>
              <div className="bg-graphiql-dark rounded-3xl grow h-96 min-h-96">
                <div className="p-6 gap-3 flex flex-row border-b border-graphiql-border">
                  <div>
                    <h2 className="text-graphiql-light font-bold">Traces</h2>
                    <p className="text-graphiql-light text-xs">
                      List of the latest GraphQL queries.
                    </p>
                  </div>

                  <div className="ml-auto">
                    <span className="text-graphiql-light italic text-xs flex flex-row gap-3">
                      <span
                        onClick={() => {
                          navigate(`/schema/${params.schemaId}`);
                        }}
                        className="underline hover:bold hover:cursor-pointer"
                      >
                        Refresh Filters
                      </span>
                      <span
                        onClick={() => {
                          _deleteTraces();
                        }}
                        className="underline hover:bold hover:cursor-pointer"
                      >
                        Delete Traces
                      </span>
                    </span>
                  </div>
                </div>

                <div className="overflow-scroll h-5/6">
                  {schema && <SchemaTraces schemaId={schema.id} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
