import React from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  // Force dark theme for UI/UX preference
  React.useEffect(() => {
    try {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } catch (e) {
      /* ignore server-side */
    }
  }, []);

  return <Component {...pageProps} />;
}
