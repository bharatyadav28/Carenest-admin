import { useEffect, useMemo, useState,  } from "react";
import { SearchIcon, ArrowUpDown, Mail, CheckCircle, Users, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EditForm from "@/components/user-management/Editform";
import {
  useCareSeekers,
  useDeleteCareSeeker,
  // Add this import
} from "@/store/data/care-seeker/hook";

import {

  useSendBulkEmail,
  // Add this import
} from "@/store/data/care-giver/hook";
import {
  CustomInput,
  DeleteButton,
  UpdateButton,
  ViewButton,
  CustomSelectSeperate,
  AddButton,
} from "@/components/common/CustomInputs";
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
import { TableLoader } from "@/components/LoadingSpinner";
import { EmptyTable } from "@/components/common/EmptyTable";
import { DeleteDialog } from "@/components/common/CustomDialog";
import { showError } from "@/lib/resuable-fns";
import SeekerForm from "../../components/user-management/SeekerForm";
import { Tooltip } from "@/components/common/Tooltip";
import { Button } from "@/components/ui/button"; // Add Button import
import { Input } from "@/components/ui/input"; // Add Input import
import { Textarea } from "@/components/ui/textarea"; // Add Textarea import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Add Dialog imports

// Booking filter options
const bookingFilterMenu = [
  { key: "All", value: "AllUser" },
  { key: "Done Booking", value: "true" },
  { key: "No Booking", value: "false" },
];

// Status filter options
const statusFilterMenu = [
  { key: "All", value: "all" },
  { key: "Active", value: "active" },
  { key: "Inactive", value: "inactive" },
];

// Simple checkbox component
const SimpleCheckbox = ({ checked, onChange, disabled }: { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
  );
};

// Bulk Email Modal Component
const BulkEmailModal = ({ 
  open, 
  onClose, 
  selectedUsers,
  onSendEmail,
  isSending
}: { 
  open: boolean; 
  onClose: () => void; 
  selectedUsers: any[];
  onSendEmail: (subject: string, message: string) => void;
  isSending: boolean;
}) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setSubject("");
      setMessage("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (!subject.trim()) {
      alert("Please enter a subject");
      return;
    }
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }
    onSendEmail(subject, message);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            Send Email to {selectedUsers.length} Care Seeker{selectedUsers.length !== 1 ? 's' : ''}
          </DialogTitle>
          <DialogDescription>
            This email will be sent to all selected care seekers. You can preview the recipients below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Selected Users Preview */}
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Recipients ({selectedUsers.length}):
              </span>
              <span className="text-sm font-bold text-blue-600">
                {selectedUsers.length} selected
              </span>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {selectedUsers.map((user) => (
                <div 
                  key={user.id} 
                  className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded"
                >
                  <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                  <span className="truncate">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-gray-500 text-xs ml-2">({user.email})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Email Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
                className="w-full"
                disabled={isSending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your email message here..."
                rows={8}
                className="w-full"
                disabled={isSending}
              />
              <p className="text-xs text-gray-500 mt-1">
                {message.length}/5000 characters
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSending}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSending || !subject.trim() || !message.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSending ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function Careseeker() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasBooking, setHasBooking] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  
  // Bulk email states
  const [openBulkEmailModal, setOpenBulkEmailModal] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const [openEditForm, setOpenEditForm] = useState(false);
  const [openAddSeeker, setOpenAddSeeker] = useState(false);

  const filters = useMemo(
    () => ({
      page: currentPage,
      search: debouncedSearch,
      hasDoneBooking:
        hasBooking === "true" ? true : hasBooking === "false" ? false : undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
    }),
    [currentPage, debouncedSearch, hasBooking, statusFilter]
  );

  const { data, isFetching, error } = useCareSeekers(filters);
  const deleteCareSeeker = useDeleteCareSeeker();
  const sendBulkEmail = useSendBulkEmail(); // Add this hook
  const navigate = useNavigate();

  const handleOpenAddSeeker = () => setOpenAddSeeker((prev) => !prev);
  const handleOpenEditForm = (userId: string) => {
    setSelectedUserId(userId);
    setOpenEditForm(true);
  };
  const handleCloseEditForm = () => {
    setOpenEditForm(false);
    setSelectedUserId(null);
  };

  const handleDeleteDialog = () => setOpenDeleteDialog((prev) => !prev);

  const handleDeleteUser = () => {
    if (!selectedUserId) return;
    
    setDeletingUserId(selectedUserId);
    
    deleteCareSeeker.mutate(selectedUserId, {
      onSuccess: () => {
        setSelectedUserId(null);
        setDeletingUserId(null);
        handleDeleteDialog();
      },
      onError: () => {
        setDeletingUserId(null);
      },
    });
  };

  // Bulk email functions
  const handleSelectUser = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map((user: any) => user.id));
    }
  };

  const handleOpenBulkEmailModal = () => {
    if (selectedUserIds.length === 0) {
      alert("Please select at least one care seeker to send email");
      return;
    }
    setOpenBulkEmailModal(true);
  };

  const handleSendBulkEmail = (subject: string, message: string) => {
    sendBulkEmail.mutate({
      userIds: selectedUserIds,
      subject,
      message,
    }, {
      onSuccess: () => {
        // Clear selection after successful send
        setSelectedUserIds([]);
        // Close the modal
        setOpenBulkEmailModal(false);
      },
      onSettled: () => {
        // Optionally close modal on both success and error
        // setOpenBulkEmailModal(false);
      }
    });
  };

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // handle API errors
  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  const users = data?.data?.users || [];
  const totalPages = data?.data?.totalPages || 1;
  const noUsers = users.length === 0;

  // Modify the sortedUsers to include status filtering
  const sortedUsers = useMemo(() => {
    let filtered = [...users];
    if (statusFilter !== "all") {
      filtered = users.filter((user: { activeBookings: string }) => {
        const isActive = parseInt(user.activeBookings) > 0;
        return statusFilter === "active" ? isActive : !isActive;
      });
    }
    return filtered.sort((a, b) => {
      const nameA = a.name?.toLowerCase() || "";
      const nameB = b.name?.toLowerCase() || "";
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }, [users, sortOrder, statusFilter]);

  // toggle sorting on name column
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Get selected users data
  const selectedUsers = useMemo(() => {
    return users.filter((user:any) => selectedUserIds.includes(user.id));
  }, [users, selectedUserIds]);

  return (
    <div className="table-main-container">
      {/* Search & Filter Bar */}
      <div className="flex gap-2 flex-wrap items-center mb-4">
        <div className="w-[20rem] max-w-full flex items-center border border-gray-400 rounded-md ps-2">
          <SeekerForm open={openAddSeeker} handleOpen={handleOpenAddSeeker} />
          <SearchIcon size={18} />
          <CustomInput
            text={search}
            setText={setSearch}
            className="py-5 border-none focus-visible:ring-0"
            placeholder="Search Careseeker"
          />
        </div>

        {/* Status filter */}
        <CustomSelectSeperate
          menu={statusFilterMenu}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Filter by status"
          className="md:max-w-[15rem] w-full"
        />

        {/* Booking filter */}
        <CustomSelectSeperate
          menu={bookingFilterMenu}
          value={hasBooking}
          onChange={setHasBooking}
          placeholder="Filter by booking"
          className="md:max-w-[15rem] w-full"
        />

        {/* Add button */}
        <button
          onClick={handleOpenAddSeeker}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <AddButton className="text-white font-bold !border-0 !size-7" />
          <span className="text-md font-medium">Create New Careseeker</span>
        </button>

        {/* Bulk Email Button - Only show if users are selected */}
        {selectedUserIds.length > 0 && (
          <button
            onClick={handleOpenBulkEmailModal}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            <Mail className="h-5 w-5" />
            <span className="text-md font-medium">
              Send Email ({selectedUserIds.length})
            </span>
          </button>
        )}
      </div>

      {/* Selection Summary */}
      {selectedUserIds.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-300">
                {selectedUserIds.length} care seeker{selectedUserIds.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800 ml-4"
              >
                {selectedUserIds.length === users.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <button
              onClick={() => setSelectedUserIds([])}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <Table className="custom-table">
        <TableCaption>A list of care seekers</TableCaption>
        <TableHeader>
          <TableRow>
            {/* Checkbox column for selection */}
            <TableHead className="w-12">
              <div className="flex items-center justify-center">
                <SimpleCheckbox
                  checked={selectedUserIds.length === users.length && users.length > 0}
                  onChange={handleSelectAll}
                />
              </div>
            </TableHead>
            
            <TableHead
              onClick={toggleSortOrder}
              className="cursor-pointer select-none"
            >
              <div className="flex items-center gap-1">
                Name
                <ArrowUpDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    sortOrder === "asc" ? "rotate-180" : ""
                  }`}
                />
              </div>
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile no</TableHead>
            <TableHead>City</TableHead>
            <TableHead>ZipCode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isFetching && <TableLoader colSpan={8} />}
          {!isFetching && noUsers && <EmptyTable colSpan={8} text="No users found" />}
          {!isFetching &&
            !noUsers &&
            sortedUsers.map((user: any) => (
              <TableRow 
                key={user.id}
                className={selectedUserIds.includes(user.id) ? "bg-blue-50 dark:bg-blue-900/20" : ""}
              >
                {/* Checkbox cell */}
                <TableCell>
                  <div className="flex items-center justify-center">
                    <SimpleCheckbox
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </div>
                </TableCell>
                
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobile}</TableCell>
                <TableCell>{user.city || "N/A"}</TableCell>
                <TableCell>{user.zipcode || "N/A"}</TableCell>
                <TableCell>
                  <span
                    className={`${
                      parseInt(user.activeBookings) > 0
                        ? "text-green-600"
                        : "text-red-600"
                    } font-medium`}
                  >
                    {parseInt(user.activeBookings) > 0 ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Tooltip text="View">
                      <ViewButton onClick={() => navigate(`/care-seeker/${user.id}`)} />
                    </Tooltip>
                    <Tooltip text="Edit">
                      <UpdateButton onClick={() => handleOpenEditForm(user.id)} />
                    </Tooltip>
                    <Tooltip text="Delete">
                      <DeleteButton
                        onClick={() => {
                          handleDeleteDialog();
                          setSelectedUserId(user.id);
                        }}
                        isDeleting={deletingUserId === user.id && deleteCareSeeker.isPending}
                      />
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* Delete Dialog */}
      <DeleteDialog
        openDialog={openDeleteDialog}
        handleOpenDialog={handleDeleteDialog}
        title="Delete User"
        description="Are you sure you want to delete this user?"
        onCancel={() => {
          handleDeleteDialog();
          setSelectedUserId(null);
        }}
        onConfirm={handleDeleteUser}
        isDeleting={deleteCareSeeker.isPending && deletingUserId === selectedUserId}
      />

      {/* Bulk Email Modal */}
      <BulkEmailModal
        open={openBulkEmailModal}
        onClose={() => setOpenBulkEmailModal(false)}
        selectedUsers={selectedUsers}
        onSendEmail={handleSendBulkEmail}
        isSending={sendBulkEmail.isPending}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}

      {/* Edit Form */}
      {selectedUserId && (
        <EditForm
          open={openEditForm}
          handleOpen={handleCloseEditForm}
          userId={selectedUserId}
          role="seeker"
        />
      )}
    </div>
  );
}

export default Careseeker;