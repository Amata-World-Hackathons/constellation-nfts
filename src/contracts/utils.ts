export type ContractCall<T> = () => { call: () => Promise<{ ret: T }> };

export function proxyCall<T>(contract: any, method: string) {
  return async <T>(...args: any[]) => {
    // @ts-ignore
    const result = await (contract[method] as ContractCall<T>)(...args).call();

    return result.ret;
  };
}

export function proxySend<T>(
  contract: any,
  method: string,
  opts = { feeLimit: 1_000_000_000, shouldPollResponse: true }
) {
  return async <T>(...args: any[]) => {
    // @ts-ignore
    const result = await (contract[method] as ContractCall<T>)(...args).send(
      opts
    );

    return result.ret;
  };
}
