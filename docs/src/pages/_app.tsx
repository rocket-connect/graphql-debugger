import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleAnalytics } from "nextjs-google-analytics";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleAnalytics gaMeasurementId="G-KWK6N3X1ZD" trackPageViews />
      <Component {...pageProps} />
    </>
  );
}
