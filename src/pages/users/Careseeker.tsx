import { useEffect, useMemo, useState } from "react";
import { SearchIcon, ArrowUpDown } from "lucide-react"; // ⬅ added icon
import { useNavigate } from "react-router-dom";
import EditForm from "@/components/user-management/Editform";
import {
  useCareSeekers,
  useDeleteCareSeeker,
} from "@/store/data/care-seeker/hook";
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

function Careseeker() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasBooking, setHasBooking] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // 🔽 sorting state

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
  const navigate = useNavigate();

  const [openEditForm, setOpenEditForm] = useState(false);
  const [openAddSeeker, setOpenAddSeeker] = useState(false);

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
    deleteCareSeeker.mutate(selectedUserId, {
      onSuccess: () => {
        setSelectedUserId(null);
        handleDeleteDialog();
      },
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
      filtered = users.filter((user) => {
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
      </div>

      {/* Table */}
      <Table className="custom-table">
        <TableCaption>A list of care seekers</TableCaption>
        <TableHeader>
          <TableRow>
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
            <TableHead>ZipCode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isFetching && <TableLoader colSpan={6} />}
          {!isFetching && noUsers && <EmptyTable colSpan={6} text="No users found" />}
          {!isFetching &&
            !noUsers &&
            sortedUsers.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobile}</TableCell>
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
                    <ViewButton onClick={() => navigate(`/care-seeker/${user.id}`)} />
                    <UpdateButton onClick={() => handleOpenEditForm(user.id)} />
                    <DeleteButton
                      onClick={() => {
                        handleDeleteDialog();
                        setSelectedUserId(user.id);
                      }}
                      isDeleting={deleteCareSeeker.isPending}
                    />
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
        isDeleting={deleteCareSeeker.isPending}
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
          role="giver"
        />
      )}
    </div>
  );
}

export default Careseeker;
