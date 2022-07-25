import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Preloader } from "@src/ui/progress/Preloader";
import { useTronWeb } from "./TronWeb";

type TronWeb = {
  ready: boolean;
  defaultAddress: {
    hex: string;
    base58: string;
    name: string;
    type: number;
  };
};

type TronLinkObjRequest = (params: {
  method: "tron_requestAccounts";
}) => Promise<
  | {
      code: 200 | 4000 | 4001;
      message: string;
    }
  | ""
>;

interface TronLinkObjReady {
  ready: true;
  tronWeb: TronWeb;
  sunWeb: any;
  request: TronLinkObjRequest;
}

interface TronLinkObjNotReady {
  ready: false;
  request: TronLinkObjRequest;
}

type TronLinkInjectedObject = TronLinkObjReady | TronLinkObjNotReady;

interface TronLinkUser {
  isLoggedIn: true;
  name: string;
  addressHex: string;
  addressBase58: string;
  tronWeb: TronWeb;
  disconnect: () => void;
}

interface TronLinkAnonymous {
  isLoggedIn: false;
  connect: () => Promise<unknown>;
}

export type TronLinkAccount = TronLinkUser | TronLinkAnonymous;

const TronLinkContext = React.createContext<TronLinkAccount>(0 as never);

function getTronLink(): TronLinkInjectedObject | undefined {
  return (window as any).tronLink;
}

export const TronLinkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [account, setAccount] = useState<TronLinkAccount>({
    isLoggedIn: false,
    connect: async () => {},
  });

  useEffect(() => {
    init();

    async function init() {
      let tronLink = getTronLink();
      if (tronLink && tronLink.ready) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
  }, []);

  useEffect(() => {
    let tronLink = getTronLink();
    if (isLoggedIn && tronLink && tronLink.ready) {
      console.log("IS LOGGED IN", tronLink);

      setAccount({
        isLoggedIn: true,
        name: tronLink.tronWeb.defaultAddress.name,
        tronWeb: tronLink.tronWeb,
        addressHex: tronLink.tronWeb.defaultAddress.hex,
        addressBase58: tronLink.tronWeb.defaultAddress.base58,
        disconnect: () => {},
      });
    } else {
      setAccount({
        isLoggedIn: false,
        connect: async () => {
          tronLink = getTronLink();

          if (tronLink) {
            if (!tronLink.ready) {
              const response = await tronLink.request({
                method: "tron_requestAccounts",
              });

              if (response) {
                if (response.code === 200) {
                  setIsLoggedIn(true);
                } else {
                  window.alert("Authentication failed");
                  throw "Authentication failed";
                }
              } else {
                window.alert(
                  "Your TronLink wallet doesn't appear to be setup. Finish the setup and try again"
                );
                throw "Authentication failed";
              }
            }
          } else {
            window
              .open(
                "https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec",
                "_blank"
              )
              ?.focus();
            throw "Authentication failed";
          }
        },
      });
    }
  }, [isLoggedIn]);

  return (
    <TronLinkContext.Provider value={account}>
      {children}
    </TronLinkContext.Provider>
  );
};

export function useTronLinkAccount() {
  return useContext(TronLinkContext);
}

const TronLinkUserContext = React.createContext<TronLinkUser>(0 as never);

export const RequireTronLinkAccountProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const account = useTronLinkAccount();

  useEffect(() => {
    const handle = setTimeout(async () => {
      if (!account.isLoggedIn) {
        account.connect().catch(() => router.push("/"));
      }
    }, 200);

    return () => clearTimeout(handle);
  }, [router, account]);

  if (!account.isLoggedIn) return <Preloader />;

  return (
    <TronLinkUserContext.Provider value={account}>
      {children}
    </TronLinkUserContext.Provider>
  );
};

export function useTronLinkUser() {
  return useContext(TronLinkUserContext);
}
