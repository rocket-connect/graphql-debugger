import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ListTraceGroupsWhere, Schema, Trace } from '../graphql-types';
import { getSchema } from '../api/list-schemas';
import { listTraceGroups } from '../api/list-trace-groups';
import { TraceViewer } from '../components/TraceViewer';
import { SchemaViewer } from '../components/SchemaViewer';
import moment from 'moment';
import { logo } from '../utils/images';
import { QueryViewer } from '../components/QueryViewer';
import { JsonViewer } from '../components/JsonViewer';
import { SideBar } from '../components/SideBar';

function SchemaTraces({ schemaId }: { schemaId: string }) {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [traces, setTraces] = useState<Trace[]>([]);
  const [selectedTrace, setSelectedTrace] = useState<Trace | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const where: ListTraceGroupsWhere = {
          schemaId,
        };

        const name = searchParams.get('rootSpanName');
        if (name) {
          where.rootSpanName = name;
        }

        const _traces = await listTraceGroups({
          where,
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
  }, [searchParams.get('rootSpanName'), schemaId]);

  useEffect(() => {
    if (selectedTrace) {
      navigate(`/schema/${schemaId}/trace/${selectedTrace?.id}?${searchParams.toString()}`);
    }
  }, [selectedTrace, traces]);

  return (
    <div className="relative">
      <table className="text-xs text-left w-full table-fixed">
        <colgroup>
          <col className="w-1/3" />
          <col className="w-1/3" />
          <col className="w-1/3" />
        </colgroup>
        <thead className="text-xs text-graphiql-light">
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
              <tr
                key={trace.id}
                className="border-b border-graphiql-border text-graphiql-light"
                onClick={() => setSelectedTrace(trace)}
              >
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
  const [searchParams] = useSearchParams();
  const [selectedMeta, setSelectedMeta] = useState<'variables' | 'result' | 'errors'>('variables');

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
              {trace?.rootSpan?.graphqlDocument && (
                <p className="text-graphiql-light text-sm">{trace?.rootSpan?.name}</p>
              )}
            </div>
            <div className="flex flex-row gap-2">
              <img className="w-8" src={logo}></img>
              <p>GraphQL Debugger</p>
            </div>
          </div>

          <div className="flex flex-row gap-5 w-full h-full overflow-y-hidden">
            <div className="h-full bg-graphiql-dark rounded-3xl w-2/3 flex flex-col justify-between">
              <div className="grow h-2/3 p-6 flex flex-col gap-3">
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
                    <span
                      onClick={() => {
                        navigate(`/schema/${params.schemaId}`);
                      }}
                      className="text-graphiql-light italic underline hover:bold hover:cursor-pointer text-sm"
                    >
                      Refresh Filters
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
