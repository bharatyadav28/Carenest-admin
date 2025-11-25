import axiosInstance from "@/store/axiosInstance";

export interface FAQItemType {
  id: string;
  question: string;
  answer: string;
}

export interface FAQType {
  id: string;
  faqType: string;
  sectionTitle?: string;
  faqItems: FAQItemType[];
  createdAt: string;
  updatedAt: string;
}

export interface FAQCreateType {
  faqType: string;
  sectionTitle?: string;
  faqItems: Omit<FAQItemType, 'id'>[];
}

export interface FAQUpdateType {
  faqType?: string;
  sectionTitle?: string;
  faqItems?: FAQItemType[];
}

export interface FAQItemInputType {
  question: string;
  answer: string;
}

// Main FAQ operations
export const fetchAllFAQs = async () => {
  const { data } = await axiosInstance.get(`/api/v1/faq`);
  return data;
};

export const fetchFAQsByType = async (faqType: string) => {
  const { data } = await axiosInstance.get(`/api/v1/faq/type/${faqType}`);
  return data;
};

export const fetchFAQById = async (id: string) => {
  const { data } = await axiosInstance.get(`/api/v1/faq/${id}`);
  return data;
};

export const createFAQ = async (faqData: FAQCreateType) => {
  const { data } = await axiosInstance.post(`/api/v1/faq`, faqData);
  return data;
};

export const updateFAQ = async (id: string, updateData: FAQUpdateType) => {
  const { data } = await axiosInstance.put(
    `/api/v1/faq/${id}`,
    updateData
  );
  return data;
};

export const deleteFAQ = async (id: string) => {
  const { data } = await axiosInstance.delete(`/api/v1/faq/${id}`);
  return data;
};

// FAQ Item management
export const addFAQItem = async (faqId: string, itemData: FAQItemInputType) => {
  const { data } = await axiosInstance.post(
    `/api/v1/faq/${faqId}/items`,
    itemData
  );
  return data;
};

export const updateFAQItem = async (faqId: string, itemId: string, itemData: FAQItemInputType) => {
  const { data } = await axiosInstance.put(
    `/api/v1/faq/${faqId}/items/${itemId}`,
    itemData
  );
  return data;
};

export const deleteFAQItem = async (faqId: string, itemId: string) => {
  const { data } = await axiosInstance.delete(
    `/api/v1/faq/${faqId}/items/${itemId}`
  );
  return data;
};