import classNames from "classnames";
import { useNavigate, useSearchParams } from "react-router-dom";

import { FieldNameProps } from "./types";
import { processedType } from "./utils";

export const FieldName = ({ parentName, name, type }: FieldNameProps) => {
  const [searchParams] = useSearchParams();
  const rootSpanName = searchParams.get("rootSpanName");
  const navigate = useNavigate();

  const _rootSpanName = `${parentName} ${name}`;

  const handleNavigate = () => {
    if (!["query", "mutation"].includes(parentName)) return;
    navigate(
      `?${new URLSearchParams({
        rootSpanName: _rootSpanName,
      }).toString()}`,
    );
  };

  return (
    <div className="flex items-center gap-2 text-s">
      <span
        className={classNames("text-md text-neutral-100 hover:cursor-pointer", {
          "font-medium decoration-graphiql-pink":
            rootSpanName === _rootSpanName,
          "hover:cursor-default": !["query", "mutation"].includes(parentName),
        })}
        onClick={handleNavigate}
      >
        {name}:
      </span>
      <span className="text-secondary-blue">{processedType(type)}</span>
    </div>
  );
};
