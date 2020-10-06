export const DYLEN_LOADING = "DYLEN_LOADING";
export const DYLEN_FAIL = "DYLEN_FAIL";
export const DYLEN_SUCCESS = "DYLEN_SUCCESS";

export type DylenDataType = {
  corpora: DylenCorpus[]
}

export type DylenCorpus = {
  id: string,
  name: string,
}

export interface DylenLoading {
  type: typeof DYLEN_LOADING
}

export interface DylenFail {
  type: typeof DYLEN_FAIL
}

export interface DylenSuccess {
  type: typeof DYLEN_SUCCESS,
  payload: DylenDataType
}

export type DylenDispatchTypes = DylenLoading | DylenFail | DylenSuccess;