import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import { signin } from "./api";
import { useMutation } from "@tanstack/react-query";
import { getCookieConfig } from "@/lib/resuable-fns";
import { toast } from "sonner";

export const useSignin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signin,

    onSuccess: (data) => {
      console.log("Signin successful:", data);
      toast.success(data?.message);
      const { accessToken, refreshToken } = data?.data;

      Cookies.set("accessToken", accessToken, getCookieConfig(accessToken));
      Cookies.set("refreshToken", refreshToken, getCookieConfig(refreshToken));

      navigate("/");
    },

    onError: (error: AxiosError<any>) => {
      console.log("Error during signin:", error);
      toast.error(error?.response?.data?.message || "Signin failed");
    },
  });
};
