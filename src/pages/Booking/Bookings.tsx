import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import { useNavigate } from "react-router";

import { useBookings, useCancelBooking } from "@/store/data/booking/hooks";
import { bookingType } from "@/lib/interface-types";
import { CustomInput } from "@/components/common/CustomInputs";
import CustomPagination from "@/components/common/CustomPagination";
import { statusMenu } from "@/lib/resuable-data";
import { TableLoader } from "@/components/LoadingSpinner";
import { EmptyTable } from "@/components/common/EmptyTable";
import { DeleteDialog } from "@/components/common/CustomDialog";
import {
  convertToDate,
  convertToPascalCase,
  showError,
} from "@/lib/resuable-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CustomSelectSeperate,
  DeleteButton,
  UpdateButton,
} from "@/components/common/CustomInputs";

function Bookings() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookedOn, setBookenOn] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [status, setStatus] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<bookingType | null>(
    null
  );

  const filters = useMemo(
    () => ({
      page: currentPage,
      search: debouncedSearch?.trim(),
      bookedOn,
      appointmentDate,
      status,
    }),
    [currentPage, debouncedSearch, bookedOn, appointmentDate, status]
  );

  const { data, isFetching, error } = useBookings(filters);
  const cancelBooking = useCancelBooking();
  const navigate = useNavigate();

  const handleDeleteDialog = () => {
    setOpenDeleteDialog((prev) => !prev);
  };

  const handleDeleteBooking = () => {
    if (!selectedBooking) return;

    cancelBooking.mutate(selectedBooking.bookingId, {
      onSuccess: () => {
        setSelectedBooking(null);
        handleDeleteDialog();
      },
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search?.trim());
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  const bookings: bookingType[] = data?.data?.bookings || [];
  const totalPages = data?.data?.pagesCount || 1;
  const noBookings = bookings.length === 0;

  return (
    <>
      <div className="table-main-container">
        <div className="flex gap-2 md:flex-row flex-col ">
          <div className="w-[20rem] max-w-full flex items-center border border-gray-400 rounded-md ps-2 ">
            <SearchIcon size={18} />
            <CustomInput
              text={search}
              setText={setSearch}
              className="py-5 border-none focus-visible:ring-0 !bg-inherit w-full"
              placeholder="Search by name or email"
            />
          </div>

          <CustomSelectSeperate
            menu={statusMenu}
            value={status}
            onChange={setStatus}
            placeholder="Filter by status"
            className="md:max-w-[15rem] w-full"
          />

          <div className="flex items-center px-2 gap-2 md:w-max w-full  bg-inherit border border-gray-400 rounded-md  py-[0.6rem]">
            <div className="text-sm ">Booked </div>
            <input
              className="w-full bg-inherit  border-none rounded-md  text-sm !m-0"
              type="date"
              placeholder="filter by Booked Date"
              value={bookedOn}
              onChange={(e) => {
                setBookenOn(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center px-2 gap-2 md:w-max w-full  bg-inherit border border-gray-400 rounded-md  py-[0.6rem]">
            <div className="text-sm ">Appointment </div>
            <input
              className="w-full bg-inherit  border-none rounded-md  text-sm !m-0"
              type="date"
              placeholder="filter by Appointment Date"
              value={appointmentDate}
              onChange={(e) => {
                setAppointmentDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
        <Table className="custom-table">
          <TableCaption>A list of bookings</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Booking Id</TableHead>
              <TableHead>Careseeker</TableHead>
              <TableHead>Booked On</TableHead>
              <TableHead>Appointment Date</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>

              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isFetching && <TableLoader colSpan={7} />}
            {!isFetching && noBookings && (
              <EmptyTable colSpan={7} text="No bookings found" />
            )}
            {!isFetching &&
              !noBookings &&
              bookings.map((booking) => (
                <TableRow key={booking.bookingId}>
                  <TableCell>{booking.bookingId}</TableCell>
                  <TableCell>{booking.user.email}</TableCell>
                  <TableCell>{convertToDate(booking.bookedOn)}</TableCell>
                  <TableCell>
                    {convertToDate(booking.appointmentDate)}
                  </TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>
                    <span
                      className={
                        booking.status === "confirmed" ||
                        booking.status === "active"
                          ? "text-green-600 text-xs font-medium"
                          : booking.status === "pending"
                          ? "text-orange-600 text-xs font-medium"
                          : booking.status === "completed"
                          ? "text-blue-600 text-xs font-medium"
                          : booking.status === "cancel"
                          ? "text-red-600 rounded-full text-xs font-medium"
                          : "text-gray-600 rounded-full text-xs font-medium"
                      }
                    >
                      {convertToPascalCase(booking.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      <UpdateButton
                        onClick={() => {
                          navigate(`/bookings/${booking.bookingId}`);
                        }}
                      />
                      <DeleteButton
                        onClick={() => {
                          handleDeleteDialog();
                          setSelectedBooking(booking);
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <DeleteDialog
          openDialog={openDeleteDialog}
          handleOpenDialog={handleDeleteDialog}
          title="Cancel Booking"
          description="Are you sure you want to cancel this booking?"
          onCancel={() => {
            handleDeleteDialog();
            setSelectedBooking(null);
          }}
          onConfirm={handleDeleteBooking}
          isDeleting={cancelBooking?.isPending}
        />

        {totalPages > 1 && (
          <CustomPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </>
  );
}

export default Bookings;
