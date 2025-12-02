import { useEffect, useState } from "react";
import { 
  FiSearch as SearchIcon, 
  FiEye as EyeIcon,
  FiTrash2 as TrashIcon,
  FiCheckCircle as CheckIcon,
  FiXCircle as XIcon,
  FiClock as ClockIcon,
  FiUserCheck as UserCheckIcon,
  FiUsers as UsersIcon,
  FiRefreshCw as RefreshIcon
} from "react-icons/fi";
import {
  PageLoadingSpinner,
} from "@/components/LoadingSpinner";
import { showError } from "@/lib/resuable-fns";
import useGeneral from "@/store/features/general";
import { Input } from "@/components/ui/input";
import { CustomButton } from "@/components/common/CustomInputs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteDialog } from "@/components/common/CustomDialog";
import {
  useAllApplications,
  useUpdateApplicationStatus,
  useDeleteApplication,
} from "@/store/data/cms/caregiverApplication/hook";

// Status options with colors
const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "reviewed", label: "Reviewed", color: "bg-blue-100 text-blue-800" },
  { value: "approved", label: "Approved", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
];

// Reviewed options
const REVIEWED_OPTIONS = [
  { value: "", label: "All" },
  { value: "false", label: "Not Reviewed" },
  { value: "true", label: "Reviewed" },
];

// Sort options


