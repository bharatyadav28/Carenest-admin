import axiosInstance from "@/store/axiosInstance";

interface payloadType {
  email: string;
  password: string;
}
export const signin = async ({ email, password }: payloadType) => {
  const { data } = await axiosInstance.post("/api/v1/user/signin", {
    email,
    password,
    role: "admin",
  });

  return data;
};
