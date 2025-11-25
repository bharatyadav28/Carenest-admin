import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchHeroSection,
  updateHeroSection,
  createHeroSection,
  deleteHeroSection,
  HeroSectionType,
  HeroSectionUpdateType,
} from "./api";
import { responseType } from "@/lib/interface-types";
import { showError } from "@/lib/resuable-fns";

interface HeroSectionResponse extends responseType {
  data: {
    heroSection: HeroSectionType;
  };
}

export const useHeroSection = () => {
  return useQuery<HeroSectionResponse>({
    queryKey: ["hero-section"],
    queryFn: () => fetchHeroSection(),
    retry: 1, // Only retry once if it fails
  });
};

export const useUpdateHeroSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updateData: HeroSectionUpdateType) =>
      updateHeroSection(updateData),

    onSuccess: (data) => {
      toast.success(data?.message || "Hero section updated successfully");
      queryClient.invalidateQueries({ queryKey: ["hero-section"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useCreateHeroSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (heroData: HeroSectionUpdateType) =>
      createHeroSection(heroData),

    onSuccess: (data) => {
      toast.success(data?.message || "Hero section created successfully");
      queryClient.invalidateQueries({ queryKey: ["hero-section"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useDeleteHeroSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteHeroSection(),

    onSuccess: (data) => {
      toast.success(data?.message || "Hero section deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["hero-section"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};