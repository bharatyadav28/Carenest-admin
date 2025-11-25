import axiosInstance from "@/store/axiosInstance";
import { responseType } from "@/lib/interface-types";

export type CareType = "Personal Care" | "Home Maker Service" | "Specialized Care" | "Sitter Services" | "Companion Care" | "Transportation";

export interface ServiceType {
  id: string;
  serviceName: string;
  serviceDescription: string;
  serviceIcon: string;
  careType: CareType;
  title1: string;
  description1: string;
  title2: string;
  description2: string;
  title3: string;
  description3: string;
  description3Image: string;
  description3List: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCreateType {
  serviceName: string;
  serviceDescription: string;
  serviceIcon: string;
  careType: CareType;
  title1: string;
  description1: string;
  title2: string;
  description2: string;
  title3: string;
  description3: string;
  description3Image: string;
  description3List: string[];
}

export interface ServiceUpdateType {
  serviceName?: string;
  serviceDescription?: string;
  serviceIcon?: string;
  careType?: CareType;
  title1?: string;
  description1?: string;
  title2?: string;
  description2?: string;
  title3?: string;
  description3?: string;
  description3Image?: string;
  description3List?: string[];
}

export interface ServicesResponse extends responseType {
  data: {
    services: ServiceType[];
    count: number;
  };
}

export interface ServiceResponse extends responseType {
  data: {
    service: ServiceType;
  };
}

// Get all services
export const fetchServices = async (): Promise<ServicesResponse> => {
  const { data } = await axiosInstance.get(`/api/v1/service-cms`);
  return data;
};

// Get services by care type
export const fetchServicesByCareType = async (careType: CareType): Promise<ServicesResponse> => {
  const { data } = await axiosInstance.get(`/api/v1/service-cms/care-type/${encodeURIComponent(careType)}`);
  return data;
};

// Get service by ID
export const fetchServiceById = async (id: string): Promise<ServiceResponse> => {
  const { data } = await axiosInstance.get(`/api/v1/service-cms/${id}`);
  return data;
};

// Create service
export const createService = async (serviceData: ServiceCreateType): Promise<ServiceResponse> => {
  const { data } = await axiosInstance.post(`/api/v1/service-cms`, serviceData);
  return data;
};

// Update service
export const updateService = async (id: string, updateData: ServiceUpdateType): Promise<ServiceResponse> => {
  const { data } = await axiosInstance.put(`/api/v1/service-cms/${id}`, updateData);
  return data;
};

// Delete service
export const deleteService = async (id: string): Promise<ServiceResponse> => {
  const { data } = await axiosInstance.delete(`/api/v1/service-cms/${id}`);
  return data;
};