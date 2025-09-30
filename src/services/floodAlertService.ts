import {
  CreateFloodAlertPayload,
  FloodAlert,
  PaginatedResponse,
  ResourceResponse,
  UpdateFloodAlertPayload,
} from "../types/api";
import { followPaginatedLink, followResourceLink, request, requestPaginated, submitToLink } from "./http";

type FloodAlertResource = ResourceResponse<FloodAlert>;

type FloodAlertList = PaginatedResponse<FloodAlert>;

const basePath = "/api/floodalert";

const findLink = (resource: FloodAlertResource | undefined, rel: string) =>
  resource?.links?.find((link) => link.rel.toLowerCase().includes(rel));

export const floodAlertService = {
  async list(pageNumber = 1, pageSize = 10) {
    return requestPaginated<FloodAlert>(basePath, { pageNumber, pageSize });
  },

  async follow(link: { href: string; rel: string; method: string }) {
    return followPaginatedLink<FloodAlert>(link);
  },

  async get(id: number) {
    return request<FloodAlertResource>(`${basePath}/${id}`);
  },

  async create(payload: CreateFloodAlertPayload) {
    return request<FloodAlertResource>(basePath, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async update(resource: FloodAlertResource, payload: UpdateFloodAlertPayload) {
    const updateLink = findLink(resource, "update") || findLink(resource, "self");

    if (updateLink) {
      await submitToLink(updateLink, payload);
      const selfLink = findLink(resource, "self") || updateLink;
      return followResourceLink<FloodAlert>(selfLink);
    }

    return request<FloodAlertResource>(`${basePath}/${resource.data.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async remove(resource: FloodAlertResource) {
    const deleteLink = findLink(resource, "delete");

    if (deleteLink) {
      await submitToLink(deleteLink);
      return;
    }

    await request<void>(`${basePath}/${resource.data.id}`, { method: "DELETE" });
  },
};

export type { FloodAlertResource, FloodAlertList };
