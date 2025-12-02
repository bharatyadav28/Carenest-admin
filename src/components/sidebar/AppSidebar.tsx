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
      name: "Content Management",
      Icon: UserIcon,
      hasSubMenu: true,
      subMenuItems: [
        {
          name: "Hero Section",
          Icon: UserIcon,
          path: "/hero-section",
        },
        {
          name: "About Section",
          Icon: UserIcon,
          path: "/about-section",
        },
            {
          name: " Who We Are",
          Icon: UserIcon,
          path: "/who-we-are",
        },
          {
          name: "Resources Section",
          Icon: UserIcon,
          path: "/resources-section",
        },
               {
          name: "Become Caregiver Section",
          Icon: UserIcon,
          path: "/become-caregiver-section",
        },
        {
          name: "Blog Section",
          Icon: UserIcon,
          path: "/blog-section",
        },
        {
          name: "Testimonial Section",
          Icon: UserIcon,
          path: "/testimonial-section",
        },
                {
          name: "FAQ Section",
          Icon: UserIcon,
          path: "/faq-section",
        },
               {
      name: "Location Services",
      Icon: BookingIcon,
      path: "/location-services",
    },
        
        {
          name: "Contact Section",
          Icon: UserIcon,
          path: "/contact-section",
        },
          {
          name: "Footer Section",
          Icon: UserIcon,
          path: "/footer-section",
        }


        
        
      ],
    },
       {
      name: "Services Pages",
      Icon: UserIcon,
      hasSubMenu: true,
      subMenuItems: [
        {
          name: "Personal Care",
          Icon: UserIcon,
          path: "/personal-care",
        },
        {
          name: "Home Care",
          Icon: UserIcon,
          path: "/home-care",
        },
          {
          name: "Companinion Care",
          Icon: UserIcon,
          path: "/companion-care",
        },
          {
          name: "Specialized Care",
          Icon: UserIcon,
          path: "/specialized-care",
        },
           {
          name: "Sitter Service",
          Icon: UserIcon,
          path: "/sitter-services",
        },
               {
          name: "Transportation Service",
          Icon: UserIcon,
          path: "/transportation-service",
        },
                 {
          name: "Veterans Home Care ",
          Icon: UserIcon,
          path: "/veterans-home-care",
        },
      ],
    },
       {
      name: " Policy Management",
      Icon: UserIcon,
      hasSubMenu: true,
      subMenuItems: [
        {
          name: "Privacy Policy",
          Icon: UserIcon,
          path: "/privacy-policy",
        },
        {
          name: "Terms and Conditions",
          Icon: UserIcon,
          path: "/terms-and-conditions",
        },
           {
          name: "legal ",
          Icon: UserIcon,
          path: "/legal",
        },
      ],
    },
    {
      name: "Inbox",
      Icon: BookingIcon,
      path: "/inbox",
    },
       {
      name: "Caregiver Applications",
      Icon: BookingIcon,
      path: "/caregiver-applications",
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
        CareWorks
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
