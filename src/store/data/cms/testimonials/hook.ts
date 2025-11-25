import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchTestimonials,
  fetchTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  TestimonialType,
  TestimonialCreateType,
  TestimonialUpdateType,
  TestimonialsResponse,
} from "./api";
import { responseType } from "@/lib/interface-types";
import { showError } from "@/lib/resuable-fns";

interface TestimonialResponse extends responseType {
  data: {
    testimonial: TestimonialType;
  };
}

interface TestimonialsListResponse extends responseType {
  data: TestimonialsResponse;
}

// Get all testimonials
export const useTestimonials = () => {
  return useQuery<TestimonialsListResponse>({
    queryKey: ["testimonials"],
    queryFn: () => fetchTestimonials(),
    retry: 1,
  });
};

// Get single testimonial by ID
export const useTestimonial = (id: string) => {
  return useQuery<TestimonialResponse>({
    queryKey: ["testimonial", id],
    queryFn: () => fetchTestimonialById(id),
    enabled: !!id,
    retry: 1,
  });
};

// Create testimonial mutation
export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (testimonialData: TestimonialCreateType) => createTestimonial(testimonialData),

    onSuccess: (data) => {
      toast.success(data?.message || "Testimonial created successfully");
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

// Update testimonial mutation
export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updateData }: { id: string; updateData: TestimonialUpdateType }) =>
      updateTestimonial(id, updateData),

    onSuccess: (data, variables) => {
      toast.success(data?.message || "Testimonial updated successfully");
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonial", variables.id] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

// Delete testimonial mutation
export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTestimonial(id),

    onSuccess: (data) => {
      toast.success(data?.message || "Testimonial deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};