import { MARKETPLACE_CONTRACT_ADDRESS } from "@src/constants";
import React, { useContext } from "react";
import TronWebType from "tronweb";

interface TronWeb {
  ready: boolean;
  setAddress: (address: string) => void;
  contract: () => {
    at: <T>(address: string) => Promise<T>;
  };
}

const TronWebContext = React.createContext<TronWeb>(0 as never);

const TRONWEB_INSTANCE: TronWeb = new TronWebType(
  "https://api.shasta.trongrid.io",
  "https://api.shasta.trongrid.io",
  "https://api.shasta.trongrid.io",
  "13b7722ff45778b06b780b82c43795baa721cbc328f673e90112266f1429b6c2"
);

if (typeof window !== "undefined") {
  // not sure why this is necessary, seems to accept any address
  TRONWEB_INSTANCE.setAddress(MARKETPLACE_CONTRACT_ADDRESS);
}

export const TronWebProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <TronWebContext.Provider value={TRONWEB_INSTANCE}>
      {children}
    </TronWebContext.Provider>
  );
};

export function useTronWeb() {
  return useContext(TronWebContext);
}
