import axiosInstance from "@/store/axiosInstance";

export interface WhoWeAreType {
  id: string;
  mainHeading: string;
  mainDescription: string;
  images: string[];
  caregiverNetworkHeading: string;
  caregiverNetworkDescription: string;
  caregiverNetworkImage: string;
  promiseHeading: string;
  promiseDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhoWeAreCreateType {
  mainHeading: string;
  mainDescription: string;
  images: string[];
  caregiverNetworkHeading: string;
  caregiverNetworkDescription: string;
  caregiverNetworkImage: string;
  promiseHeading: string;
  promiseDescription: string;
}

export interface WhoWeAreUpdateType {
  mainHeading?: string;
  mainDescription?: string;
  images?: string[];
  caregiverNetworkHeading?: string;
  caregiverNetworkDescription?: string;
  caregiverNetworkImage?: string;
  promiseHeading?: string;
  promiseDescription?: string;
}

export interface MainSectionUpdateType {
  mainHeading?: string;
  mainDescription?: string;
  images?: string[];
}

export interface CaregiverNetworkUpdateType {
  caregiverNetworkHeading?: string;
  caregiverNetworkDescription?: string;
  caregiverNetworkImage?: string;
}

export interface PromiseSectionUpdateType {
  promiseHeading?: string;
  promiseDescription?: string;
}

// Main Who We Are operations
export const fetchWhoWeAre = async () => {
  const { data } = await axiosInstance.get(`/api/v1/who-we-are`);
  return data;
};

export const createWhoWeAre = async (whoWeAreData: WhoWeAreCreateType) => {
  const { data } = await axiosInstance.post(`/api/v1/who-we-are`, whoWeAreData);
  return data;
};

export const updateWhoWeAre = async (updateData: WhoWeAreUpdateType) => {
  const currentData = await fetchWhoWeAre();
  const whoWeAreId = currentData.data.whoWeAre.id;
  
  const { data } = await axiosInstance.put(
    `/api/v1/who-we-are/${whoWeAreId}`,
    updateData
  );
  return data;
};

export const deleteWhoWeAre = async () => {
  const currentData = await fetchWhoWeAre();
  const whoWeAreId = currentData.data.whoWeAre.id;
  
  const { data } = await axiosInstance.delete(
    `/api/v1/who-we-are/${whoWeAreId}`
  );
  return data;
};

// Section-specific updates
export const updateMainSection = async (updateData: MainSectionUpdateType) => {
  const currentData = await fetchWhoWeAre();
  const whoWeAreId = currentData.data.whoWeAre.id;
  
  const { data } = await axiosInstance.patch(
    `/api/v1/who-we-are/${whoWeAreId}/main-section`,
    updateData
  );
  return data;
};

export const updateCaregiverNetworkSection = async (updateData: CaregiverNetworkUpdateType) => {
  const currentData = await fetchWhoWeAre();
  const whoWeAreId = currentData.data.whoWeAre.id;
  
  const { data } = await axiosInstance.patch(
    `/api/v1/who-we-are/${whoWeAreId}/caregiver-network`,
    updateData
  );
  return data;
};

export const updatePromiseSection = async (updateData: PromiseSectionUpdateType) => {
  const currentData = await fetchWhoWeAre();
  const whoWeAreId = currentData.data.whoWeAre.id;
  
  const { data } = await axiosInstance.patch(
    `/api/v1/who-we-are/${whoWeAreId}/promise-section`,
    updateData
  );
  return data;
};