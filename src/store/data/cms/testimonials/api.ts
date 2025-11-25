import axiosInstance from "@/store/axiosInstance";

export interface TestimonialType {
  id: string;
  profilePic?: string;
  name: string;
  profession: string;
  rating: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialCreateType {
  profilePic?: string;
  name: string;
  profession: string;
  rating: number;
  description: string;
}

export interface TestimonialUpdateType {
  profilePic?: string;
  name?: string;
  profession?: string;
  rating?: number;
  description?: string;
}

export interface TestimonialsResponse {
  testimonials: TestimonialType[];
  count: number;
}

// Get all testimonials
export const fetchTestimonials = async () => {
  const { data } = await axiosInstance.get(`/api/v1/testimonial`);
  return data;
};

// Get single testimonial by ID
export const fetchTestimonialById = async (id: string) => {
  const { data } = await axiosInstance.get(`/api/v1/testimonial/${id}`);
  return data;
};

// Create new testimonial
export const createTestimonial = async (testimonialData: TestimonialCreateType) => {
  const { data } = await axiosInstance.post(`/api/v1/testimonial`, testimonialData);
  return data;
};

// Update testimonial
export const updateTestimonial = async (id: string, updateData: TestimonialUpdateType) => {
  const { data } = await axiosInstance.put(`/api/v1/testimonial/${id}`, updateData);
  return data;
};

// Delete testimonial
export const deleteTestimonial = async (id: string) => {
  const { data } = await axiosInstance.delete(`/api/v1/testimonial/${id}`);
  return data;
};