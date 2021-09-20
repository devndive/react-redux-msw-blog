export interface BlogPost {
  id: string;
  title: string;
  text: string;
}

export interface ListResponse<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T[];
}
