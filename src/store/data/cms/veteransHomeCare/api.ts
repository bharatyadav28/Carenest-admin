import axiosInstance from "@/store/axiosInstance";
import { responseType } from "@/lib/interface-types";

export interface VeteransHomeCareType {
  id: string;
  title1: string;
  description1: string;
  image1: string;
  image2: string;
  image3: string;
  title2: string;
  description2: string;
  title3: string;
  points: string[];
  sectionImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface VeteransHomeCareCreateType {
  title1: string;
  description1: string;
  image1: string;
  image2: string;
  image3: string;
  title2: string;
  description2: string;
  title3: string;
  points: string[];
  sectionImage: string;
}

export interface VeteransHomeCareUpdateType {
  title1?: string;
  description1?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  title2?: string;
  description2?: string;
  title3?: string;
  points?: string[];
  sectionImage?: string;
}

export interface PointOperationData {
  point?: string;
  index?: number;
}

export interface VeteransHomeCareResponse extends responseType {
  data: {
    veteransHomeCare: VeteransHomeCareType;
  };
}

// Get Veterans Home Care page
export const fetchVeteransHomeCare = async (): Promise<VeteransHomeCareResponse> => {
  try {
    const { data } = await axiosInstance.get(`/api/v1/veterans-home-care`);
    return data;
  } catch (error: any) {
    
    throw error;
  }
};

// Create Veterans Home Care page
export const createVeteransHomeCare = async (serviceData: VeteransHomeCareCreateType): Promise<VeteransHomeCareResponse> => {
  const { data } = await axiosInstance.post(`/api/v1/veterans-home-care`, serviceData);
  return data;
};

// Update Veterans Home Care page
export const updateVeteransHomeCare = async (id: string, updateData: VeteransHomeCareUpdateType): Promise<VeteransHomeCareResponse> => {
  const { data } = await axiosInstance.put(`/api/v1/veterans-home-care/${id}`, updateData);
  return data;
};

// Delete Veterans Home Care page
export const deleteVeteransHomeCare = async (id: string): Promise<VeteransHomeCareResponse> => {
  const { data } = await axiosInstance.delete(`/api/v1/veterans-home-care/${id}`);
  return data;
};

// Update points
export const updatePoints = async (id: string, points: string[]): Promise<VeteransHomeCareResponse> => {
  const { data } = await axiosInstance.put(`/api/v1/veterans-home-care/${id}/points`, { points });
  return data;
};

// Add point
export const addPoint = async (id: string, point: string): Promise<VeteransHomeCareResponse> => {
  const { data } = await axiosInstance.post(`/api/v1/veterans-home-care/${id}/points`, { point });
  return data;
};

// Update specific point
export const updatePoint = async (id: string, index: number, point: string): Promise<VeteransHomeCareResponse> => {
  const { data } = await axiosInstance.put(`/api/v1/veterans-home-care/${id}/points/update`, { index, point });
  return data;
};

// Delete specific point
export const deletePoint = async (id: string, index: number): Promise<VeteransHomeCareResponse> => {
  const { data } = await axiosInstance.delete(`/api/v1/veterans-home-care/${id}/points`, { data: { index } });
  return data;
};