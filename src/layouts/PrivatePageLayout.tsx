import React from "react";

import { applyDefaultLayout } from "./DefaultLayout";
import { RequireTronLinkAccountProvider } from "@src/context/TronLink";

export default function applyPrivatePageLayout(page: React.ReactNode) {
  return applyDefaultLayout(
    <RequireTronLinkAccountProvider>{page}</RequireTronLinkAccountProvider>
  );
}
