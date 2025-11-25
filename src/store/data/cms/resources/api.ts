import axiosInstance from "@/store/axiosInstance";

export interface ResourceCardType {
  id: string;
  title: string;
  description: string;
  redirectUrl: string;
  badges: string[];
}

export interface ResourcesType {
  id: string;
  title: string;
  description: string;
  resourceCards: ResourceCardType[];
  createdAt: string;
  updatedAt: string;
}

export interface ResourcesUpdateType {
  title?: string;
  description?: string;
  resourceCards?: ResourceCardType[];
}

export interface ResourceCardInputType {
  title: string;
  description: string;
  redirectUrl: string;
  badges: string[];
}

export const fetchResources = async () => {
  const { data } = await axiosInstance.get(`/api/v1/resources`);
  return data;
};

export const updateResources = async (updateData: ResourcesUpdateType) => {
  const currentData = await fetchResources();
  const resourcesId = currentData.data.resources.id;
  
  const { data } = await axiosInstance.put(
    `/api/v1/resources/${resourcesId}`,
    updateData
  );
  return data;
};

export const createResources = async (resourcesData: ResourcesUpdateType) => {
  const { data } = await axiosInstance.post(`/api/v1/resources`, resourcesData);
  return data;
};

export const deleteResources = async () => {
  const currentData = await fetchResources();
  const resourcesId = currentData.data.resources.id;
  
  const { data } = await axiosInstance.delete(
    `/api/v1/resources/${resourcesId}`
  );
  return data;
};

// Resource Card specific operations
export const addResourceCard = async (cardData: ResourceCardInputType) => {
  const currentData = await fetchResources();
  const resourcesId = currentData.data.resources.id;
  
  const { data } = await axiosInstance.post(
    `/api/v1/resources/${resourcesId}/cards`,
    cardData
  );
  return data;
};

export const updateResourceCard = async (cardId: string, cardData: ResourceCardInputType) => {
  const currentData = await fetchResources();
  const resourcesId = currentData.data.resources.id;
  
  const { data } = await axiosInstance.put(
    `/api/v1/resources/${resourcesId}/cards/${cardId}`,
    cardData
  );
  return data;
};

export const deleteResourceCard = async (cardId: string) => {
  const currentData = await fetchResources();
  const resourcesId = currentData.data.resources.id;
  
  const { data } = await axiosInstance.delete(
    `/api/v1/resources/${resourcesId}/cards/${cardId}`
  );
  return data;
};