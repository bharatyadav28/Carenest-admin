import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
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
import { AddButton } from "../../components/common/CustomInputs";
import EditForm from "@/components/user-management/Editform";

function Caregiver() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [openEditForm, setOpenEditForm] = useState(false);

  const handleOpenEditForm = (userId: string) => {
    setSelectedUserId(userId);
    setOpenEditForm(true);
  };

  const handleCloseEditForm = () => {
    setOpenEditForm(false);
    setSelectedUserId(null);
  };
  const filters = useMemo(
    () => ({
      page: currentPage,
      search: debouncedSearch,
    }),
    [currentPage, debouncedSearch]
  );

  const { data, isFetching, error } = useCareGivers(filters);
  const deleteCareGiver = useDeleteCareGiver();
  const navigate = useNavigate();

  const handleDeleteDialog = () => {
    setOpenDeleteDialog((prev) => !prev);
  };

  const handleDeleteUser = () => {
    if (!selectedUserId) return;

    deleteCareGiver.mutate(selectedUserId, {
      onSuccess: () => {
        setSelectedUserId(null);
        handleDeleteDialog();
      },
    });
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  const users = data?.data?.users || [];
  const totalPages = data?.data?.totalPages || 1;
  const noUsers = users.length === 0;
  const [openAddGiver, setOpenAddGiver] = useState(false);
  const handleOpenAddGiver = () => {
    setOpenAddGiver((prev) => !prev);
  };
  return (
    <div className=" table-main-container">
      {/* Search & Filter */}
      <div className="flex gap-2 flex-wrap items-center mb-4">
        <GiverForm open={openAddGiver} handleOpen={handleOpenAddGiver} />

        <div className="w-[20rem] max-w-full flex items-center border border-gray-400 rounded-md ps-2">
          <SearchIcon size={18} />
          <CustomInput
            text={search}
            setText={setSearch}
            className="py-5 border-none focus-visible:ring-0"
            placeholder="Search by email or name"
          />
        </div>
        <button
          onClick={handleOpenAddGiver}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <AddButton className="text-white font-bold !border-0 !size-7" />
          <span className="text-md font-medium">Create New Caregiver</span>
        </button>
      </div>

      {/* Table */}
      <Table className="custom-table">
        <TableCaption>A list of caregivers</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile no</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isFetching && <TableLoader colSpan={5} />}
          {!isFetching && noUsers && (
            <EmptyTable colSpan={5} text="No givers found" />
          )}
          {!isFetching &&
            !noUsers &&
            users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobile}</TableCell>
                <TableCell>{user.gender || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <ViewButton
                      onClick={() => navigate(`/care-giver/${user.id}`)}
                    />
                    <UpdateButton onClick={() => handleOpenEditForm(user.id)} />

                    <DeleteButton
                      onClick={() => {
                        handleDeleteDialog();
                        setSelectedUserId(user.id);
                      }}
                      isDeleting={deleteCareGiver.isPending}
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
        title="Delete Caregiver"
        description="Are you sure you want to delete this caregiver?"
        onCancel={() => {
          handleDeleteDialog();
          setSelectedUserId(null);
        }}
        onConfirm={handleDeleteUser}
        isDeleting={deleteCareGiver.isPending}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}

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

export default Caregiver;
