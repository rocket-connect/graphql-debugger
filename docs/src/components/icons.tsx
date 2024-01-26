import Image from "next/image";

const iconMapper: Record<
  "typeScript" | "otel" | "mit" | "graphql",
  {
    icon: JSX.Element;
    label: string;
  }
> = {
  typeScript: {
    icon: (
      <Image
        src="/img/typescript-icon.svg"
        alt="Typescript icon"
        width={40}
        height={40}
        priority
      />
    ),
    label: `Written in Typescript and published to NPM.`,
  },
  otel: {
    icon: (
      <Image
        src="/img/otel-icon.svg"
        alt="Otel icon"
        width={40}
        height={40}
        priority
      />
    ),
    label: `Compliant with your OpenTelemetry tools.`,
  },
  mit: {
    icon: (
      <Image
        src="/img/mit-icon.svg"
        alt="MIT License icon"
        width={40}
        height={40}
        priority
      />
    ),
    label: `Open Source and hosted on Github.`,
  },
  graphql: {
    icon: (
      <Image
        src="/img/graphql-icon.svg"
        alt="Graphql icon"
        width={40}
        height={40}
        priority
      />
    ),
    label: `Fits into your
    existing workflow.`,
  },
};

export function Icons() {
  return (
    <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
      {Object.values(iconMapper).map((item) => {
        return (
          <div key={item.label} className="flex flex-col items-center gap-10">
            <div>{item.icon}</div>
            <div>{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}
