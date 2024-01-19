import Image from "next/image";
import { DocsThemeConfig } from "nextra-theme-docs";

export default {
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
  footer: {
    content: (
      <span>
        MIT {new Date().getFullYear()} ©{" "}
        <a href="https://rocketconnect.co.uk">Rocket Connect</a>.
      </span>
    ),
  },
} satisfies DocsThemeConfig;
