import axiosInstance from "@/store/axiosInstance";

export interface HeroSectionType {
  id: string;
  heading: string;
  description: string;
  googleReviewLink: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeroSectionUpdateType {
  heading: string;
  description: string;
  googleReviewLink: string;
  phoneNumber: string;
}

export const fetchHeroSection = async () => {
  const { data } = await axiosInstance.get(`/api/v1/hero-section`);
  return data;
};

export const updateHeroSection = async (updateData: HeroSectionUpdateType) => {
  // First get the current hero section to get the ID
  const currentData = await fetchHeroSection();
  const heroSectionId = currentData.data.heroSection.id;
  
  const { data } = await axiosInstance.put(
    `/api/v1/hero-section/${heroSectionId}`,
    updateData
  );
  return data;
};

export const createHeroSection = async (heroData: HeroSectionUpdateType) => {
  const { data } = await axiosInstance.post(`/api/v1/hero-section`, heroData);
  return data;
};

export const deleteHeroSection = async () => {
  const currentData = await fetchHeroSection();
  const heroSectionId = currentData.data.heroSection.id;
  
  const { data } = await axiosInstance.delete(
    `/api/v1/hero-section/${heroSectionId}`
  );
  return data;
};