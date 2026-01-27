// subscription/hooks.ts - UPDATED
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchCurrentPlan,
  fetchPriceHistory,
  updatePlanPrice,
  createInitialPlan,
  fetchAllSubscriptions,
  PlanType,

} from "./api";
  import { showError } from "@/lib/resuable-fns";


// ============== PLAN HOOKS ==============

// Fetch current plan
export const useCurrentPlan = () => {
  return useQuery({
    queryKey: ["currentPlan"],
    queryFn: () => fetchCurrentPlan(),
  });
};

// Fetch price history
export const usePriceHistory = () => {
  return useQuery({
    queryKey: ["priceHistory"],
    queryFn: () => fetchPriceHistory(),
  });
};

// Update plan price - FIXED: No planId needed
export const useUpdatePlanPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newAmount: number) => updatePlanPrice({ newAmount }),
    onSuccess: (data, newAmount) => {
      const formattedPrice = `$${(newAmount / 100).toFixed(2)}`;
      toast.success(data?.message || `Price updated to ${formattedPrice}!`);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["currentPlan"] });
      queryClient.invalidateQueries({ queryKey: ["priceHistory"] });
      queryClient.invalidateQueries({ queryKey: ["allSubscriptions"] });
      
      // Show detailed success message
      if (data?.data?.totalCustomersNotified > 0) {
        toast.info(`Notified ${data.data.totalCustomersNotified} customers about price change`, {
          duration: 5000,
        });
      }
    },
    onError: (error) => showError(error),
  });
};

// Create initial plan (setup)
export const useCreateInitialPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createInitialPlan(),
    onSuccess: (data) => {
      toast.success(data?.message || "Plan created successfully!");
      queryClient.invalidateQueries({ queryKey: ["currentPlan"] });
    },
    onError: (error) => showError(error),
  });
};

// ============== SUBSCRIPTION HOOKS ==============

// Fetch all subscriptions (admin)
export const useAllSubscriptions = () => {
  return useQuery({
    queryKey: ["allSubscriptions"],
    queryFn: () => fetchAllSubscriptions(),
  });
};

// ============== UTILITY HOOKS ==============

// Check if plan exists
export const usePlanExists = () => {
  const { data, isLoading, error } = useCurrentPlan();
  
  return {
    exists: !isLoading && data?.data?.plans?.length > 0,
    isLoading,
    error,
    plan: data?.data?.plans?.[0] as PlanType | undefined,
  };
};

// Format price for display
export const useFormatPrice = () => {
  return (amountInCents: number) => `$${(amountInCents / 100).toFixed(2)}`;
};

// Get subscription status badge color
export const useSubscriptionStatusColor = () => {
  return (status: string, cancelAtPeriodEnd: boolean) => {
    if (status === "active" && cancelAtPeriodEnd) {
      return "bg-yellow-100 text-yellow-800";
    }
    
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "past_due":
        return "bg-orange-100 text-orange-800";
      case "incomplete":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
};

// Get subscription status text
export const useSubscriptionStatusText = () => {
  return (status: string, cancelAtPeriodEnd: boolean) => {
    if (status === "active" && cancelAtPeriodEnd) {
      return "Active (Will Cancel)";
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
};

// Calculate days until renewal/cancellation
export const useDaysUntil = () => {
  return (dateString: string) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
};

// Get formatted date
export const useFormattedDate = () => {
  return (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
};