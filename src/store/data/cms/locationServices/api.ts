import axiosInstance from "@/store/axiosInstance";
import { responseType } from "@/lib/interface-types";

export interface ServiceItem {
  id: string;
  title: string;
  items: string[];
  image: string;
}

export interface LocationServiceType {
  id: string;
  city: string;
  state: string;
  heroTitle: string;
  heroImage: string;
  heroDescription: string;
  whyChooseTitle: string;
  whyChooseDescription: string;
  servicesIntro: string;
  servicesDescription: string;
  services: ServiceItem[];
  careDesignedTitle: string;
  careDesignedDescription: string;
  careDesignedImage: string;
  proudlyServingTitle: string;
  proudlyServingDescription: string;
  steadyPartnerTitle: string;
  steadyPartnerDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocationServiceCreateType {
  city: string;
  state: string;
  heroTitle: string;
  heroImage: string;
  heroDescription: string;
  whyChooseTitle: string;
  whyChooseDescription: string;
  servicesIntro: string;
  servicesDescription: string;
  services: Omit<ServiceItem, 'id'>[];
  careDesignedTitle: string;
  careDesignedDescription: string;
  careDesignedImage: string;
  proudlyServingTitle: string;
  proudlyServingDescription: string;
  steadyPartnerTitle: string;
  steadyPartnerDescription: string;
}

export interface LocationServiceUpdateType {
  city?: string;
  state?: string;
  heroTitle?: string;
  heroImage?: string;
  heroDescription?: string;
  whyChooseTitle?: string;
  whyChooseDescription?: string;
  servicesIntro?: string;
  servicesDescription?: string;
  services?: ServiceItem[];
  careDesignedTitle?: string;
  careDesignedDescription?: string;
  careDesignedImage?: string;
  proudlyServingTitle?: string;
  proudlyServingDescription?: string;
  steadyPartnerTitle?: string;
  steadyPartnerDescription?: string;
}

export interface ServiceItemInput {
  title: string;
  items: string[];
  image: string;
}

export interface LocationServicesResponse extends responseType {
  data: {
    locationServices: LocationServiceType[];
    count: number;
  };
}

export interface LocationServiceResponse extends responseType {
  data: {
    locationService: LocationServiceType;
  };
}

// Get all location services
export const fetchAllLocationServices = async (): Promise<LocationServicesResponse> => {
  const { data } = await axiosInstance.get(`/api/v1/location-services`);
  return data;
};

// Get location service by ID
export const fetchLocationServiceById = async (id: string): Promise<LocationServiceResponse> => {
  const { data } = await axiosInstance.get(`/api/v1/location-services/${id}`);
  return data;
};

// Get location service by city and state
export const fetchLocationServiceByCityState = async (city: string, state: string): Promise<LocationServiceResponse> => {
  const { data } = await axiosInstance.get(`/api/v1/location-services/city/${city}/state/${state}`);
  return data;
};

// Create location service
export const createLocationService = async (serviceData: LocationServiceCreateType): Promise<LocationServiceResponse> => {
  const { data } = await axiosInstance.post(`/api/v1/location-services`, serviceData);
  return data;
};

// Update location service
export const updateLocationService = async (id: string, updateData: LocationServiceUpdateType): Promise<LocationServiceResponse> => {
  const { data } = await axiosInstance.put(`/api/v1/location-services/${id}`, updateData);
  return data;
};

// Delete location service
export const deleteLocationService = async (id: string): Promise<LocationServiceResponse> => {
  const { data } = await axiosInstance.delete(`/api/v1/location-services/${id}`);
  return data;
};

// Add service item
export const addServiceItem = async (id: string, serviceData: ServiceItemInput): Promise<LocationServiceResponse> => {
  const { data } = await axiosInstance.post(`/api/v1/location-services/${id}/services`, serviceData);
  return data;
};

// Update service item
export const updateServiceItem = async (id: string, serviceId: string, updateData: ServiceItemInput): Promise<LocationServiceResponse> => {
  const { data } = await axiosInstance.put(`/api/v1/location-services/${id}/services/${serviceId}`, updateData);
  return data;
};

// Delete service item
export const deleteServiceItem = async (id: string, serviceId: string): Promise<LocationServiceResponse> => {
  const { data } = await axiosInstance.delete(`/api/v1/location-services/${id}/services/${serviceId}`);
  return data;
};