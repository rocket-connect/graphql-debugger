import { DocsThemeConfig } from "nextra-theme-docs";

export default {
  banner: {
    content: <>Some React Content Here</>,
  },
  logo: (
    <span className="text-[#e10098] flex gap-2 items-center text-xl">
      GraphQL Debugger
    </span>
  ),
  docsRepositoryBase: "https://github.com/graphql/graphql.github.io",
  color: {
    hue: 319,
  },
} satisfies DocsThemeConfig;
