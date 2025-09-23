import axiosInstance from "@/store/axiosInstance";


export interface CareSeekerFiltersType {
  page?: number;
  search?: string;
  hasDoneBooking?: boolean;
}

// Get all users (care seekers)
export const fetchCareSeekers = async (filters: CareSeekerFiltersType) => {
  const searchParams = new URLSearchParams();
  if (filters.page) searchParams.append("page", filters.page.toString());
  if (filters.search) searchParams.append("search", filters.search);
  if (filters.hasDoneBooking !== undefined)
    searchParams.append("hasDoneBooking", String(filters.hasDoneBooking));

  const { data } = await axiosInstance.get(
    `/api/v1/user/all?${searchParams.toString()}`
  );
  return data;
};

// Get user details by ID
export const fetchCareSeekerById = async (userId: string) => {
  const { data } = await axiosInstance.get(`/api/v1/user/all/${userId}`);
  return data;
};

// Get user bookings by user ID
export const fetchCareSeekerBookings = async (userId: string) => {
  const { data } = await axiosInstance.get(`/api/v1/booking/seeker/${userId}`);
  return data;
};

// Create a new user
export interface CareSeekerCreateType {
  name: string;
  email: string;
  mobile: string;
  address: string;
  zipcode: number| string;
  gender: string;
  role: "user";
}
export const createCareSeeker = async (newUser: CareSeekerCreateType) => {
  const { data } = await axiosInstance.post(
    `/api/v1/user/manage-by-admin`,
    newUser
  );
  return data;
};

// Update user
export const updateCareSeeker = async (
  userId: string,
  updatedUser: Partial<CareSeekerCreateType>
) => {
  const { data } = await axiosInstance.put(
    `/api/v1/user/manage-by-admin/${userId}`,
    updatedUser
  );
  return data;
};

// Delete user
export const deleteCareSeeker = async (userId: string) => {
  const { data } = await axiosInstance.delete(
    `/api/v1/user/manage-by-admin/${userId}`
  );
  return data;
};
