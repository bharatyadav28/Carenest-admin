import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FiPlus as PlusIcon } from "react-icons/fi";
import { TiTick as CompleteIcon } from "react-icons/ti";
import { Trash as DeleteIcon } from "lucide-react";
import {
  LoadingSpinner,
  PageLoadingSpinner,
} from "@/components/LoadingSpinner";
import { convertToDate, formatDate, showError } from "@/lib/resuable-fns";
import {
  useAssignCaregiver,
  useBookingById,
  useCancelBooking,
  useCompleteBooking,
  useUpdateBookingDetails,
} from "@/store/data/booking/hooks";
import useGeneral from "@/store/features/general";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomButton } from "@/components/common/CustomInputs";
import CaregiverCard from "@/components/bookings/CaregiverCard";
import { caregiverType } from "@/lib/interface-types";
import { DeleteDialog } from "@/components/common/CustomDialog";
import CaregiverMenu from "@/components/bookings/CaregiverMenu";
import AddMoreCard from "@/components/bookings/AddMoreCard";
import WeeklySchedule from "@/components/bookings/WeeklySchedule";

const formSchema = z.object({
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string(),
  meetingDate: z.string().min(1, { message: "Meeting date is required" }),
});

function BookingDetails() {
  const { id } = useParams();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [openCaregiverMenu, setOpenCaregiverMenu] = useState(false);

  const [choosenGiver, setChoosenGiver] = useState<caregiverType | null>(null);
  const [action, setAction] = useState("");

  const replacePageName = useGeneral((state) => state.replacePageName);

  const { data, isFetching, error } = useBookingById(id || "");
  const assignCaregiver = useAssignCaregiver(id || "");
  const completeBooking = useCompleteBooking();
  const cancelBooking = useCancelBooking();
  const updateBookingDetails = useUpdateBookingDetails();

  const booking = data?.data?.booking;

  const handleDeleteDialog = () => {
    setOpenDeleteDialog((prev) => !prev);
  };

  const handleActionDialog = () => {
    setOpenActionDialog((prev) => !prev);
  };

  const handleOpenCaregiverMenu = () => {
    setOpenCaregiverMenu((prev) => !prev);
  };

  const handleAssignCaregiver = () => {
    if (!choosenGiver) return;

    assignCaregiver.mutate(
      { caregiverId: choosenGiver.id },
      {
        onSuccess: () => {
          setChoosenGiver(null);
          handleDeleteDialog();
        },
      }
    );
  };

  const handleActionConfirmm = () => {
    if (!id) return;

    if (action === "Complete") {
      completeBooking.mutate(id, {
        onSuccess: () => {
          handleActionDialog();
          setAction("");
        },
      });
    }

    if (action === "Cancel") {
      cancelBooking.mutate(id, {
        onSuccess: () => {
          handleActionDialog();
          setAction("");
        },
      });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      meetingDate: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!id) return;
    updateBookingDetails.mutate({
      bookingId: id,
      updatedData: {
        startDate: values.startDate,
        endDate: values.endDate || null,
        meetingDate: values.meetingDate, // Assuming meetingDate is same as startDate
      },
    });
  }

  const { reset } = form;

  // When profile data is fetched, reset form values
  useEffect(() => {
    if (booking) {
      reset({
        startDate: booking?.startDate || "",
        endDate: booking?.endDate || "",
        meetingDate: booking?.meetingDate || "",
      });
    }
  }, [booking, reset]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  useEffect(() => {
    replacePageName("Booking Details");
  }, []);

  return (
    <>
      <div className="table-main-container">
        <div className="input-container mb-[0.1rem]">
          <label>Booking Id</label>
          <div>{booking?.bookingId}</div>
        </div>

        <div className="input-container mb-[0.1rem]">
          <label>Service </label>
          <div>
            {booking?.services?.map((service) => service.name).join(", ")}
          </div>
        </div>

        <div className="input-container mb-[0.1rem]">
          <label>Status </label>
          <div className="capitalize">{booking?.status}</div>
        </div>

        <div className="input-container mb-[0.1rem]">
          <label>Booked On</label>
          <div>{convertToDate(booking?.bookedOn)}</div>
        </div>

        {booking?.cancelledAt && (
          <div className="input-container mb-[0.1rem]">
            <label>Cancelled At</label>
            <div>{formatDate(booking?.cancelledAt)}</div>
          </div>
        )}
            <div className="input-container mb-[0.4rem]">
          <label>Careseeker Name </label>
          <div>{booking?.user?.name}</div>
        </div>

        <div className="input-container mb-[0.4rem]">
          <label>Careseeker email </label>
          <div>{booking?.user?.email}</div>
        </div>

        <div className="input-container mb-[0.4rem]">
          <label>Careseeker mobile </label>
          <div>{booking?.user?.mobile}</div>
        </div>

        <div className="input-container mb-[0.4rem]">
          <label> Careseeker Zip code </label>
          <div>{booking?.careseekerZipCode}</div>
        </div>

        <div className="input-container mb-[0.4rem]">
          <label>Required by </label>
          <div>{booking?.requiredBy}</div>
        </div>

        {booking?.cancelledAt && (
          <div className="input-container mb-[0.4rem]">
            <label>Cancelled At </label>
            <div>{formatDate(booking?.cancelledAt)}</div>
          </div>
        )}

        {!isFetching && booking && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="input-container">
                    <FormLabel>Start Date</FormLabel>
                    <div className="user-input">
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Enter appointment date"
                          {...field}
                          className=" !w-1/2 date-input input"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="input-container">
                    <FormLabel>End Date</FormLabel>
                    <div className="user-input">
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Enter end date"
                          {...field}
                          className=" !w-1/2 date-input input"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
                 <FormField
                control={form.control}
                name="meetingDate"
                render={({ field }) => (
                  <FormItem className="input-container">
                    <FormLabel>Meeting Date</FormLabel>
                    <div className="user-input">
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Enter meeting date"
                          {...field}
                          className=" !w-1/2 date-input input"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <CustomButton
                type="submit"
                className={`green-button p-4`}
                disabled={updateBookingDetails.isPending}
              >
                {updateBookingDetails.isPending ? <LoadingSpinner /> : "Save"}
              </CustomButton>
            </form>
          </Form>
        )}
      </div>

      <WeeklySchedule
        weeklySchedule={booking?.weeklySchedule}
        bookingId={booking?.bookingId}
      />

      <div className="table-main-container mt-8">
        <div className="input-container">
          <label>Caregivers</label>
          <div className="flex flex-wrap gap-4">
            {booking?.caregivers &&
              booking?.caregivers.map((caregiver: caregiverType) => (
                <CaregiverCard
                  key={caregiver.id}
                  caregiver={caregiver}
                  handleDeleteDialog={handleDeleteDialog}
                  setChoosenGiver={setChoosenGiver}
                />
              ))}

            <AddMoreCard handleOpenCaregiverMenu={handleOpenCaregiverMenu} />
          </div>
        </div>

        <div className="input-container my-2">
          <label>Action</label>
          <div className="flex flex-wrap gap-4">
            <CustomButton
              onClick={() => {
                setAction("Complete");
                handleActionDialog();
              }}
            >
              Mark as Completed
            </CustomButton>
            <CustomButton
              onClick={() => {
                setAction("Cancel");
                handleActionDialog();
              }}
            >
              Mark as Cancelled
            </CustomButton>
          </div>
        </div>
      </div>

      <DeleteDialog
        openDialog={openDeleteDialog}
        handleOpenDialog={handleDeleteDialog}
        title="Assign Caregiver"
        description="Are you sure you want to assign this caregiver?"
        Icon={PlusIcon}
        onCancel={() => {
          handleDeleteDialog();
          setChoosenGiver(null);
        }}
        onConfirm={handleAssignCaregiver}
        isDeleting={assignCaregiver?.isPending}
      />

      <DeleteDialog
        openDialog={openActionDialog}
        handleOpenDialog={handleActionDialog}
        title={`${action} booking`}
        description={`Are you sure you want to ${action.toLowerCase()} this booking?`}
        Icon={action === "Complete" ? CompleteIcon : DeleteIcon}
        onCancel={() => {
          handleActionDialog();
          setAction("");
        }}
        onConfirm={handleActionConfirmm}
        isDeleting={cancelBooking?.isPending || completeBooking?.isPending}
      />

      <CaregiverMenu
        open={openCaregiverMenu}
        handleOpen={handleOpenCaregiverMenu}
        handleDeleteDialog={handleDeleteDialog}
        setChoosenGiver={setChoosenGiver}
      />

      {isFetching && <PageLoadingSpinner />}
    </>
  );
}

export default BookingDetails;
