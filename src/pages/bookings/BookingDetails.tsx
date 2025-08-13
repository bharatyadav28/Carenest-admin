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

const formSchema = z.object({
  appointmentDate: z
    .string()
    .min(1, { message: "Appointment date is required" }),
  duration: z
    .number()
    .min(1, { message: "Duration in days must be at least 1" }),
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
      appointmentDate: "",
      duration: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!id) return;
    updateBookingDetails.mutate({
      bookingId: id,
      updatedData: {
        appointmentDate: values.appointmentDate,
        duration: values.duration,
      },
    });
  }

  const { reset } = form;

  // When profile data is fetched, reset form values
  useEffect(() => {
    if (booking) {
      reset({
        appointmentDate: booking?.appointmentDate || "",
        duration: Number(booking?.duration) || 1,
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
          <div>{booking?.service}</div>
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
          <label>Careseeker </label>
          <div>{booking?.user?.email}</div>
        </div>

        {!isFetching && booking && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="appointmentDate"
                render={({ field }) => (
                  <FormItem className="input-container">
                    <FormLabel>Appointment Date</FormLabel>
                    <div className="user-input">
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Enter appointment date"
                          {...field}
                          className=" !w-full date-input input"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="input-container">
                    <FormLabel>Duration (days)</FormLabel>
                    <div className="user-input">
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Enter duration in days"
                          {...field}
                          className="input"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
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

      <div className="table-main-container mt-8">
        <div className="input-container">
          <label>Caregivers</label>
          <div className="flex flex-wrap gap-4">
            {booking?.caregivers?.length > 0 &&
              booking.caregivers.map((caregiver: caregiverType) => (
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
          <div className="flex gap-4">
            <CustomButton
              onClick={() => {
                setAction("Complete");
                handleActionDialog();
              }}
            >
              Mark as Complete
            </CustomButton>
            <CustomButton
              onClick={() => {
                setAction("Cancel");
                handleActionDialog();
              }}
            >
              Mark as Cancel
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
