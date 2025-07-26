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

function Header() {
  const isMobile = useIsMobile();
  const pageName = useGeneral((state) => state.pageName);

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
                onClick={() => {}}
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
