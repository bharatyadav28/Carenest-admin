import { useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { MdDashboard as DashboardIcon } from "react-icons/md";
import { FaCalendarAlt as BookingIcon, FaUser as UserIcon } from "react-icons/fa";
import { HiUsers as UsersIcon } from "react-icons/hi";
import { HiDocumentText as ContentIcon } from "react-icons/hi2";
import { RiShieldUserLine as HeroIcon } from "react-icons/ri";
import { FiInfo as InfoIcon } from "react-icons/fi";
import { TbUsersGroup as GroupIcon } from "react-icons/tb";
import { IoDocumentsOutline as ResourcesIcon } from "react-icons/io5";
import { AiOutlineUserAdd as CaregiverIcon } from "react-icons/ai";
import { BsNewspaper as BlogIcon } from "react-icons/bs";
import { AiOutlineStar as StarIcon } from "react-icons/ai";
import { RiQuestionLine as QuestionIcon } from "react-icons/ri";
import { GoLocation as LocationIcon } from "react-icons/go";
import { MdOutlineContactMail as ContactIcon } from "react-icons/md";
import { BiFoodMenu as FooterIcon } from "react-icons/bi";
import { GiHeartPlus as HeartIcon } from "react-icons/gi";
import { MdOutlineHomeWork as HomeIcon } from "react-icons/md";
import { FaHandshake as HandshakeIcon } from "react-icons/fa";
import { MdOutlineMedicalServices as MedicalIcon } from "react-icons/md";
import { MdOutlineChildCare as ChildIcon } from "react-icons/md";
import { MdDirectionsCar as CarIcon } from "react-icons/md";
import { MdDirectionsCar as MilitaryIcon } from "react-icons/md";
import { MdOutlinePolicy as PolicyIcon } from "react-icons/md";
import { MdPrivacyTip as PrivacyIcon } from "react-icons/md";
import { MdOutlineGavel as LegalIcon } from "react-icons/md";
import { MdOutlineMail as InboxIcon } from "react-icons/md";
import { MdOutlineAssignmentInd as ApplicationIcon } from "react-icons/md";

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
      name: "Users Management",
      Icon: UsersIcon,
      hasSubMenu: true,
      subMenuItems: [
        {
          name: "Care Seekers",
          Icon: UserIcon,
          path: "/care-seeker",
        },
        {
          name: "Care Givers",
          Icon: GroupIcon,
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
      Icon: ContentIcon,
      hasSubMenu: true,
      subMenuItems: [
        {
          name: "Hero Section",
          Icon: HeroIcon,
          path: "/hero-section",
        },
        {
          name: "About Section",
          Icon: InfoIcon,
          path: "/about-section",
        },
        {
          name: "Who We Are",
          Icon: GroupIcon,
          path: "/who-we-are",
        },
        {
          name: "Resources Section",
          Icon: ResourcesIcon,
          path: "/resources-section",
        },
        {
          name: "Become Caregiver Section",
          Icon: CaregiverIcon,
          path: "/become-caregiver-section",
        },
        {
          name: "Blog Section",
          Icon: BlogIcon,
          path: "/blog-section",
        },
        {
          name: "Testimonial Section",
          Icon: StarIcon,
          path: "/testimonial-section",
        },
        {
          name: "FAQ Section",
          Icon: QuestionIcon,
          path: "/faq-section",
        },
        {
          name: "Location Services",
          Icon: LocationIcon,
          path: "/location-services",
        },
        {
          name: "Contact Section",
          Icon: ContactIcon,
          path: "/contact-section",
        },
        {
          name: "Footer Section",
          Icon: FooterIcon,
          path: "/footer-section",
        }
      ],
    },
    {
      name: "Services Pages",
      Icon: MedicalIcon,
      hasSubMenu: true,
      subMenuItems: [
        {
          name: "Personal Care",
          Icon: HeartIcon,
          path: "/personal-care",
        },
        {
          name: "Home Care",
          Icon: HomeIcon,
          path: "/home-care",
        },
        {
          name: "Companion Care",
          Icon: HandshakeIcon,
          path: "/companion-care",
        },
        {
          name: "Specialized Care",
          Icon: MedicalIcon,
          path: "/specialized-care",
        },
        {
          name: "Sitter Service",
          Icon: ChildIcon,
          path: "/sitter-services",
        },
        {
          name: "Transportation Service",
          Icon: CarIcon,
          path: "/transportation-service",
        },
        {
          name: "Veterans Home Care",
          Icon: MilitaryIcon,
          path: "/veterans-home-care",
        },
      ],
    },
    {
      name: "Policy Management",
      Icon: PolicyIcon,
      hasSubMenu: true,
      subMenuItems: [
        {
          name: "Privacy Policy",
          Icon: PrivacyIcon,
          path: "/privacy-policy",
        },
        {
          name: "Terms and Conditions",
          Icon: ContentIcon,
          path: "/terms-and-conditions",
        },
        {
          name: "Legal",
          Icon: LegalIcon,
          path: "/legal",
        },
      ],
    },
    {
      name: "Inbox",
      Icon: InboxIcon,
      path: "/inbox",
    },
    {
      name: "Caregiver Applications",
      Icon: ApplicationIcon,
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
                className="group/collapsible"
                defaultOpen={isOpenByDefault(item)}
                key={item.name}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="ps-4 pr-2">
                      <item.Icon />
                      <span>{item.name}</span>
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