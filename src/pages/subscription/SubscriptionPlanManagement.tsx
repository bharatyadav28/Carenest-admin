// @/features/subscription/pages/SubscriptionPlanManagement.tsx
import { useEffect, useState } from "react";
import { 
  FiDollarSign as DollarIcon,
  FiRefreshCw as RefreshIcon,
  FiCheckCircle as CheckIcon,
  FiAlertCircle as AlertIcon,
  FiCalendar as CalendarIcon,
  FiUsers as UsersIcon
} from "react-icons/fi";
import { 
  PageLoadingSpinner,
  LoadingSpinner
} from "@/components/LoadingSpinner";
import useGeneral from "@/store/features/general";
import { Input } from "@/components/ui/input";
import { CustomButton, CustomInput } from "@/components/common/CustomInputs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  usePlanExists,
  useCreateInitialPlan,
  useUpdatePlanPrice,
  useAllSubscriptions,
  usePriceHistory
} from "../../store/data/subscription/hook";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CustomPagination from "@/components/common/CustomPagination";
import { SearchIcon } from "lucide-react";

function SubscriptionPlanManagement() {
  const [activeTab, setActiveTab] = useState<string>("plan");
  const [customPrice, setCustomPrice] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { exists: planExists, plan, isLoading: planLoading } = usePlanExists();
  const { data: subscriptionsData, isLoading: subsLoading, refetch: refetchSubscriptions } = useAllSubscriptions();
  const { data: priceHistory, isLoading: historyLoading, refetch: refetchHistory } = usePriceHistory();
  
  const createPlanMutation = useCreateInitialPlan();
  const updatePriceMutation = useUpdatePlanPrice();

  const replacePageName = useGeneral((state) => state.replacePageName);

  const subscriptions = subscriptionsData?.data?.subscriptions || [];
  const priceHistoryList = priceHistory?.data?.priceHistory || [];

  // Format price display
  const formatPrice = (amountInCents: number) => {
    return `$${(amountInCents / 100).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge color
  const getStatusColor = (status: string, cancelAtPeriodEnd: boolean) => {
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

  // Get status text
  const getStatusText = (status: string, cancelAtPeriodEnd: boolean) => {
    if (status === "active" && cancelAtPeriodEnd) {
      return "Active (Will Cancel)";
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Handle search debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    replacePageName("Subscription Management");
  }, []);

  const handleCreatePlan = () => {
    if (window.confirm("Create a $10 monthly subscription plan? This is a one-time setup action.")) {
      createPlanMutation.mutate();
    }
  };

  const handleUpdatePrice = (newAmount: number) => {
    const priceInDollars = newAmount / 100;
    if (window.confirm(`Are you sure you want to update the price to $${priceInDollars.toFixed(2)}? This will notify all existing customers.`)) {
      updatePriceMutation.mutate(newAmount, {
        onSuccess: () => {
          refetchSubscriptions();
          refetchHistory();
          setCustomPrice("");
        }
      });
    }
  };

  const handleCustomPriceSubmit = () => {
    const priceInDollars = parseFloat(customPrice);
    if (isNaN(priceInDollars) || priceInDollars <= 0) {
      alert("Please enter a valid price greater than 0");
      return;
    }
    
    handleUpdatePrice(Math.round(priceInDollars * 100));
  };

  const handleRefresh = () => {
    refetchSubscriptions();
    refetchHistory();
  };

  // Calculate subscription statistics
  const totalSubscriptions = subscriptions.length;
const activeSubscriptions: number = subscriptions.filter((sub: any) => 
    sub.status === "active" && !sub.cancelAtPeriodEnd
).length;
  const willCancelSubscriptions = subscriptions.filter((sub: any) => 
    sub.status === "active" && sub.cancelAtPeriodEnd
  ).length;
 

  // Paginate subscriptions
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubscriptions = subscriptions.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(subscriptions.length / itemsPerPage);

  if (planLoading) return <PageLoadingSpinner />;

  return (
    <div className="space-y-6 p-6 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Subscription Management</h1>
          <p className="text-gray-500">Manage subscription plans and view all subscriptions</p>
        </div>
        <div className="flex items-center gap-4">
          <CustomButton
            onClick={handleRefresh}
            className="flex items-center gap-2"
            disabled={subsLoading || historyLoading}
          >
            <RefreshIcon className={`w-4 h-4 ${subsLoading || historyLoading ? 'animate-spin' : ''}`} />
            Refresh
          </CustomButton>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        <button
          onClick={() => setActiveTab("plan")}
          className={`px-6 py-3 rounded-lg text-lg font-medium transition-colors ${
            activeTab === "plan"
              ? 'bg-green-700 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          Plan Management
        </button>
        <button
          onClick={() => setActiveTab("subscriptions")}
          className={`px-6 py-3 rounded-lg text-lg font-medium transition-colors ${
            activeTab === "subscriptions"
              ? 'bg-green-700 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          All Subscriptions ({subscriptions.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-3 rounded-lg text-lg font-medium transition-colors ${
            activeTab === "history"
              ? 'bg-green-700 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          Price History
        </button>
      </div>

      {/* Plan Management Tab */}
      {activeTab === "plan" && (
        <>
          {/* No Plan Found */}
          {!planExists ? (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <DollarIcon className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
                  <h3 className="text-xl font-semibold text-yellow-900 mb-2">
                    No Subscription Plan Found
                  </h3>
                  <p className="text-yellow-700 mb-6">
                    You need to create a subscription plan before users can subscribe.
                  </p>
                  <CustomButton
                    onClick={handleCreatePlan}
                    disabled={createPlanMutation.isPending}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2 mx-auto"
                  >
                    {createPlanMutation.isPending ? <LoadingSpinner /> : "Create $10 Monthly Plan"}
                  </CustomButton>
                </div>
              </CardContent>
            </Card>
          ) : plan && (
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Plan Details */}
                  <div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Plan Name</label>
                        <p className="text-xl font-semibold">{plan.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Description</label>
                        <p className="text-white">{plan.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Current Price</label>
                          <p className="text-3xl font-bold">{plan.displayAmount}</p>
                          <p className="text-sm text-gray-500">per {plan.interval}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Status</label>
                          <div className="mt-1">
                            <Badge className="bg-green-100 text-green-800">
                              {plan.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {plan.isLatest && (
                              <Badge className="ml-2 bg-blue-100 text-blue-800">
                                Latest Price
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Update Price Section */}
                  <div className="border-l pl-6">
                    <h3 className="text-lg font-semibold mb-4">Update Price</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="relative">
                          <DollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="Enter custom monthly price"
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleCustomPriceSubmit();
                              }
                            }}
                            className="pl-10"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Current price: {plan.displayAmount}
                        </p>
                      </div>
                      <CustomButton
                        onClick={handleCustomPriceSubmit}
                        disabled={updatePriceMutation.isPending || !customPrice}
                        className="flex items-center gap-2"
                      >
                        {updatePriceMutation.isPending ? <LoadingSpinner /> : "Update Price"}
                      </CustomButton>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statistics Cards */}
          {planExists && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Subscribers</p>
                      <p className="text-3xl font-bold">{totalSubscriptions}</p>
                    </div>
                    <UsersIcon className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Subscriptions</p>
                      <p className="text-3xl font-bold text-green-600">{activeSubscriptions}</p>
                    </div>
                    <CheckIcon className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Will Cancel</p>
                      <p className="text-3xl font-bold text-yellow-600">{willCancelSubscriptions}</p>
                    </div>
                    <AlertIcon className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

     
            </div>
          )}
        </>
      )}

      {/* All Subscriptions Tab */}
      {activeTab === "subscriptions" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>All Subscriptions ({subscriptions.length})</CardTitle>
              {subsLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <LoadingSpinner />
                  Loading...
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="mb-4">
              <div className="w-full max-w-md flex items-center border border-gray-400 rounded-md ps-2">
                <SearchIcon size={18} />
                <CustomInput
                  text={search}
                  setText={setSearch}
                  className="py-5 border-none focus-visible:ring-0"
                  placeholder="Search by name, email, or price"
                />
              </div>
            </div>

            {subscriptions.length === 0 ? (
              <div className="text-center py-8">
                <UsersIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Subscriptions Found
                </h3>
                <p className="text-gray-600">
                  No users have subscribed to any plans yet.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-lg border">
                  <Table>
                    <TableCaption>A list of all subscriptions</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Auto Renew</TableHead>
                        <TableHead>Renewal Date</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedSubscriptions.map((subscription: any) => (
                        <TableRow key={subscription.id}>
                          <TableCell className="font-medium">
                            {subscription.user?.name || "N/A"}
                          </TableCell>
                          <TableCell>{subscription.user?.email || "N/A"}</TableCell>
                          <TableCell>
                            {subscription.plan ? (
                              <div className="flex items-center gap-1">
                                <DollarIcon className="w-4 h-4 text-gray-500" />
                                {formatPrice(subscription.plan.amount)}
                              </div>
                            ) : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(subscription.status, subscription.cancelAtPeriodEnd)}>
                              {getStatusText(subscription.status, subscription.cancelAtPeriodEnd)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {subscription.cancelAtPeriodEnd ? (
                                <>
                                  <AlertIcon className="w-4 h-4 text-red-500" />
                                  <span className="text-red-600 font-medium">No</span>
                                </>
                              ) : (
                                <>
                                  <CheckIcon className="w-4 h-4 text-green-500" />
                                  <span className="text-green-600 font-medium">Yes</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4 text-gray-400" />
                              {formatDate(subscription.currentPeriodEnd)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatDate(subscription.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="p-4 border-t">
                      <CustomPagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Price History Tab */}
      {activeTab === "history" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Price History</CardTitle>
              {historyLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <LoadingSpinner />
                  Loading...
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {priceHistoryList.length === 0 ? (
              <div className="text-center py-8">
                <DollarIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Price History
                </h3>
                <p className="text-gray-600">
                  No price changes have been made yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {priceHistoryList.map((history: any) => (
                  <div key={history.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        history.isCurrent ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <div>
                        <div className="font-medium">{history.displayAmount}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(history.createdAt)}
                        </div>
                      </div>
                    </div>
                    {history.isCurrent && (
                      <Badge className="bg-green-100 text-green-800">
                        Current
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SubscriptionPlanManagement;