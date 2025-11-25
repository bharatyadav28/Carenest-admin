import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchContact,
  createContact,
  updateContact,
  deleteContact,
  ContactType,
  ContactCreateType,
  ContactUpdateType,
} from "./api";
import { responseType } from "@/lib/interface-types";
import { showError } from "@/lib/resuable-fns";

interface ContactResponse extends responseType {
  data: {
    contact: ContactType;
  };
}

export const useContact = () => {
  return useQuery<ContactResponse>({
    queryKey: ["contact"],
    queryFn: () => fetchContact(),
    retry: 1,
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contactData: ContactCreateType) => createContact(contactData),

    onSuccess: (data) => {
      toast.success(data?.message || "Contact page created successfully");
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updateData: ContactUpdateType) => updateContact(updateData),

    onSuccess: (data) => {
      toast.success(data?.message || "Contact page updated successfully");
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteContact(),

    onSuccess: (data) => {
      toast.success(data?.message || "Contact page deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};