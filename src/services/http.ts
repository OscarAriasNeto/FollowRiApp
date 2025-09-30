import Constants from "expo-constants";

import { ApiLink, ApiProblemDetails, PaginatedResponse, ResourceResponse } from "../types/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export class ApiError extends Error {
  status: number;
  details?: ApiProblemDetails | null;

  constructor(status: number, message: string, details?: ApiProblemDetails | null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const DEFAULT_BASE_URL = "http://localhost:5000";

const resolveBaseUrl = () => {
  const envValue = process.env.EXPO_PUBLIC_API_BASE_URL;
  const expoExtra = (Constants?.expoConfig as { extra?: Record<string, unknown> } | undefined)?.extra;
  const legacyExtra = (Constants?.manifest as { extra?: Record<string, unknown> } | undefined)?.extra;

  const apiFromExpo = typeof expoExtra?.apiBaseUrl === "string" ? (expoExtra.apiBaseUrl as string) : undefined;
  const apiFromManifest =
    typeof legacyExtra?.apiBaseUrl === "string" ? (legacyExtra.apiBaseUrl as string) : undefined;

  const constantsValue = apiFromExpo || apiFromManifest;

  return envValue || constantsValue || DEFAULT_BASE_URL;
};

const BASE_URL = resolveBaseUrl();

const buildHeaders = (headers?: HeadersInit, body?: BodyInit | null) => {
  const finalHeaders = new Headers(headers);
  finalHeaders.set("Accept", "application/json");
  if (body && !(body instanceof FormData)) {
    finalHeaders.set("Content-Type", "application/json");
  }

  return finalHeaders;
};

const resolveUrl = (input: string) => {
  if (/^https?:\/\//i.test(input)) {
    return input;
  }

  if (!input.startsWith("/")) {
    return `${BASE_URL}/${input}`;
  }

  return `${BASE_URL}${input}`;
};

const parseResponse = async (response: Response) => {
  const text = await response.text();
  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn("Erro ao analisar JSON da API", error);
    return undefined;
  }
};

export const request = async <T>(input: string, init?: RequestInit) => {
  const { method = "GET", body, headers, ...rest } = init ?? {};
  const url = resolveUrl(input);

  try {
    const response = await fetch(url, {
      method,
      body,
      headers: buildHeaders(headers, body),
      ...rest,
    });

    if (!response.ok) {
      const parsed = (await parseResponse(response)) as ApiProblemDetails | undefined;
      const errorMessage =
        parsed?.title || parsed?.detail || `Erro na API (${response.status})`;

      throw new ApiError(response.status, errorMessage, parsed);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await parseResponse(response)) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error("Erro de rede ao chamar a API", error);
    throw new ApiError(0, "Não foi possível conectar à API Follow Rivers.");
  }
};

export const requestPaginated = async <T>(
  input: string,
  params?: { pageNumber?: number; pageSize?: number }
) => {
  const url = new URL(resolveUrl(input));

  if (params?.pageNumber) {
    url.searchParams.set("pageNumber", String(params.pageNumber));
  }

  if (params?.pageSize) {
    url.searchParams.set("pageSize", String(params.pageSize));
  }

  return request<PaginatedResponse<T>>(url.toString());
};

export const followPaginatedLink = async <T>(link: ApiLink) => {
  return request<PaginatedResponse<T>>(link.href);
};

export const followResourceLink = async <T>(link: ApiLink) => {
  return request<ResourceResponse<T>>(link.href);
};

export const submitToLink = async <T = void>(link: ApiLink, body?: unknown) => {
  const method = link.method.toUpperCase() as HttpMethod;
  const payload =
    body && !(body instanceof FormData) ? JSON.stringify(body) : (body as BodyInit);

  return request<T>(link.href, {
    method,
    body: payload,
  });
};

export const extractValidationErrors = (error: unknown) => {
  if (error instanceof ApiError && error.details?.errors) {
    return error.details.errors;
  }
  return undefined;
};

export const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    if (error.details?.detail) {
      return error.details.detail;
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocorreu um erro inesperado.";
};
