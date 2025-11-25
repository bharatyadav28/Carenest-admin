import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchAllFAQs,
  fetchFAQsByType,
  fetchFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  addFAQItem,
  updateFAQItem,
  deleteFAQItem,
  FAQType,
  FAQCreateType,
  FAQUpdateType,
  FAQItemInputType,
} from "./api";
import { responseType } from "@/lib/interface-types";
import { showError } from "@/lib/resuable-fns";

interface FAQResponse extends responseType {
  data: {
    faqs: FAQType[];
    count: number;
  };
}

interface SingleFAQResponse extends responseType {
  data: {
    faq: FAQType;
  };
}

// Fetch all FAQs
export const useAllFAQs = () => {
  return useQuery<FAQResponse>({
    queryKey: ["faqs"],
    queryFn: () => fetchAllFAQs(),
    retry: 1,
  });
};

// Fetch FAQs by type
export const useFAQsByType = (faqType: string) => {
  return useQuery<FAQResponse>({
    queryKey: ["faqs", faqType],
    queryFn: () => fetchFAQsByType(faqType),
    retry: 1,
    enabled: !!faqType,
  });
};

// Fetch single FAQ by ID
export const useFAQById = (id: string) => {
  return useQuery<SingleFAQResponse>({
    queryKey: ["faq", id],
    queryFn: () => fetchFAQById(id),
    retry: 1,
    enabled: !!id,
  });
};

// FAQ CRUD operations
export const useCreateFAQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (faqData: FAQCreateType) => createFAQ(faqData),

    onSuccess: (data) => {
      toast.success(data?.message || "FAQ created successfully");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useUpdateFAQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updateData }: { id: string; updateData: FAQUpdateType }) =>
      updateFAQ(id, updateData),

    onSuccess: (data) => {
      toast.success(data?.message || "FAQ updated successfully");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useDeleteFAQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFAQ(id),

    onSuccess: (data) => {
      toast.success(data?.message || "FAQ deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

// FAQ Item operations
export const useAddFAQItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ faqId, itemData }: { faqId: string; itemData: FAQItemInputType }) =>
      addFAQItem(faqId, itemData),

    onSuccess: (data) => {
      toast.success(data?.message || "FAQ item added successfully");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useUpdateFAQItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ faqId, itemId, itemData }: { faqId: string; itemId: string; itemData: FAQItemInputType }) =>
      updateFAQItem(faqId, itemId, itemData),

    onSuccess: (data) => {
      toast.success(data?.message || "FAQ item updated successfully");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useDeleteFAQItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ faqId, itemId }: { faqId: string; itemId: string }) =>
      deleteFAQItem(faqId, itemId),

    onSuccess: (data) => {
      toast.success(data?.message || "FAQ item deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};