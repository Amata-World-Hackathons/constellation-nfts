import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useTronWeb } from "@src/context/TronWeb";
import { AsyncResult } from "@src/types";
import { MARKETPLACE_CONTRACT_ADDRESS } from "@src/constants";
import { proxyCall, proxySend } from "@src/contracts/utils";
import { useTronLinkAccount } from "./TronLink";

export interface ConstellationNFTCollection {}

export interface Marketplace {
  getCollections: () => Promise<ConstellationNFTCollection[]>;
  mintCollection: (
    name: string,
    symbol: string
  ) => Promise<ConstellationNFTCollection>;
}

const MarketplaceContext = React.createContext<Marketplace>(0 as never);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const tronWeb = useTronWeb();
  const account = useTronLinkAccount();

  const web = account.tronWeb || tronWeb;

  const promise = useMemo<Promise<any>>(
    () => web.contract().at(MARKETPLACE_CONTRACT_ADDRESS),
    [web]
  );

  promise.then((c) => console.log("PROM", c));

  const marketplace = useMemo<Marketplace>(
    () => ({
      getCollections: () =>
        promise.then((contract) =>
          proxyCall<ConstellationNFTCollection[]>(contract, "getCollections")()
        ),

      mintCollection: (name: string, symbol: string) =>
        promise.then((contract) =>
          proxySend<ConstellationNFTCollection[]>(contract, "mintCollection")(
            name,
            symbol
          )
        ),
    }),
    [promise]
  );

  return (
    <MarketplaceContext.Provider value={marketplace}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export function useMarketplace() {
  return useContext(MarketplaceContext);
}

export function useMarketplaceCollections(): AsyncResult<any[]> {
  const marketplace = useMarketplace();
  const [result, setResult] = useState<AsyncResult<any[]>>({
    loading: true,
    refetch: async () => {},
  });

  const refetch = useCallback(async () => {
    setResult({
      loading: true,
      refetch,
    });

    marketplace
      .getCollections()
      .then((collections) => {
        setResult({
          loading: false,
          data: collections,
          refetch,
        });
      })
      .catch((err) => {
        console.log("ERROR", err);
        setResult({
          loading: false,
          error: err.message || err,
          refetch,
        });
      });
  }, [marketplace]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return result;
}
