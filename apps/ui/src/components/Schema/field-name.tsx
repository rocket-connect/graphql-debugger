import classNames from "classnames";
import { useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { FieldNameProps } from "./types";
import { processedType } from "./utils";

export function FieldName({ name, parentName, type }: FieldNameProps) {
  const params = useParams<{ schemaId: string }>();
  const [searchParams] = useSearchParams();
  const rootSpanName = searchParams.get("rootSpanName");
  const navigate = useNavigate();

  const fieldQueryName = `${parentName} ${name}`;

  const handleNavigate = useCallback(() => {
    if (!["query", "mutation"].includes(parentName)) return;
    navigate(
      `/schema/${params.schemaId}?${new URLSearchParams({
        rootSpanName: fieldQueryName,
      }).toString()}`,
    );
  }, [parentName, fieldQueryName, navigate, params.schemaId]);

  return (
    <div className="flex items-center gap-2 text-s">
      <span
        className={classNames("text-md text-neutral-100 hover:cursor-pointer", {
          "font-medium decoration-graphiql-pink":
            rootSpanName === fieldQueryName,
          "hover:cursor-default": !["query", "mutation"].includes(parentName),
        })}
        onClick={handleNavigate}
      >
        {name}:
      </span>
      <span className="text-secondary-blue">{processedType(type)}</span>
    </div>
  );
}
