/* eslint-disable @typescript-eslint/no-explicit-any */
import Page from "../page";

const pageDTO = <T,>(data: any, item: (raw: any) => T): Page<T> => ({
  items: Array.isArray(data?.items) ? data.items.map(item) : [],
  page: data?.page ?? 1,
  page_size: data?.page_size ?? 0,
  total: data?.total ?? 0,
});

export default pageDTO;
