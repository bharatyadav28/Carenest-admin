import axiosInstance from "@/store/axiosInstance";

// Filters for fetching caregivers
export interface CareGiverFiltersType {
  page?: number;
  search?: string;
}

// Get all caregivers
export const fetchCareGivers = async (filters: CareGiverFiltersType) => {
  const searchParams = new URLSearchParams();
  if (filters.page) searchParams.append("page", filters.page.toString());
  if (filters.search) searchParams.append("search", filters.search);

  const { data } = await axiosInstance.get(`/api/v1/giver/all?${searchParams.toString()}`);
  return data;
};

// Get caregiver by ID
export const fetchCareGiverById = async (userId: string) => {
  const { data } = await axiosInstance.get(`/api/v1/giver/all/${userId}`);
  return data;
};

// Get caregiver bookings
export const fetchCareGiverBookings = async (userId: string) => {
  const { data } = await axiosInstance.get(`/api/v1/booking/giver/${userId}`);
  return data;
};

// Create new caregiver
export interface CareGiverCreateType {
  name: string;
  email: string;
  mobile: string;
  address: string;
  zipcode: string | number;
  gender: string;
  role: "giver";
}

export const createCareGiver = async (newUser: CareGiverCreateType) => {
  const { data } = await axiosInstance.post(`/api/v1/giver/manage-by-admin`, newUser);
  return data;
};

// Update caregiver
export const updateCareGiver = async (
  userId: string,
  updatedUser: Partial<CareGiverCreateType>
) => {
  const { data } = await axiosInstance.put(
    `/api/v1/user/manage-by-admin/${userId}`,
    updatedUser
  );
  return data;
};

// Delete caregiver
export const deleteCareGiver = async (userId: string) => {
  const { data } = await axiosInstance.delete(`/api/v1/giver/manage-by-admin/${userId}`);
  return data;
};
