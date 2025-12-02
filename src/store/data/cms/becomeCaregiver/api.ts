import axiosInstance from "@/store/axiosInstance";

export interface PointType {
  id: string;
  heading: string;
  description: string;
  icon: string;
}

export interface TestimonialType {
  id: string;
  description: string;
  name: string;
}

export interface BecomeCaregiverType {
  id: string;
  title1: string;
  description1: string;
  title2: string;
  points: PointType[];
  title3: string;
  testimonials: TestimonialType[];
  testImage1: string;
  testImage2: string;
  createdAt: string;
  updatedAt: string;
}

export interface BecomeCaregiverCreateType {
  title1: string;
  description1: string;
  title2: string;
  points: Omit<PointType, 'id'>[];
  title3: string;
  testimonials: Omit<TestimonialType, 'id'>[];
  testImage1: string;
  testImage2: string;
}

export interface BecomeCaregiverUpdateType {
  title1?: string;
  description1?: string;
  title2?: string;
  points?: PointType[];
  title3?: string;
  testimonials?: TestimonialType[];
  testImage1?: string;
  testImage2?: string;
}

export interface PointInputType {
  heading: string;
  description: string;
  icon: string;
}

export interface TestimonialInputType {
  description: string;
  name: string;
}

// Main Become Caregiver operations
export const fetchBecomeCaregiver = async () => {
  const { data } = await axiosInstance.get(`/api/v1/become-caregiver`);
  return data;
};

export const createBecomeCaregiver = async (becomeCaregiverData: BecomeCaregiverCreateType) => {
  const { data } = await axiosInstance.post(`/api/v1/become-caregiver`, becomeCaregiverData);
  return data;
};

export const updateBecomeCaregiver = async (updateData: BecomeCaregiverUpdateType) => {
  const currentData = await fetchBecomeCaregiver();
  const becomeCaregiverId = currentData.data.becomeCaregiver.id;
  
  const { data } = await axiosInstance.put(
    `/api/v1/become-caregiver/${becomeCaregiverId}`,
    updateData
  );
  return data;
};

export const deleteBecomeCaregiver = async () => {
  const currentData = await fetchBecomeCaregiver();
  const becomeCaregiverId = currentData.data.becomeCaregiver.id;
  
  const { data } = await axiosInstance.delete(
    `/api/v1/become-caregiver/${becomeCaregiverId}`
  );
  return data;
};

// Points management
export const updatePoints = async (points: PointType[]) => {
  const currentData = await fetchBecomeCaregiver();
  const becomeCaregiverId = currentData.data.becomeCaregiver.id;
  
  const { data } = await axiosInstance.put(
    `/api/v1/become-caregiver/${becomeCaregiverId}/points`,
    { points }
  );
  return data;
};

// Testimonials management
export const addTestimonial = async (testimonialData: TestimonialInputType) => {
  const currentData = await fetchBecomeCaregiver();
  const becomeCaregiverId = currentData.data.becomeCaregiver.id;
  
  const { data } = await axiosInstance.post(
    `/api/v1/become-caregiver/${becomeCaregiverId}/testimonials`,
    testimonialData
  );
  return data;
};

export const updateTestimonial = async (testimonialId: string, testimonialData: TestimonialInputType) => {
  const currentData = await fetchBecomeCaregiver();
  const becomeCaregiverId = currentData.data.becomeCaregiver.id;
  
  const { data } = await axiosInstance.put(
    `/api/v1/become-caregiver/${becomeCaregiverId}/testimonials/${testimonialId}`,
    testimonialData
  );
  return data;
};

export const deleteTestimonial = async (testimonialId: string) => {
  const currentData = await fetchBecomeCaregiver();
  const becomeCaregiverId = currentData.data.becomeCaregiver.id;
  
  const { data } = await axiosInstance.delete(
    `/api/v1/become-caregiver/${becomeCaregiverId}/testimonials/${testimonialId}`
  );
  return data;
};