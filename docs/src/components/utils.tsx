import Image from "next/image";

export const iconMapper: Record<
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
