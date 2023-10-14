import { UnixNanoTimeStamp } from "@graphql-debugger/time";

import { useQuery } from "@tanstack/react-query";
import { FieldDefinitionNode } from "graphql";
import { useParams } from "react-router-dom";

import { client } from "../../client";
import { StatsDetails } from "./stat-details";

export interface StatsProps {
  field: FieldDefinitionNode;
  parentName: string;
}

export function Stats({ field, parentName }: StatsProps) {
  const params = useParams<{ schemaId: string }>();
  const name = field.name.value;

  const { data: aggregate, isLoading } = useQuery({
    queryKey: ["aggregateSpans", name, params.schemaId, parentName],
    queryFn: async () =>
      await client.span.aggregate({
        where: {
          name: `${parentName} ${name}`,
          schemaId: params.schemaId as string,
        },
      }),
  });

  const lastResolveUnixNano = UnixNanoTimeStamp.fromString(
    aggregate?.lastResolved || "0",
  );
  const averageDurationUnixNano = UnixNanoTimeStamp.fromString(
    aggregate?.averageDuration || "0",
  );

  const hasResolved = lastResolveUnixNano.toString() !== "0";

  return (
    <div className="flex flex-col gap-1 text-neutral-100/80 pl-4 text-xs">
      <StatsDetails
        isLoading={isLoading}
        statsType="Resolve Count"
        statsDetails={aggregate?.resolveCount}
      />
      <StatsDetails
        isLoading={isLoading}
        statsType="Error Count"
        statsDetails={aggregate?.errorCount}
      />
      <StatsDetails
        isLoading={isLoading}
        statsType="Average Duration"
        statsDetails={averageDurationUnixNano.toMS()}
      />
      {hasResolved && (
        <StatsDetails
          isLoading={isLoading}
          statsType="Last Resolved"
          statsDetails={lastResolveUnixNano.formatUnixNanoTimestamp()}
        />
      )}
    </div>
  );
}
