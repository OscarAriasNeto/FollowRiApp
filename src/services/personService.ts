import {
  CreatePersonPayload,
  PaginatedResponse,
  Person,
  ResourceResponse,
  UpdatePersonPayload,
} from "../types/api";
import {
  ApiError,
  followPaginatedLink,
  followResourceLink,
  getErrorMessage,
  request,
  requestPaginated,
  submitToLink,
} from "./http";

type PersonResource = ResourceResponse<Person>;

type PersonList = PaginatedResponse<Person>;

const basePath = "/api/person";

const findLink = (resource: PersonResource | undefined, rel: string) => {
  return resource?.links?.find((link) => link.rel.toLowerCase().includes(rel));
};

export const personService = {
  async list(pageNumber = 1, pageSize = 10) {
    return requestPaginated<Person>(basePath, { pageNumber, pageSize });
  },

  async follow(link: { href: string; rel: string; method: string }) {
    return followPaginatedLink<Person>(link);
  },

  async get(id: number) {
    return request<PersonResource>(`${basePath}/${id}`);
  },

  async create(payload: CreatePersonPayload) {
    return request<PersonResource>(basePath, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async update(resource: PersonResource, payload: UpdatePersonPayload) {
    const updateLink = findLink(resource, "update") || findLink(resource, "self");

    if (updateLink) {
      await submitToLink(updateLink, payload);
      const selfLink = findLink(resource, "self") || updateLink;
      return followResourceLink<Person>(selfLink);
    }

    return request<PersonResource>(`${basePath}/${resource.data.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async remove(resource: PersonResource) {
    const deleteLink = findLink(resource, "delete");

    if (deleteLink) {
      await submitToLink(deleteLink);
      return;
    }

    await request<void>(`${basePath}/${resource.data.id}`, { method: "DELETE" });
  },

  async findByEmail(email: string, pageSize = 20) {
    let currentPage: PersonList | null = await this.list(1, pageSize);

    const normalized = email.trim().toLowerCase();

    while (currentPage) {
      const match = currentPage.items.find(
        (item) => item.data.email.trim().toLowerCase() === normalized
      );

      if (match) {
        return match;
      }

      const nextLink = currentPage.links?.find((link) => link.rel.toLowerCase() === "next");
      if (!nextLink) {
        return null;
      }

      currentPage = await this.follow(nextLink);
    }

    return null;
  },

  async authenticate(email: string, senha: string) {
    const existing = await this.findByEmail(email);

    if (!existing) {
      throw new ApiError(401, "Email não encontrado na API.");
    }

    if (existing.data.senha && existing.data.senha !== senha) {
      throw new ApiError(401, "Senha inválida.");
    }

    try {
      return await this.get(existing.data.id);
    } catch (error) {
      throw new ApiError(500, getErrorMessage(error));
    }
  },
};

export type { PersonResource };
