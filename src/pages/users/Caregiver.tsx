import { useEffect, useMemo, useState } from "react";
import { SearchIcon, ArrowUpDown, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  useCareGivers,
  useDeleteCareGiver,
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

const statusFilterMenu = [
  { key: "All", value: "all" },
  { key: "Active", value: "active" },
  { key: "Inactive", value: "inactive" },
];

function Caregiver() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openAddGiver, setOpenAddGiver] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null); 

  // Sorting state
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Gender filter state
  const [selectedGender, setSelectedGender] = useState<"all" | "male" | "female" | "other">("all");

  // Status filter state
  const [statusFilter, setStatusFilter] = useState("all");

  const filters = useMemo(
    () => ({
      page: currentPage,
      search: debouncedSearch,
      status: statusFilter === "all" ? undefined : statusFilter,
    }),
    [currentPage, debouncedSearch, statusFilter]
  );

  const { data, isFetching, error } = useCareGivers(filters);
  const deleteCareGiver = useDeleteCareGiver();
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

    // Set the deleting user ID before mutation
    setDeletingUserId(selectedUserId);
    
    deleteCareGiver.mutate(selectedUserId, {
      onSuccess: () => {
        setSelectedUserId(null);
        setDeletingUserId(null); // Clear deleting state
        handleDeleteDialog();
      },
      onError: () => {
        setDeletingUserId(null); // Clear deleting state on error too
      },
      onSettled: () => {
        // Alternative: Clear deleting state when mutation completes (success or error)
        // setDeletingUserId(null);
      }
    });
  };

  const handleOpenAddGiver = () => setOpenAddGiver((prev) => !prev);

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

  // Sort users alphabetically
  const sortedUsers = useMemo(() => {
    let filtered = [...users];

    // Apply gender filter
    if (selectedGender !== "all") {
      filtered = filtered.filter(
        (u) => (u.gender?.toLowerCase() || "other") === selectedGender.toLowerCase()
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => {
        const isActive = user.totalBookingsAllocated > 0;
        return statusFilter === "active" ? isActive : !isActive;
      });
    }

    // Sort by name
    return filtered.sort((a, b) => {
      const nameA = a.name?.toLowerCase() || "";
      const nameB = b.name?.toLowerCase() || "";
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }, [users, sortOrder, selectedGender, statusFilter]);

  // Toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="table-main-container">
      {/* Search & Filter */}
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

        <button
          onClick={handleOpenAddGiver}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <AddButton className="text-white font-bold !border-0 !size-7" />
          <span className="text-md font-medium">Create New Caregiver</span>
        </button>

        {/* Add status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-100 rounded p-2 text-sm bg-[#252525]"
        >
          {statusFilterMenu.map((item) => (
            <option key={item.key} value={item.value}>
              {item.key}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Table className="custom-table">
        <TableCaption>A list of caregivers</TableCaption>
        <TableHeader>
          <TableRow>
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

            {/* Gender with dropdown filter */}
            <TableHead>
              <div className="flex items-center justify-between gap-4 ">
                Gender
                <select
                  value={selectedGender}
                  onChange={(e) =>
                    setSelectedGender(e.target.value as "all" | "male" | "female" | "other")
                  }
                  className="border border-gray-100  rounded p-1  text-xs font-bold  bg-[#252525]"
                >
                  <option value="all">All</option>  
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </TableHead>
            <TableHead>ZipCode</TableHead>
            {/* ADDED: Subscription Column */}
            <TableHead>Subscription</TableHead>
            {/* Status with dropdown filter */}
            <TableHead>
              <div className="flex items-center justify-between gap-4 ">
                Status
              </div>
            </TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isFetching && <TableLoader colSpan={8} />} 
          {!isFetching && noUsers && (
            <EmptyTable colSpan={8} text="No givers found" /> 
          )}
          {!isFetching &&
            !noUsers &&
            sortedUsers.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobile}</TableCell>
                <TableCell>{user.gender || "N/A"}</TableCell>
                <TableCell>{user.zipcode || "N/A"}</TableCell>
                {/* ADDED: Subscription cell */}
                <TableCell>
                  <div className="flex items-center gap-1">
                    {user.hasSubscription ? (
                      <>
                        <Check size={16} className="text-green-500" />
                        <span className="text-green-500 font-medium">Subscribed</span>
                      </>
                    ) : (
                      <>
                        <X size={16} className="text-red-500" />
                        <span className="text-red-500 font-medium">Not Subscribed</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`${
                      user.totalBookingsAllocated > 0
                        ? "text-green-600"
                        : "text-red-600"
                    } font-medium`}
                  >
                    {user.totalBookingsAllocated > 0 ? "Active" : "Inactive"}
                  </span>
                </TableCell>
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