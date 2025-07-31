import type { IconType } from "react-icons/lib";

// Sidebar types
export interface simpleSidebarLinkType {
  name: string;
  path: string;
  Icon: IconType;
  hasSubMenu?: boolean;
}

export interface complexSidebarLinkType {
  name: string;
  Icon: IconType;
  hasSubMenu?: boolean;
  subMenuItems?: simpleSidebarLinkType[];
}

export interface bookingType {
  bookingId: string;
  bookedOn: string;
  appointmentDate: string;
  duration: string;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  service: string;
}

export interface bookingFiltersType {
  page?: number;
  search?: string;
  bookedOn?: string;
  appointmentDate?: string;
  status?: string;
}
