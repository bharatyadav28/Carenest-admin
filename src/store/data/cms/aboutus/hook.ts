import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchAboutUs,
  updateAboutUs,
  createAboutUs,
  deleteAboutUs,
  updateKeyPeople,
  updateTeamMembers,
  updateOurValues,
  AboutUsType,
  AboutUsUpdateType,
  KeyPersonType,
  TeamMemberType,
  ValueType,
} from "./api";
import { responseType } from "@/lib/interface-types";
import { showError } from "@/lib/resuable-fns";

interface AboutUsResponse extends responseType {
  data: {
    aboutUs: AboutUsType;
  };
}

export const useAboutUs = () => {
  return useQuery<AboutUsResponse>({
    queryKey: ["about-us"],
    queryFn: () => fetchAboutUs(),
    retry: 1,
  });
};

export const useUpdateAboutUs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updateData: AboutUsUpdateType) =>
      updateAboutUs(updateData),

    onSuccess: (data) => {
      toast.success(data?.message || "About Us page updated successfully");
      queryClient.invalidateQueries({ queryKey: ["about-us"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useCreateAboutUs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (aboutData: AboutUsUpdateType) =>
      createAboutUs(aboutData),

    onSuccess: (data) => {
      toast.success(data?.message || "About Us page created successfully");
      queryClient.invalidateQueries({ queryKey: ["about-us"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useDeleteAboutUs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteAboutUs(),

    onSuccess: (data) => {
      toast.success(data?.message || "About Us page deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["about-us"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useUpdateKeyPeople = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (keyPeople: KeyPersonType[]) =>
      updateKeyPeople(keyPeople),

    onSuccess: (data) => {
      toast.success(data?.message || "Key people updated successfully");
      queryClient.invalidateQueries({ queryKey: ["about-us"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useUpdateTeamMembers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamMembers: TeamMemberType[]) =>
      updateTeamMembers(teamMembers),

    onSuccess: (data) => {
      toast.success(data?.message || "Team members updated successfully");
      queryClient.invalidateQueries({ queryKey: ["about-us"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useUpdateOurValues = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ourValues: ValueType[]) =>
      updateOurValues(ourValues),

    onSuccess: (data) => {
      toast.success(data?.message || "Our values updated successfully");
      queryClient.invalidateQueries({ queryKey: ["about-us"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};