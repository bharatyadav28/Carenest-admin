import axiosInstance from "@/store/axiosInstance";

export interface ContactType {
  id: string;
  phoneNumber: string;
  email: string;
  address: string;
  businessHours: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactCreateType {
  phoneNumber: string;
  email: string;
  address: string;
  businessHours: string;
}

export interface ContactUpdateType {
  phoneNumber?: string;
  email?: string;
  address?: string;
  businessHours?: string;
}

// Get contact page data
export const fetchContact = async () => {
  const { data } = await axiosInstance.get(`/api/v1/contact`);
  return data;
};

// Create contact page (only if it doesn't exist)
export const createContact = async (contactData: ContactCreateType) => {
  const { data } = await axiosInstance.post(`/api/v1/contact`, contactData);
  return data;
};

// Update contact page
export const updateContact = async (updateData: ContactUpdateType) => {
  // First get the current contact to get the ID
  const currentData = await fetchContact();
  const contactId = currentData.data.contact.id;
  
  const { data } = await axiosInstance.put(`/api/v1/contact/${contactId}`, updateData);
  return data;
};

// Delete contact page
export const deleteContact = async () => {
  // First get the current contact to get the ID
  const currentData = await fetchContact();
  const contactId = currentData.data.contact.id;
  
  const { data } = await axiosInstance.delete(`/api/v1/contact/${contactId}`);
  return data;
};