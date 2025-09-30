export interface ApiLink {
  href: string;
  rel: string;
  method: string;
}

export interface ApiProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
}

export interface ResourceResponse<T> {
  data: T;
  links: ApiLink[];
}

export interface PaginatedResponse<T> {
  items: Array<ResourceResponse<T>>;
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  links: ApiLink[];
}

export interface Person {
  id: number;
  name: string;
  email: string;
  senha?: string;
}

export interface RiverAddress {
  id: number;
  address: string;
  canCauseFlood: boolean;
  personId: number;
}

export interface FloodAlert {
  id: number;
  title: string;
  description: string;
  severity: string;
  personId: number;
  riverAddressId: number;
  createdAt: string;
}

export type CreatePersonPayload = Omit<Person, "id">;
export type UpdatePersonPayload = CreatePersonPayload;

export type CreateRiverAddressPayload = Omit<RiverAddress, "id">;
export type UpdateRiverAddressPayload = CreateRiverAddressPayload;

export type CreateFloodAlertPayload = Omit<FloodAlert, "id" | "createdAt">;
export type UpdateFloodAlertPayload = CreateFloodAlertPayload;
