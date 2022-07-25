import "@src/globals.css";
import type { AppProps } from "next/app";
import { AppPage } from "../types";
import { applyDefaultLayout } from "../layouts/DefaultLayout";
import { TronLinkProvider } from "@src/context/TronLink";
import { TronWebProvider } from "@src/context/TronWeb";
import { MarketplaceProvider } from "@src/context/Marketplace";

function MyApp({ Component, pageProps }: AppProps) {
  const applyLayout = (Component as AppPage).applyLayout || applyDefaultLayout;

  return (
    <TronWebProvider>
      <TronLinkProvider>
        <MarketplaceProvider>
          {applyLayout(<Component {...pageProps} />)}
        </MarketplaceProvider>
      </TronLinkProvider>
    </TronWebProvider>
  );
}

export default MyApp;
