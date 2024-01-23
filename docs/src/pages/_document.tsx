import { GoogleAnalytics } from "@next/third-parties/google";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <GoogleAnalytics gaId="G-KWK6N3X1ZD" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
