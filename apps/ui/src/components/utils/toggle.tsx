import classNames from "classnames";
import { ChangeEvent, useState } from "react";

interface SwitchButtonProps {
  initialState?: boolean;
  onToggle: (isChecked: boolean) => void;
  label: string;
  disabled?: boolean;
  description?: string;
  callout?: string;
}

export function Toggle({
  initialState,
  onToggle,
  label,
  disabled,
  description,
  callout,
}: SwitchButtonProps) {
  const [checked, setChecked] = useState(initialState);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }
    setChecked(event.target.checked);
    onToggle(event.target.checked);
  };

  return (
    <div
      className={classNames("flex flex-col gap-2", {
        "opacity-60 ": disabled,
      })}
    >
      <div className="flex items-center gap-0.5">
        <label
          className={classNames(
            "inline-flex relative items-center mr-5 cursor-pointer",
            {
              "cursor-default": disabled,
            },
          )}
        >
          <input
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            onChange={handleChange}
            readOnly
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-graphql-otel-green"></div>
        </label>

        <div className="flex items-center gap-2">
          <span className="font-bold italic text-sm">{label}</span>
          {Number(callout?.length) > 0 && (
            <span className="text-sm">{callout}</span>
          )}
        </div>
      </div>
      {Number(description?.length) > 0 && (
        <span className="text-sm ml-5"> - {description}.</span>
      )}
    </div>
  );
}
