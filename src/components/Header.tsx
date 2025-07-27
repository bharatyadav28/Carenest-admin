import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CgProfile as ProfileIcon } from "react-icons/cg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useGeneral from "@/store/features/general";
import { toast } from "sonner";

function Header() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const pageName = useGeneral((state) => state.pageName);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    toast.success("Logged out successfully");
    navigate("/signin");
  };

  return (
    <div className="flex justify-between items-center h-[3rem] my-2 w-full">
      <div className="text-[1.25rem] uppercase flex gap-4">
        {isMobile && (
          <div>
            {" "}
            <SidebarTrigger />{" "}
          </div>
        )}
        <div>{pageName} </div>
      </div>

      <div className="flex lg:gap-16 gap-8 items-center">
        <div className="hover:cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ProfileIcon size={25} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => {}}
              >
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default Header;
