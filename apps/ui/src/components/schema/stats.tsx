import { UnixNanoTimeStamp } from "@graphql-debugger/time";

import { useQuery } from "@tanstack/react-query";
import { FieldDefinitionNode } from "graphql";
import { useContext } from "react";
import { useParams } from "react-router-dom";

import { DEMO_MODE } from "../../config";
import { ClientContext } from "../../context/client";
import { StatsDetails } from "./stat-details";

export interface StatsProps {
  field: FieldDefinitionNode;
  parentName: string;
}

export function Stats({ field, parentName }: StatsProps) {
  const { client } = useContext(ClientContext);
  const params = useParams<{ schemaId: string }>();
  const name = field.name.value;

  const { data: aggregate } = useQuery({
    queryKey: ["aggregateSpans", name, params.schemaId, parentName],
    queryFn: async () => {
      if (DEMO_MODE) {
        return {
          resolveCount: 20,
          errorCount: 5,
          averageDuration: "1000000",
          lastResolved: "1632825751000000000",
        };
      }

      const response = await client.span.aggregate({
        where: {
          name: `${parentName} ${name}`,
          schemaId: params.schemaId as string,
        },
      });

      return response;
    },
  });

  const lastResolveUnixNano = UnixNanoTimeStamp.fromString(
    aggregate?.lastResolved || "0",
  );
  const averageDurationUnixNano = UnixNanoTimeStamp.fromString(
    aggregate?.averageDuration || "0",
  );

  const hasResolved = lastResolveUnixNano.toString() !== "0";

  return (
    <div className="flex flex-col gap-1 text-neutral/80 pl-4 text-xs">
      <StatsDetails
        statsType="Resolve Count"
        statsDetails={aggregate?.resolveCount}
      />
      <StatsDetails
        statsType="Error Count"
        statsDetails={aggregate?.errorCount}
      />
      <StatsDetails
        statsType="Average Duration"
        statsDetails={averageDurationUnixNano.toMS()}
      />
      {hasResolved && (
        <StatsDetails
          statsType="Last Resolved"
          statsDetails={lastResolveUnixNano.formatUnixNanoTimestamp()}
        />
      )}
    </div>
  );
}
