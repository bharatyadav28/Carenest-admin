import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchBecomeCaregiver,
  createBecomeCaregiver,
  updateBecomeCaregiver,
  deleteBecomeCaregiver,
  updatePoints,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  BecomeCaregiverType,
  BecomeCaregiverCreateType,
  BecomeCaregiverUpdateType,
  PointType,
  TestimonialInputType,
} from "./api";
import { responseType } from "@/lib/interface-types";
import { showError } from "@/lib/resuable-fns";

interface BecomeCaregiverResponse extends responseType {
  data: {
    becomeCaregiver: BecomeCaregiverType;
  };
}

export const useBecomeCaregiver = () => {
  return useQuery<BecomeCaregiverResponse>({
    queryKey: ["become-caregiver"],
    queryFn: () => fetchBecomeCaregiver(),
    retry: 1,
  });
};

export const useCreateBecomeCaregiver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (becomeCaregiverData: BecomeCaregiverCreateType) =>
      createBecomeCaregiver(becomeCaregiverData),

    onSuccess: (data) => {
      toast.success(data?.message || "Become Caregiver page created successfully");
      queryClient.invalidateQueries({ queryKey: ["become-caregiver"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useUpdateBecomeCaregiver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updateData: BecomeCaregiverUpdateType) =>
      updateBecomeCaregiver(updateData),

    onSuccess: (data) => {
      toast.success(data?.message || "Become Caregiver page updated successfully");
      queryClient.invalidateQueries({ queryKey: ["become-caregiver"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useDeleteBecomeCaregiver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteBecomeCaregiver(),

    onSuccess: (data) => {
      toast.success(data?.message || "Become Caregiver page deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["become-caregiver"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

// Points management hooks
export const useUpdatePoints = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (points: PointType[]) => updatePoints(points),

    onSuccess: (data) => {
      toast.success(data?.message || "Points updated successfully");
      queryClient.invalidateQueries({ queryKey: ["become-caregiver"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

// Testimonials management hooks
export const useAddTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (testimonialData: TestimonialInputType) => addTestimonial(testimonialData),

    onSuccess: (data) => {
      toast.success(data?.message || "Testimonial added successfully");
      queryClient.invalidateQueries({ queryKey: ["become-caregiver"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ testimonialId, testimonialData }: { testimonialId: string; testimonialData: TestimonialInputType }) =>
      updateTestimonial(testimonialId, testimonialData),

    onSuccess: (data) => {
      toast.success(data?.message || "Testimonial updated successfully");
      queryClient.invalidateQueries({ queryKey: ["become-caregiver"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (testimonialId: string) => deleteTestimonial(testimonialId),

    onSuccess: (data) => {
      toast.success(data?.message || "Testimonial deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["become-caregiver"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};