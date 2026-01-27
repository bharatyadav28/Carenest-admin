
import axiosInstance from "@/store/axiosInstance";

// ============== PLAN API ==============
// Get current plan
export const fetchCurrentPlan = async () => {
  const { data } = await axiosInstance.get("/api/v1/plans");
  return data;
};

// Get price history
export const fetchPriceHistory = async () => {
  const { data } = await axiosInstance.get("/api/v1/plans/history");
  return data;
};


export interface UpdatePlanPriceType {
  newAmount: number; // in cents (e.g., 1500 = $15.00)
}

export const updatePlanPrice = async (payload: UpdatePlanPriceType) => {
  const { data } = await axiosInstance.patch("/api/v1/plans/update-price", payload);
  return data;
};

// Create initial plan (one-time setup)
export const createInitialPlan = async () => {
  const { data } = await axiosInstance.post("/api/v1/plans/create-monthly");
  return data;
};

// ============== SUBSCRIPTION API ==============
// Get all subscriptions (admin only)
export const fetchAllSubscriptions = async () => {
  const { data } = await axiosInstance.get("/api/v1/subscriptions/all");
  return data;
};

// Types remain the same...

// Types
export interface PlanType {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  displayAmount: string;
  interval: string;
  stripeProductId: string | null;
  stripePriceId: string | null;
  isActive: boolean;
  isLatest: boolean;
  previousPlanId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionType {
  id: string;
  userId: string;
  planId: string;
  stripeSubscriptionId: string;
  status: "active" | "canceled" | "past_due" | "incomplete";
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  plan: {
    id: string;
    name: string;
    amount: number;
    displayAmount: string;
    interval: string;
  } | null;
}

export interface PriceHistoryType {
  id: string;
  name: string;
  amount: number;
  displayAmount: string;
  interval: string;
  stripePriceId: string | null;
  isActive: boolean;
  isLatest: boolean;
  isCurrent: boolean;
  previousPlanId: string | null;
  createdAt: string;
  updatedAt: string;
}