import { ApiResponse } from "./ApiResponse";

export class ApiError extends Error {
  status: number;
  body: ApiResponse;
  constructor(status: number, body: ApiResponse) {
    super(`Api call failed: ${status}`);
    this.status = status;
    this.body = body;
  }
}
