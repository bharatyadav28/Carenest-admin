import { useEffect, useMemo, useState, useRef } from "react";
import { SearchIcon, ArrowUpDown, Check, X, Mail, CheckCircle, Users, Send, Upload, FileSpreadsheet } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  useCareGivers,
  useDeleteCareGiver,
  useSendBulkEmail,
  useBulkUploadUsers, // Add this import
} from "@/store/data/care-giver/hook";
import {
  CustomInput,
  DeleteButton,
  UpdateButton,
  ViewButton,
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
import GiverForm from "../../components/user-management/GiverForm";
import EditFormgiver from "@/components/user-management/Editformgiver";
import { Tooltip } from "@/components/common/Tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// const statusFilterMenu = [
//   { key: "All", value: "all" },
//   { key: "Active", value: "active" },
//   { key: "Inactive", value: "inactive" },
// ];

// Simple checkbox component if you don't have one
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

// Simple modal for bulk email
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
            Send Email to {selectedUsers.length} Caregiver{selectedUsers.length !== 1 ? 's' : ''}
          </DialogTitle>
          <DialogDescription>
            This email will be sent to all selected caregivers. You can preview the recipients below.
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

// Bulk Upload Modal Component
const BulkUploadModal = ({ 
  open, 
  onClose, 
  onUpload,
  isUploading
}: { 
  open: boolean; 
  onClose: () => void; 
  onUpload: (file: File) => void;
  isUploading: boolean;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File | null) => {
    if (file) {
      // Check file type
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a valid Excel file (.xls, .xlsx) or CSV file");
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }
    onUpload(selectedFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  // Reset file input when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-600" />
            Bulk Upload Caregivers
          </DialogTitle>
          <DialogDescription>
            Upload an Excel file (.xls, .xlsx) or CSV file to create multiple caregivers at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragActive 
                ? "border-green-500 bg-green-50" 
                : "border-gray-300 hover:border-green-400 hover:bg-gray-50"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              disabled={isUploading}
            />
            
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
              </div>
              
              <div>
                <p className="font-medium text-gray-700">
                  {selectedFile ? selectedFile.name : "Drag & drop your file here"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedFile 
                    ? `Size: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` 
                    : "or click to browse"}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supported formats: .xls
                </p>
              </div>
              
              {!selectedFile && (
                <Button variant="outline" size="sm" className="mt-2">
                  Select File
                </Button>
              )}
            </div>
          </div>

          {/* File Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              File Requirements
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Required columns: <strong>name, email, role</strong></li>
              <li>• Optional columns: mobile, address, city, zipcode, gender</li>
              <li>• Role must be either "user" or "giver"</li>
              <li>• Email must be unique and valid format</li>
              <li>• First row should contain column headers</li>
            </ul>
          </div>

 
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={isUploading || !selectedFile}
            className="bg-green-600 hover:bg-green-700"
          >
            {isUploading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload & Create Users
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function Caregiver() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openAddGiver, setOpenAddGiver] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null); 
  
  // Bulk email states
  const [openBulkEmailModal, setOpenBulkEmailModal] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Bulk upload states
  const [openBulkUploadModal, setOpenBulkUploadModal] = useState(false);

  // Sorting state
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedGender, setSelectedGender] = useState<"all" | "male" | "female" | "other">("all");
  // const [statusFilter, setStatusFilter] = useState("all");

  const filters = useMemo(
    () => ({
      page: currentPage,
      search: debouncedSearch,
    
    }),
    [currentPage, debouncedSearch]
  );

  const { data, isFetching, error } = useCareGivers(filters);
  const deleteCareGiver = useDeleteCareGiver();
  const sendBulkEmail = useSendBulkEmail();
  const bulkUploadUsers = useBulkUploadUsers(); // Add this hook
  const navigate = useNavigate();

  // Open/close edit form
  const handleOpenEditForm = (userId: string) => {
    setSelectedUserId(userId);
    setOpenEditForm(true);
  };
  
  const handleCloseEditForm = () => {
    setOpenEditForm(false);
    setSelectedUserId(null);
  };

  // Toggle delete dialog
  const handleDeleteDialog = () => {
    setOpenDeleteDialog((prev) => !prev);
  };

  const handleDeleteUser = () => {
    if (!selectedUserId) return;

    setDeletingUserId(selectedUserId);
    
    deleteCareGiver.mutate(selectedUserId, {
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

  const handleOpenAddGiver = () => setOpenAddGiver((prev) => !prev);

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
      setSelectedUserIds(users.map((user:any) => user.id));
    }
  };

  const handleOpenBulkEmailModal = () => {
    if (selectedUserIds.length === 0) {
      alert("Please select at least one caregiver to send email");
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

  // Bulk upload functions
  const handleOpenBulkUploadModal = () => {
    setOpenBulkUploadModal(true);
  };

  const handleBulkUpload = (file: File) => {
    bulkUploadUsers.mutate(file, {
      onSuccess: () => {
        setOpenBulkUploadModal(false);
      }
    });
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle API errors
  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  const users = data?.data?.users || [];
  const totalPages = data?.data?.totalPages || 1;
  const noUsers = users.length === 0;

  // Get selected users data
  const selectedUsers = useMemo(() => {
    return users.filter((user:any) => selectedUserIds.includes(user.id));
  }, [users, selectedUserIds]);

  // Sort users alphabetically
  const sortedUsers = useMemo(() => {
    let filtered = [...users];

    // Apply gender filter
    if (selectedGender !== "all") {
      filtered = filtered.filter(
        (u) => (u.gender?.toLowerCase() || "other") === selectedGender.toLowerCase()
      );
    }

    // // Apply status filter
    // if (statusFilter !== "all") {
    //   filtered = filtered.filter((user) => {
    //     const isActive = user.totalBookingsAllocated > 0;
    //     return statusFilter === "active" ? isActive : !isActive;
    //   });
    // }

    // Sort by name
    return filtered.sort((a, b) => {
      const nameA = a.name?.toLowerCase() || "";
      const nameB = b.name?.toLowerCase() || "";
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }, [users, sortOrder, selectedGender]);

  // Toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="table-main-container">
      {/* Search & Filter & Actions */}
      <div className="flex gap-2 flex-wrap items-center mb-4">
        <GiverForm open={openAddGiver} handleOpen={handleOpenAddGiver} />

        <div className="w-[20rem] max-w-full flex items-center border border-gray-400 rounded-md ps-2">
          <SearchIcon size={18} />
          <CustomInput
            text={search}
            setText={setSearch}
            className="py-5 border-none focus-visible:ring-0 "
            placeholder="Search Care Giver"
          />
        </div>

        {/* Add Caregiver Button */}
        <button
          onClick={handleOpenAddGiver}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <AddButton className="text-white font-bold !border-0 !size-7" />
          <span className="text-md font-medium">Create New Caregiver</span>
        </button>

        {/* Bulk Upload Button */}
        <button
          onClick={handleOpenBulkUploadModal}
          className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <Upload className="h-5 w-5" />
          <span className="text-md font-medium">Bulk Upload</span>
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

        {/* Status filter */}
        {/* <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-100 rounded p-2 text-sm bg-[#252525] text-white"
        >
          {statusFilterMenu.map((item) => (
            <option key={item.key} value={item.value}>
              {item.key}
            </option>
          ))}
        </select> */}
      </div>

      {/* Selection Summary */}
      {selectedUserIds.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-300">
                {selectedUserIds.length} caregiver{selectedUserIds.length !== 1 ? 's' : ''} selected
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
        <TableCaption>A list of caregivers</TableCaption>
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
              className="cursor-pointer select-none"
              onClick={toggleSortOrder}
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
            {/* Gender with dropdown filter */}
            <TableHead>
              <div className="flex items-center justify-between gap-4 ">
                Gender
                <select
                  value={selectedGender}
                  onChange={(e) =>
                    setSelectedGender(e.target.value as "all" | "male" | "female" | "other")
                  }
                  className="border border-gray-100 rounded p-1 text-xs font-bold bg-[#252525] text-white"
                >
                  <option value="all">All</option>  
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </TableHead>
            <TableHead>ZipCode</TableHead>
            <TableHead>Subscription</TableHead>
            {/* <TableHead>
              <div className="flex items-center justify-between gap-4">
                Status
              </div>
            </TableHead> */}
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isFetching && <TableLoader colSpan={10} />} 
          {!isFetching && noUsers && (
            <EmptyTable colSpan={10} text="No caregivers found" /> 
          )}
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
                <TableCell>{user.gender || "N/A"}</TableCell>
                <TableCell>{user.zipcode || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {user.hasSubscription ? (
                      <>
                        <Check size={16} className="text-green-500" />
                        <span className="text-green-500 font-medium">Active</span>
                      </>
                    ) : (
                      <>
                        <X size={16} className="text-red-500" />
                        <span className="text-red-500 font-medium">Inactive</span>
                      </>
                    )}
                  </div>
                </TableCell>
                {/* <TableCell>
                  <span
                    className={`${
                      user.totalBookingsAllocated > 0
                        ? "text-green-600"
                        : "text-red-600"
                    } font-medium`}
                  >
                    {user.totalBookingsAllocated > 0 ? "Active" : "Inactive"}
                  </span>
                </TableCell> */}
                <TableCell>
                  <div className="flex gap-2">
                    <Tooltip text="View">
                      <ViewButton
                        onClick={() => navigate(`/care-giver/${user.id}`)}
                      />
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
                        isDeleting={deletingUserId === user.id && deleteCareGiver.isPending}
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
        title="Delete Caregiver"
        description="Are you sure you want to delete this caregiver?"
        onCancel={() => {
          handleDeleteDialog();
          setSelectedUserId(null);
        }}
        onConfirm={handleDeleteUser}
        isDeleting={deleteCareGiver.isPending && deletingUserId === selectedUserId}
      />

      {/* Bulk Email Modal */}
      <BulkEmailModal
        open={openBulkEmailModal}
        onClose={() => setOpenBulkEmailModal(false)}
        selectedUsers={selectedUsers}
        onSendEmail={handleSendBulkEmail}
        isSending={sendBulkEmail.isPending}
      />

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        open={openBulkUploadModal}
        onClose={() => setOpenBulkUploadModal(false)}
        onUpload={handleBulkUpload}
        isUploading={bulkUploadUsers.isPending}
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
        <EditFormgiver
          open={openEditForm}
          handleOpen={handleCloseEditForm}
          userId={selectedUserId}
          role="giver"
        />
      )}
    </div>
  );
}

export default Caregiver;