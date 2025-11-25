import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchBlogs,
  fetchBlogById,
  fetchRecentBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  BlogType,
  BlogCreateType,
  BlogUpdateType,
  BlogsResponse,
  BlogFilters,
} from "./api";
import { responseType } from "@/lib/interface-types";
import { showError } from "@/lib/resuable-fns";

interface BlogResponse extends responseType {
  data: {
    blog: BlogType;
  };
}

interface BlogsListResponse extends responseType {
  data: BlogsResponse;
}

interface RecentBlogsResponse extends responseType {
  data: {
    blogs: BlogType[];
    count: number;
  };
}

// Get all blogs with filters
export const useBlogs = (filters: BlogFilters = {}) => {
  return useQuery<BlogsListResponse>({
    queryKey: ["blogs", filters],
    queryFn: () => fetchBlogs(filters),
    retry: 1,
  });
};

// Get single blog by ID
export const useBlog = (id: string) => {
  return useQuery<BlogResponse>({
    queryKey: ["blog", id],
    queryFn: () => fetchBlogById(id),
    enabled: !!id,
    retry: 1,
  });
};

// Get recent blogs
export const useRecentBlogs = (limit: number = 5) => {
  return useQuery<RecentBlogsResponse>({
    queryKey: ["recent-blogs", limit],
    queryFn: () => fetchRecentBlogs(limit),
    retry: 1,
  });
};

// Create blog mutation
export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (blogData: BlogCreateType) => createBlog(blogData),

    onSuccess: (data) => {
      toast.success(data?.message || "Blog created successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["recent-blogs"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

// Update blog mutation
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updateData }: { id: string; updateData: BlogUpdateType }) =>
      updateBlog(id, updateData),

    onSuccess: (data, variables) => {
      toast.success(data?.message || "Blog updated successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["recent-blogs"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

// Delete blog mutation
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBlog(id),

    onSuccess: (data) => {
      toast.success(data?.message || "Blog deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["recent-blogs"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};