function CaregiverApplicationManagement() {
  const [filters, setFilters] = useState({
    status: "",
    is_reviewed: "",
    search: "",
    sort_by: "createdAt",
    order: "desc" as "asc" | "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const replacePageName = useGeneral((state) => state.replacePageName);

  // Build query params properly - INCLUDING SEARCH
  const queryParams = {
    ...(filters.status && { status: filters.status }),
    ...(filters.is_reviewed !== "" && { is_reviewed: filters.is_reviewed }),
    ...(filters.search && { search: filters.search }), // Add search parameter
    sort_by: filters.sort_by,
    order: filters.order,
    page: currentPage,
    limit: itemsPerPage,
  };

  const { data: applicationsData, isFetching: isFetchingApplications, error, refetch } = useAllApplications(queryParams);

//   const { data: statsData, isFetching: isFetchingStats } = useApplicationStats();
  const updateStatus = useUpdateApplicationStatus();
  const deleteApplication = useDeleteApplication();

  const applications = applicationsData?.data?.applications || [];
  const pagination = applicationsData?.data?.pagination;
//   const stats = statsData?.data?.stats;

  useEffect(() => {
    replacePageName("Caregiver Applications");
  }, []);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  // Track initial load completion
  useEffect(() => {
    if (applicationsData && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [applicationsData, isInitialLoad]);

  // Improved search with better debouncing and handling
  useEffect(() => {
    // Don't trigger search on initial load or when search is empty and we have data
    if (isInitialLoad) return;

    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      refetch();
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [filters.search, refetch, isInitialLoad]);

  // Handle filter changes (excluding search)
  useEffect(() => {
    if (isInitialLoad) return;

    // Trigger refetch when other filters change
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      refetch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters.status, filters.is_reviewed, filters.sort_by, filters.order, refetch, isInitialLoad]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Don't reset page immediately for search - let the useEffect handle it
    if (key !== "search") {
      setCurrentPage(1);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      status: "",
      is_reviewed: "",
      search: "",
      sort_by: "createdAt",
      order: "desc",
    });
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleStatusUpdate = (applicationId: string, newStatus: string) => {
    const statusData: any = { status: newStatus };
    
    // Automatically mark as reviewed when status changes from pending
    if (newStatus !== "pending") {
      statusData.isReviewed = true;
    }

    updateStatus.mutate({
      id: applicationId,
      statusData
    });
  };

  const handleDeleteApplication = (applicationId: string) => {
    setApplicationToDelete(applicationId);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (applicationToDelete) {
      deleteApplication.mutate(applicationToDelete, {
        onSuccess: () => {
          setOpenDeleteDialog(false);
          setApplicationToDelete(null);
        },
      });
    }
  };

  const handleViewDetails = (application: any) => {
    setSelectedApplication(application);
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedApplication(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="w-4 h-4" />;
      case "reviewed":
        return <EyeIcon className="w-4 h-4" />;
      case "approved":
        return <CheckIcon className="w-4 h-4" />;
      case "rejected":
        return <XIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    return STATUS_OPTIONS.find(opt => opt.value === status)?.color || "bg-gray-100 text-gray-800";
  };

  // Check if any filters are active
  const hasActiveFilters = filters.status !== "" || filters.is_reviewed !== "" || filters.search !== "";

  // Show loading spinner only on initial page load
  if (isInitialLoad && isFetchingApplications) {
    return <PageLoadingSpinner />;
  }

  // Application Detail View
  if (viewMode === "detail" && selectedApplication) {
    return (
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <CustomButton
              onClick={handleBackToList}
              className="flex items-center gap-2"
            >
              ← Back to List
            </CustomButton>
          </div>
          <div className="flex items-center gap-2">
    
          </div>
        </div>

        {/* Application Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-lg">{selectedApplication.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg">{selectedApplication.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                <p className="text-lg">{selectedApplication.phoneNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <p className="text-lg capitalize">{selectedApplication.gender}</p>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheckIcon className="w-5 h-5" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-lg whitespace-pre-wrap">{selectedApplication.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Zipcode</label>
                <p className="text-lg">{selectedApplication.zipcode}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Application Date</label>
                <p className="text-lg">{new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Personal Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white whitespace-pre-wrap">{selectedApplication.description}</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Update Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.filter(opt => opt.value !== "").map((status) => (
                <CustomButton
                  key={status.value}
                  onClick={() => handleStatusUpdate(selectedApplication.id, status.value)}
                  disabled={selectedApplication.status === status.value || updateStatus.isPending}
                  className={`flex items-center gap-2 ${
                    selectedApplication.status === status.value ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {getStatusIcon(status.value)}
                  Mark as {status.label}
                </CustomButton>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main List View
  return (
    <div className="space-y-6 p-6">
      {/* Header with Stats and Actions */}
      <div className="flex justify-end items-center">
        <div className="flex gap-2">
          <CustomButton
            onClick={handleRefresh}
            className="flex items-center gap-2"
            disabled={isFetchingApplications}
          >
            <RefreshIcon className={`w-4 h-4 ${isFetchingApplications ? 'animate-spin' : ''}`} />
            Refresh
          </CustomButton>
          {hasActiveFilters && (
            <CustomButton
              onClick={handleClearFilters}
              className="flex items-center gap-2"
            >
              Clear Filters
            </CustomButton>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-5">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
              {filters.search && (
                <p className="text-xs text-gray-500 mt-1">
                  Searching in: Name, Email, Phone
                </p>
              )}
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full bg-card p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reviewed Filter */}
            <div>
              <select
                value={filters.is_reviewed}
                onChange={(e) => handleFilterChange("is_reviewed", e.target.value)}
                className="w-full bg-card p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {REVIEWED_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            {/* <div>
              <select
                value={filters.sort_by}
                onChange={(e) => handleFilterChange("sort_by", e.target.value)}
                className="w-full bg-card p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Applications {pagination && `(${pagination.totalItems})`}
            </CardTitle>
            {/* {isFetchingApplications && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <LoadingSpinner />
                Loading...
              </div>
            )} */}
          </div>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <UsersIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Applications Found
              </h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters 
                  ? "No applications match your current filters. Try adjusting your search criteria." 
                  : "No caregiver applications have been submitted yet."}
              </p>
              {hasActiveFilters && (
                <CustomButton onClick={handleClearFilters}>
                  Clear All Filters
                </CustomButton>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold">{application.fullName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          {STATUS_OPTIONS.find(opt => opt.value === application.status)?.label}
                        </span>
                        {!application.isReviewed && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Needs Review
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white">
                        <div>
                          <strong>Email:</strong> {application.email}
                        </div>
                        <div>
                          <strong>Phone:</strong> {application.phoneNumber}
                        </div>
                        <div>
                          <strong>Applied:</strong> {new Date(application.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {/* <p className="text-sm text-white mt-2 line-clamp-2">
                        {application.description}
                      </p> */}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <CustomButton
                        onClick={() => handleViewDetails(application)}
                        className="flex items-center gap-2"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View
                      </CustomButton>
                      <CustomButton
                        onClick={() => handleDeleteApplication(application.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </CustomButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, parseInt(pagination.totalItems as any))} of {pagination.totalItems} applications
              </div>
              <div className="flex gap-2">
                <CustomButton
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </CustomButton>
                <span className="px-3 py-2 text-sm">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <CustomButton
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </CustomButton>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        openDialog={openDeleteDialog}
        handleOpenDialog={() => {
          setOpenDeleteDialog(false);
          setApplicationToDelete(null);
        }}
        title="Delete Application"
        description="Are you sure you want to delete this caregiver application? This action cannot be undone."
        Icon={TrashIcon}
        onCancel={() => {
          setOpenDeleteDialog(false);
          setApplicationToDelete(null);
        }}
        onConfirm={confirmDelete}
        isDeleting={deleteApplication.isPending}
      />
    </div>
  );
}

export default CaregiverApplicationManagement;