import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./sidebar/AppSidebar";
import Header from "./Header";

function Layout() {
  const navigate = useNavigate();

  const refreshToken = Cookies.get("refreshToken");

  useEffect(() => {
    if (!refreshToken) {
      navigate("/signin");
      return;
    }
    try {
      const decoded: { exp: number } = jwtDecode(refreshToken);
      const currentTime = Date.now() / 1000; // in seconds

      if (decoded.exp < currentTime) {
        // Token expired
        navigate("/signin");
      }
    } catch (err) {
      // Invalid token format
      navigate("/signin");
    }
  }, [refreshToken]);

  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="ps-6 pr-6 w-full h-screen flex flex-col">
        <Header />
        <div className="relative flex-grow pb-4 ">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default Layout;
