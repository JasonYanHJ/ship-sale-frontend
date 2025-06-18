import { message } from "antd";
import { ApiError } from "./ApiError";
import { ApiResponse } from "./ApiResponse";

export const API_PREFIX = window.location.href.startsWith("http://localhost")
  ? "http://127.0.0.1:8000/api"
  : "http://192.168.100.246:8000/api";

export async function apiRequest<T>(
  path: string,
  body: unknown = {},
  option: RequestInit = {}
): Promise<ApiResponse<T>> {
  return fetch(API_PREFIX + path, {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
    ...option,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...option.headers,
    },
  }).then(async (response) => {
    let body;
    try {
      body = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new ApiError(response.status, {});
    }

    if (response.status < 200 || response.status >= 400) {
      throw new ApiError(response.status, body);
    }
    return body;
  });
}

/**
 * 根据请求结果使用antd.message提醒用户
 *
 * @param {*} request 发送的网络请求
 * @param {*} onSuccess 成功时的信息，默认使用响应中的"message"字段，传入null不提醒
 * @param {*} onError 错误时的信息，默认使用响应中的"message"字段，传入null不提醒
 */
export async function withMessage(
  request: Promise<ApiResponse<unknown>>,
  onSuccess?: string | null,
  onError?: string | null
) {
  return request
    .then((res) => {
      if (onSuccess) message.success(onSuccess);
      else if (onError === undefined) message.success(res?.message || "成功");
      return res;
    })
    .catch((e) => {
      if (onError) message.error(onError);
      else if (onError === undefined) {
        if (e instanceof ApiError && e?.body?.message)
          message.error(e.body.message);
        else message.error("未知错误");
      }
      throw e;
    });
}
