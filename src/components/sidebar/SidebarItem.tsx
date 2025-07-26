import { useLocation, useNavigate } from "react-router-dom";

import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { useEffect } from "react";
import useGeneral from "@/store/features/general";

interface Props {
  pathname: string;
  Icon: React.ElementType;
  name: string;
  isSubItem?: boolean;
}

function SidebarItem({ pathname, Icon, name, isSubItem = false }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const replacePageName = useGeneral((state) => state.replacePageName);

  const currentPath = location.pathname;

  const handleClick = () => {
    navigate(pathname);
  };

  const isActive =
    currentPath === pathname ||
    (pathname !== "/" && currentPath.startsWith(pathname));

  useEffect(() => {
    if (currentPath === pathname) {
      replacePageName(name);
    }
  }, [currentPath, pathname]);

  return (
    <>
      {!isSubItem && (
        <SidebarMenuItem>
          {" "}
          <SidebarMenuButton
            isActive={isActive}
            className="py-4 ps-4 pr-2 data-[active=true]:bg-[var(--project-main)]"
            onClick={handleClick}
          >
            <Icon /> <span> {name} </span>
          </SidebarMenuButton>{" "}
        </SidebarMenuItem>
      )}

      {isSubItem && (
        <SidebarMenuSubItem>
          <SidebarMenuButton
            isActive={isActive}
            className="py-2 data-[active=true]:bg-[var(--project-main)]"
            onClick={handleClick}
          >
            <Icon /> <span> {name} </span>
          </SidebarMenuButton>
        </SidebarMenuSubItem>
      )}
    </>
  );
}

export default SidebarItem;
