import { useCallback } from "react";

export function Toggle({
  name,
  description,
  callout,
  defaultDisabled,
  enabled,
  onToggle,
  color = "graphql-otel-green",
}: {
  name: string;
  description?: string;
  callout?: string;
  defaultDisabled?: boolean;
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  color?: string;
}) {
  const handleToggle = useCallback(() => {
    if (defaultDisabled) {
      return;
    }

    onToggle && onToggle(!enabled);
  }, [enabled, onToggle, defaultDisabled]);

  return (
    <label key={name} className="flex flex-col gap-3 relative cursor-pointer">
      <div
        className={`flex flex-row items-center gap-3 ${
          enabled ? "" : "opacity-40"
        }`}
      >
        <input
          type="checkbox"
          className="sr-only peer"
          checked={enabled}
          onChange={handleToggle}
          disabled={defaultDisabled}
        />
        <div
          className={` 
                    w-11
                    h-6
                    bg-${color}
                    rounded-full
                    after:content-['']
                    after:absolute
                    after:left-[2px] 
                    after:top-[2px]
                    after:bg-white
                    after:transition-all
                    after:rounded-full
                    after:h-5
                    after:w-5
                    peer
                    peer-checked:after:translate-x-full
                `}
        ></div>
        <span className={`ml-3 font-bold italic`}>{name}</span>
        {callout ? <span className="ml-3 italic">{callout}</span> : null}
      </div>
      {description ? <p className="italic ml-5"> - {description}.</p> : null}
    </label>
  );
}
