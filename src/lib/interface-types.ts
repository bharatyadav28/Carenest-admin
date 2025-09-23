import type { IconType } from "react-icons/lib";

// Sidebar types

export interface responseType {
  success: boolean;
  message: string;
}
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

export interface bookingFiltersType {
  page?: number;
  search?: string;
  bookedOn?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface serviceType {
  id: string;
  name: string;
}

export interface careseekerType {
  id: string;
  name: string;
  email: string;
  mobile: string;
}
export interface caregiverType {
  id: string;
  name: string;
  avatar: string;
  email: string;
  isUsersChoice: boolean;
  status: string;
  minExperience: number;
  maxExperience: number;
  minPrice: number;
  maxPrice: number;
  isDeleted: boolean;
}

export interface weeklyScheduleType {
  id?: string;
  weekDay: string;
  startTime: string;
  endTime: string;
}

export interface bookingType {
  bookingId: string;
  bookedOn: string;
  startDate: string;
  endDate?: string;
  duration: string;
  status: string;
  services: serviceType[];
  user: careseekerType;
  service: string;
  cancelledAt: string;
  caregivers: caregiverType[];
  weeklySchedule: weeklyScheduleType[];
  requiredBy: string;
  careseekerZipCode: string;
}

export interface dashboardDataType {
  totalSeekers: number;
  totalGivers: number;
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  acceptedBookings: number;
  cancelledBookings: number;
}

export interface chatType {
  id: string;
  toUser: {
    id: string;
    name: string;
    avatar: string | null;
  };
  lastMessage: {
    message: string;
    createdAt: string;
  };
  unReadCount: number;
}

export interface chatMessageType {
  id: string;
  conversationId: string;
  isOtherUserMessage: boolean;
  message: string;
  createdAt: string;
  hasRead: boolean;
}

export interface otherUserDetailsType {
  id: string;
  name: string;
  avatar: string;
}
