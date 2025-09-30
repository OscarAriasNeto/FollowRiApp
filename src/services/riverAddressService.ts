import {
  CreateRiverAddressPayload,
  PaginatedResponse,
  ResourceResponse,
  RiverAddress,
  UpdateRiverAddressPayload,
} from "../types/api";
import { followPaginatedLink, followResourceLink, request, requestPaginated, submitToLink } from "./http";

type RiverAddressResource = ResourceResponse<RiverAddress>;

type RiverAddressList = PaginatedResponse<RiverAddress>;

const basePath = "/api/riveraddress";

const findLink = (resource: RiverAddressResource | undefined, rel: string) =>
  resource?.links?.find((link) => link.rel.toLowerCase().includes(rel));

export const riverAddressService = {
  async list(pageNumber = 1, pageSize = 10) {
    return requestPaginated<RiverAddress>(basePath, { pageNumber, pageSize });
  },

  async follow(link: { href: string; rel: string; method: string }) {
    return followPaginatedLink<RiverAddress>(link);
  },

  async get(id: number) {
    return request<RiverAddressResource>(`${basePath}/${id}`);
  },

  async create(payload: CreateRiverAddressPayload) {
    return request<RiverAddressResource>(basePath, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async update(resource: RiverAddressResource, payload: UpdateRiverAddressPayload) {
    const updateLink = findLink(resource, "update") || findLink(resource, "self");

    if (updateLink) {
      await submitToLink(updateLink, payload);
      const selfLink = findLink(resource, "self") || updateLink;
      return followResourceLink<RiverAddress>(selfLink);
    }

    return request<RiverAddressResource>(`${basePath}/${resource.data.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async remove(resource: RiverAddressResource) {
    const deleteLink = findLink(resource, "delete");

    if (deleteLink) {
      await submitToLink(deleteLink);
      return;
    }

    await request<void>(`${basePath}/${resource.data.id}`, { method: "DELETE" });
  },
};

export type { RiverAddressResource, RiverAddressList };
