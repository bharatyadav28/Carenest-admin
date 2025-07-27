import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import { signin } from "./api";
import { useMutation } from "@tanstack/react-query";
import { getCookieConfig } from "@/lib/resuable-fns";

export const useSignin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signin,

    onSuccess: (data) => {
      const { accessToken, refreshToken } = data?.data;

      Cookies.set("accessToken", accessToken, getCookieConfig(accessToken));
      Cookies.set("refreshToken", refreshToken, getCookieConfig(refreshToken));

      navigate("/");
    },

    onError: (error: AxiosError<any>) => {
      alert(error.response?.data?.message || "Signin failed");
    },
  });
};
