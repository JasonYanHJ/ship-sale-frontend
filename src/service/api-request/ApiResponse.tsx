export type ApiResponse<T = undefined> = {
  message?: string;
} & (T extends undefined ? { data?: unknown } : { data: T });
