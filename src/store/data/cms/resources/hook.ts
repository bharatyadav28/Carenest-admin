import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchResources,
  updateResources,
  createResources,
  deleteResources,
  addResourceCard,
  updateResourceCard,
  deleteResourceCard,
  ResourcesType,
  ResourcesUpdateType,
  ResourceCardInputType,
} from "./api";
import { responseType } from "@/lib/interface-types";
import { showError } from "@/lib/resuable-fns";

interface ResourcesResponse extends responseType {
  data: {
    resources: ResourcesType;
  };
}

export const useResources = () => {
  return useQuery<ResourcesResponse>({
    queryKey: ["resources"],
    queryFn: () => fetchResources(),
    retry: 1,
  });
};

export const useUpdateResources = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updateData: ResourcesUpdateType) =>
      updateResources(updateData),

    onSuccess: (data) => {
      toast.success(data?.message || "Resources page updated successfully");
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useCreateResources = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resourcesData: ResourcesUpdateType) =>
      createResources(resourcesData),

    onSuccess: (data) => {
      toast.success(data?.message || "Resources page created successfully");
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useDeleteResources = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteResources(),

    onSuccess: (data) => {
      toast.success(data?.message || "Resources page deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useAddResourceCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardData: ResourceCardInputType) =>
      addResourceCard(cardData),

    onSuccess: (data) => {
      toast.success(data?.message || "Resource card added successfully");
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useUpdateResourceCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, cardData }: { cardId: string; cardData: ResourceCardInputType }) =>
      updateResourceCard(cardId, cardData),

    onSuccess: (data) => {
      toast.success(data?.message || "Resource card updated successfully");
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useDeleteResourceCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) =>
      deleteResourceCard(cardId),

    onSuccess: (data) => {
      toast.success(data?.message || "Resource card deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};