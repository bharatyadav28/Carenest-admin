import axiosInstance from "@/store/axiosInstance";

export interface SocialLinkType {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface FooterType {
  id: string;
  footerDescription: string;
  locations: string[];
  socialLinks: SocialLinkType[];
  createdAt: string;
  updatedAt: string;
}

export interface FooterCreateType {
  footerDescription: string;
  locations: string[];
  socialLinks: Omit<SocialLinkType, 'id'>[];
}

export interface FooterUpdateType {
  footerDescription?: string;
  locations?: string[];
  socialLinks?: SocialLinkType[];
}

export interface LocationUpdateType {
  oldLocation?: string;
  newLocation?: string;
  location?: string;
}

export interface SocialLinkInputType {
  platform: string;
  url: string;
  icon: string;
}

// Main footer operations
export const fetchFooter = async () => {
  const { data } = await axiosInstance.get(`/api/v1/footer`);
  return data;
};

export const createFooter = async (footerData: FooterCreateType) => {
  const { data } = await axiosInstance.post(`/api/v1/footer`, footerData);
  return data;
};

export const updateFooter = async (updateData: FooterUpdateType) => {
  const currentData = await fetchFooter();
  const footerId = currentData.data.footer.id;
  
  const { data } = await axiosInstance.put(
    `/api/v1/footer/${footerId}`,
    updateData
  );
  return data;
};

export const deleteFooter = async () => {
  const currentData = await fetchFooter();
  const footerId = currentData.data.footer.id;
  
  const { data } = await axiosInstance.delete(
    `/api/v1/footer/${footerId}`
  );
  return data;
};

// Location management
export const addLocation = async (location: string) => {
  const currentData = await fetchFooter();
  const footerId = currentData.data.footer.id;
  
  const { data } = await axiosInstance.post(
    `/api/v1/footer/${footerId}/locations`,
    { location }
  );
  return data;
};

export const updateLocation = async (oldLocation: string, newLocation: string) => {
  const currentData = await fetchFooter();
  const footerId = currentData.data.footer.id;
  
  const { data } = await axiosInstance.put(
    `/api/v1/footer/${footerId}/locations`,
    { oldLocation, newLocation }
  );
  return data;
};

export const deleteLocation = async (location: string) => {
  const currentData = await fetchFooter();
  const footerId = currentData.data.footer.id;
  
  const { data } = await axiosInstance.delete(
    `/api/v1/footer/${footerId}/locations`,
    { data: { location } }
  );
  return data;
};

// Social links management
export const addSocialLink = async (socialLink: SocialLinkInputType) => {
  const currentData = await fetchFooter();
  const footerId = currentData.data.footer.id;
  
  const { data } = await axiosInstance.post(
    `/api/v1/footer/${footerId}/social-links`,
    socialLink
  );
  return data;
};

export const updateSocialLink = async (linkId: string, socialLink: SocialLinkInputType) => {
  const currentData = await fetchFooter();
  const footerId = currentData.data.footer.id;
  
  const { data } = await axiosInstance.put(
    `/api/v1/footer/${footerId}/social-links/${linkId}`,
    socialLink
  );
  return data;
};

export const deleteSocialLink = async (linkId: string) => {
  const currentData = await fetchFooter();
  const footerId = currentData.data.footer.id;
  
  const { data } = await axiosInstance.delete(
    `/api/v1/footer/${footerId}/social-links/${linkId}`
  );
  return data;
};