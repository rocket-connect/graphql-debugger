import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";

import { cn } from "../../utils/cn";

interface ToggleProps {
  initialState?: boolean;
  onToggle: (isChecked: boolean) => void;
  label: string;
  disabled?: boolean;
  description?: string;
  callout?: string;
  alwaysEnabled?: boolean;
  blueToggle?: boolean;
}

export function Toggle({
  initialState,
  onToggle,
  label,
  disabled,
  description,
  callout,
  alwaysEnabled,
  blueToggle,
}: ToggleProps) {
  const [checked, setChecked] = useState(
    (initialState || alwaysEnabled) ?? false,
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (alwaysEnabled || disabled) {
      return;
    }

    setChecked(event.target.checked);
    onToggle(event.target.checked);
  };

  const handleAlwaysEnabled = () => {
    if (alwaysEnabled) {
      toast.error(`${label} cannot be disabled`);
    }
    if (disabled) {
      toast.error(`${label} cannot be enabled, will ship this feature soon`);
    }
  };
  return (
    <div
      className={cn("flex flex-col gap-2", {
        "opacity-60 ": disabled,
      })}
      data-testid="toggle-wrapper"
    >
      <div className="flex items-center gap-0.5">
        <label
          className={"inline-flex relative items-center mr-5  cursor-pointer"}
        >
          <input
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            data-testid="checkbox"
            onChange={handleChange}
            onClick={handleAlwaysEnabled}
            readOnly
          />
          <div
            className={cn(
              "w-11 h-6 bg-gray-300 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-light-green",
              {
                ["peer-checked:bg-indigo-600"]: blueToggle,
              },
            )}
          ></div>
        </label>

        <div className="flex items-center gap-2">
          <span className="font-bold italic text-sm" data-testid="label">
            {label}
          </span>
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
