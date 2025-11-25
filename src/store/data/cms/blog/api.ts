import axiosInstance from "@/store/axiosInstance";

export interface BlogType {
  id: string;
  mainImage: string;
  title: string;
  description: string;
  authorName: string;
  authorProfilePic?: string;
  blogDate: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCreateType {
  mainImage: string;
  title: string;
  description: string;
  authorName: string;
  authorProfilePic?: string;
  blogDate: string;
  content: string;
}

export interface BlogUpdateType {
  mainImage?: string;
  title?: string;
  description?: string;
  authorName?: string;
  authorProfilePic?: string;
  blogDate?: string;
  content?: string;
}

export interface BlogsResponse {
  blogs: BlogType[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface BlogFilters {
  page?: number;
  limit?: number;
  sort_by?: string;
  order?: "asc" | "desc";
  search?: string;
}

// Get all blogs with pagination and filters
export const fetchBlogs = async (filters: BlogFilters = {}) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  const { data } = await axiosInstance.get(`/api/v1/blog?${params}`);
  return data;
};

// Get single blog by ID
export const fetchBlogById = async (id: string) => {
  const { data } = await axiosInstance.get(`/api/v1/blog/${id}`);
  return data;
};

// Get recent blogs
export const fetchRecentBlogs = async (limit: number = 5) => {
  const { data } = await axiosInstance.get(`/api/v1/blog/recent?limit=${limit}`);
  return data;
};

// Create new blog
export const createBlog = async (blogData: BlogCreateType) => {
  const { data } = await axiosInstance.post(`/api/v1/blog`, blogData);
  return data;
};

// Update blog
export const updateBlog = async (id: string, updateData: BlogUpdateType) => {
  const { data } = await axiosInstance.put(`/api/v1/blog/${id}`, updateData);
  return data;
};

// Delete blog
export const deleteBlog = async (id: string) => {
  const { data } = await axiosInstance.delete(`/api/v1/blog/${id}`);
  return data;
};