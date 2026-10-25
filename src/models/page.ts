/** A page of a paginated list response. */
type Page<T> = {
  items: T[];
  page: number;
  page_size: number;
  total: number;
};

export const hasNextPage = (page: Page<unknown>): boolean =>
  page.page * page.page_size < page.total;

export default Page;
