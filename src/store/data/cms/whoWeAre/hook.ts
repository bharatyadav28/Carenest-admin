import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchWhoWeAre,
  createWhoWeAre,
  updateWhoWeAre,
  deleteWhoWeAre,
  updateMainSection,
  updateCaregiverNetworkSection,
  updatePromiseSection,
  WhoWeAreType,
  WhoWeAreCreateType,
  WhoWeAreUpdateType,
  MainSectionUpdateType,
  CaregiverNetworkUpdateType,
  PromiseSectionUpdateType,
} from "./api";
import { responseType } from "@/lib/interface-types";
import { showError } from "@/lib/resuable-fns";

interface WhoWeAreResponse extends responseType {
  data: {
    whoWeAre: WhoWeAreType;
  };
}

export const useWhoWeAre = () => {
  return useQuery<WhoWeAreResponse>({
    queryKey: ["who-we-are"],
    queryFn: () => fetchWhoWeAre(),
    retry: 1,
  });
};

export const useCreateWhoWeAre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (whoWeAreData: WhoWeAreCreateType) =>
      createWhoWeAre(whoWeAreData),

    onSuccess: (data) => {
      toast.success(data?.message || "Who We Are page created successfully");
      queryClient.invalidateQueries({ queryKey: ["who-we-are"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useUpdateWhoWeAre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updateData: WhoWeAreUpdateType) =>
      updateWhoWeAre(updateData),

    onSuccess: (data) => {
      toast.success(data?.message || "Who We Are page updated successfully");
      queryClient.invalidateQueries({ queryKey: ["who-we-are"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useDeleteWhoWeAre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteWhoWeAre(),

    onSuccess: (data) => {
      toast.success(data?.message || "Who We Are page deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["who-we-are"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

// Section-specific hooks
export const useUpdateMainSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updateData: MainSectionUpdateType) =>
      updateMainSection(updateData),

    onSuccess: (data) => {
      toast.success(data?.message || "Main section updated successfully");
      queryClient.invalidateQueries({ queryKey: ["who-we-are"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useUpdateCaregiverNetworkSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updateData: CaregiverNetworkUpdateType) =>
      updateCaregiverNetworkSection(updateData),

    onSuccess: (data) => {
      toast.success(data?.message || "Caregiver Network section updated successfully");
      queryClient.invalidateQueries({ queryKey: ["who-we-are"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useUpdatePromiseSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updateData: PromiseSectionUpdateType) =>
      updatePromiseSection(updateData),

    onSuccess: (data) => {
      toast.success(data?.message || "Promise section updated successfully");
      queryClient.invalidateQueries({ queryKey: ["who-we-are"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};