import { useCallback, useEffect, useState } from "react";

import { useTronWeb } from "./TronWeb";
import { AsyncResult } from "@src/types";

export interface TronContract {
  loadAbi: (abi: Record<string, any>) => void;
}

export function useContract(address: string, abi?: Record<string, any>[]) {
  const tronWeb = useTronWeb();

  const [result, setResult] = useState<AsyncResult<TronContract>>({
    loading: true,
    refetch: async () => {},
  });

  const refetch = useCallback(
    () =>
      tronWeb
        .contract()
        .at<TronContract>(address)
        .then((contract: TronContract) => {
          if (abi) {
            contract.loadAbi(abi);
          }

          setResult({
            loading: false,
            data: contract,
            refetch,
          });
        }),
    [tronWeb, abi, address]
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  return result;
}

export function useContractCall<T = any>(
  contractResult: AsyncResult<TronContract>,
  method: string,
  arg1?: any,
  arg2?: any,
  arg3?: any
): AsyncResult<T> {
  return useContractMethod(contractResult, method, undefined, arg1, arg2, arg3);
}

export function useContractSend<T = any>(
  contractResult: AsyncResult<TronContract>,
  method: string,
  arg1?: any,
  arg2?: any,
  arg3?: any
): AsyncResult<T> {
  return useContractMethod(
    contractResult,
    method,
    1_000_000_000,
    arg1,
    arg2,
    arg3
  );
}

function useContractMethod<T = any>(
  contractResult: AsyncResult<TronContract>,
  method: string,
  feeLimit?: number,
  arg1?: any,
  arg2?: any,
  arg3?: any
): AsyncResult<T> {
  const [result, setResult] = useState<AsyncResult<T>>({
    loading: true,
    refetch: async () => {},
  });

  const refetch = useCallback(async () => {
    if (!contractResult.data) {
      setResult({ loading: true, refetch });
      return;
    }

    const contract = contractResult.data;

    const contractCall = (contract as any)[method].call(
      arg3 !== undefined
        ? [arg1, arg2, arg3]
        : arg2 !== undefined
        ? [arg1, arg2]
        : arg1 !== undefined
        ? [arg1]
        : []
    );

    if (feeLimit) {
      contractCall.send({ feeLimit }).then((res: any) => {
        setResult({ loading: false, data: res, refetch });
      });
    } else {
      contractCall.call().then((res: any) => {
        setResult({ loading: false, data: res, refetch });
      });
    }
  }, [contractResult, method, feeLimit, arg1, arg2, arg3]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return result;
}
