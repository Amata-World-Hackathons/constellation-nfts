import React from "react";

export type AppPage = NextPage & {
  applyLayout: (page: React.ReactNode) => React.ReactNode;
};

export interface AsyncResult<T> {
  loading: boolean;
  data?: T;
  error?: string;
  refetch: () => Promise<unknown>;
}
