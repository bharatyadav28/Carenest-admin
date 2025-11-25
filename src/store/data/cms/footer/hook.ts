import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchFooter,
  createFooter,
  updateFooter,
  deleteFooter,
  addLocation,
  updateLocation,
  deleteLocation,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink,
  FooterType,
  FooterCreateType,
  FooterUpdateType,
  SocialLinkInputType,
} from "./api";
import { responseType } from "@/lib/interface-types";
import { showError } from "@/lib/resuable-fns";

interface FooterResponse extends responseType {
  data: {
    footer: FooterType;
  };
}

export const useFooter = () => {
  return useQuery<FooterResponse>({
    queryKey: ["footer"],
    queryFn: () => fetchFooter(),
    retry: 1,
  });
};

export const useCreateFooter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (footerData: FooterCreateType) =>
      createFooter(footerData),

    onSuccess: (data) => {
      toast.success(data?.message || "Footer created successfully");
      queryClient.invalidateQueries({ queryKey: ["footer"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useUpdateFooter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updateData: FooterUpdateType) =>
      updateFooter(updateData),

    onSuccess: (data) => {
      toast.success(data?.message || "Footer updated successfully");
      queryClient.invalidateQueries({ queryKey: ["footer"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useDeleteFooter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteFooter(),

    onSuccess: (data) => {
      toast.success(data?.message || "Footer deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["footer"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

// Location management hooks
export const useAddLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (location: string) => addLocation(location),

    onSuccess: (data) => {
      toast.success(data?.message || "Location added successfully");
      queryClient.invalidateQueries({ queryKey: ["footer"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ oldLocation, newLocation }: { oldLocation: string; newLocation: string }) =>
      updateLocation(oldLocation, newLocation),

    onSuccess: (data) => {
      toast.success(data?.message || "Location updated successfully");
      queryClient.invalidateQueries({ queryKey: ["footer"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (location: string) => deleteLocation(location),

    onSuccess: (data) => {
      toast.success(data?.message || "Location deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["footer"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

// Social links management hooks
export const useAddSocialLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (socialLink: SocialLinkInputType) => addSocialLink(socialLink),

    onSuccess: (data) => {
      toast.success(data?.message || "Social link added successfully");
      queryClient.invalidateQueries({ queryKey: ["footer"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useUpdateSocialLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ linkId, socialLink }: { linkId: string; socialLink: SocialLinkInputType }) =>
      updateSocialLink(linkId, socialLink),

    onSuccess: (data) => {
      toast.success(data?.message || "Social link updated successfully");
      queryClient.invalidateQueries({ queryKey: ["footer"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useDeleteSocialLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (linkId: string) => deleteSocialLink(linkId),

    onSuccess: (data) => {
      toast.success(data?.message || "Social link deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["footer"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};