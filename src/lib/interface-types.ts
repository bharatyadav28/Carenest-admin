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

export interface caregiverType {
  id: string;
  name: string;
  avatar: string;
  email: string;
  isUsersChoice: boolean;
  isFinalSelection: boolean;
  minExperience: number;
  maxExperience: number;
  minPrice: number;
  maxPrice: number;
  isDeleted: boolean;
}
