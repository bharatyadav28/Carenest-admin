import { useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { MdDashboard as DashboardIcon } from "react-icons/md";
import { FaCalendarAlt as BookingIcon } from "react-icons/fa";
import { FaUser as UserIcon } from "react-icons/fa";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import SidebarItem from "./SidebarItem";
import type {
  complexSidebarLinkType,
  simpleSidebarLinkType,
} from "@/lib/interface-types";

function AppSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  type sidebarLinkType = simpleSidebarLinkType | complexSidebarLinkType;
  const menuItems: sidebarLinkType[] = [
    {
      name: "Dashboard",
      Icon: DashboardIcon,
      path: "/",
    },
    {
      name: "Users Mangement",
      Icon: UserIcon,
      hasSubMenu: true,
      subMenuItems: [
        {
          name: "Care Seekers",
          Icon: UserIcon,
          path: "/care-seeker",
        },
        {
          name: "Care Givers",
          Icon: UserIcon,
          path: "/care-giver",
        },
      ],
    },
    {
      name: "Bookings",
      Icon: BookingIcon,
      path: "/bookings",
    },

    {
      name: "Inbox",
      Icon: BookingIcon,
      path: "/inbox",
    },
  ];

  // Function to check if a sub-menu item is to open by default
  const isOpenByDefault = (items: complexSidebarLinkType) => {
    const subItems = items?.subMenuItems;
    if (!subItems) return false;
    return subItems.some(
      (item) => item.path === pathname || pathname.startsWith(item.path)
    );
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="text-lg text-center font-bold h-[3rem] flex items-center justify-center">
          Carenest
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            return !item?.hasSubMenu && "path" in item ? (
              <SidebarItem
                pathname={item.path || "#"}
                Icon={item.Icon}
                name={item.name}
                key={item.name}
              />
            ) : (
              <Collapsible
                className=" group/collapsible "
                defaultOpen={isOpenByDefault(item)}
                key={item.name}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="ps-4 pr-2">
                      <item.Icon />
                      <span> {item.name} </span>
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {"subMenuItems" in item &&
                        item?.subMenuItems?.map((subItem) => (
                          <SidebarItem
                            pathname={subItem.path || "#"}
                            Icon={subItem.Icon}
                            name={subItem.name}
                            isSubItem={true}
                            key={subItem.name}
                          />
                        ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
