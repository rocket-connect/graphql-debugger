import Image from "next/image";
import { DocsThemeConfig } from "nextra-theme-docs";

export default {
  head: (
    <>
      <meta charSet="UTF-8" />
      <meta name="description" content="Debug your GraphQL server." />
      <meta
        name="keywords"
        content="visualization, debugger, graphql, debugging, schema, interface, debug, graphiql, developer-tools, user-interface, jaeger, tracing, otel, opentelemetry, observability"
      />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="GraphQL Debugger" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="https://graphql-debugger.com/" />
      <meta name="twitter:title" content="GraphQL Debugger" />
      <meta name="twitter:description" content="Debug your GraphQL server." />
      <meta
        name="twitter:image"
        content="https://preview.graphql-debugger.com/img/banner.png"
      />

      <meta property="og:type" content="article" />
      <meta property="og:title" content="GraphQL Debugger" />
      <meta property="og:description" content="Debug your GraphQL server." />
      <meta property="og:url" content="https://graphql-debugger.com/" />
      <meta
        property="og:image"
        content="https://preview.graphql-debugger.com/img/banner.png"
      />

      <link
        rel="shortcut icon"
        href="https://preview.graphql-debugger.com/favicon.svg"
        type="image/svg"
      />
    </>
  ),
  logo: (
    <div className="flex gap-3">
      <Image
        src="/img/logo.svg"
        alt="GraphQL Debugger Logo"
        width={36}
        height={36}
        priority
      />
      <span className="text-[#008844] text-xl font-bold my-auto">
        GraphQL Debugger
      </span>
    </div>
  ),
  docsRepositoryBase: "https://github.com/rocket-connect/graphql-debugger",
  color: {
    hue: 150,
  },
  project: {
    link: "https://github.com/rocket-connect/graphql-debugger",
  },
  footer: {
    content: (
      <span>
        MIT {new Date().getFullYear()} ©{" "}
        <a href="https://rocketconnect.co.uk">Rocket Connect</a>.
      </span>
    ),
  },
} satisfies DocsThemeConfig;
