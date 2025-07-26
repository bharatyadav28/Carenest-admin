import { Outlet } from "react-router-dom";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./sidebar/AppSidebar";
import Header from "./Header";

function Layout() {
  // const navigate = useNavigate();

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
