import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomDialog } from "../common/CustomDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { weekDayArray } from "@/lib/resuable-data";
import { weeklyScheduleType } from "@/lib/interface-types";
import { useEffect } from "react";
import { CustomButton } from "../common/CustomInputs";
import {
  useAddNewWeeklySchedule,
  useUpdateWeeklySchedule,
} from "@/store/data/booking/hooks";
import { LoadingSpinner } from "../LoadingSpinner";

interface Props {
  open: boolean;
  handleOpen: () => void;
  selectedSchedule?: weeklyScheduleType | null;
  bookedDays?: string[];
  bookingId?: string;
}

const formSchema = z.object({
  weekDay: z.string().min(1).max(1, "Invalid day of the week"),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: "Start time must be in HH:MM:SS format",
  }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: "End time must be in HH:MM:SS format",
  }),
});

function ScheduleForm({
  open,
  handleOpen,
  selectedSchedule,
  bookedDays,
  bookingId,
}: Props) {
  const addNewWeeklySchedule = useAddNewWeeklySchedule();
  const updateSchedule = useUpdateWeeklySchedule();

  const filteredWeekDays = weekDayArray.filter((day) => {
    if (bookedDays) {
      let updatedBookedDays = [...bookedDays];
      if (selectedSchedule) {
        updatedBookedDays = bookedDays?.filter(
          (day) => day !== selectedSchedule?.weekDay.toString()
        );
      }
      return !updatedBookedDays.includes(day.value.toString());
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weekDay: filteredWeekDays?.[0]?.value.toString(),
      startTime: "",
      endTime: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!bookingId) return;

    let data = {
      bookingId,
      scheduledData: {
        ...values,
      },
    };

    if (selectedSchedule) {
      if (!selectedSchedule?.id) return;
      const updatedData = {
        ...data,
        scheduleId: selectedSchedule?.id,
      };

      updateSchedule.mutate(updatedData, {
        onSuccess: () => {
          handleOpen();
        },
      });
    } else {
      addNewWeeklySchedule.mutate(data, {
        onSuccess: () => {
          handleOpen();
        },
      });
    }
  }

  useEffect(() => {
    if (selectedSchedule) {
      form.reset({
        weekDay: selectedSchedule.weekDay.toString(),
        startTime: selectedSchedule.startTime,
        endTime: selectedSchedule.endTime,
      });
    } else {
      form.reset({
        weekDay: "",
        startTime: "",
        endTime: "",
      });
    }
  }, [open]);

  const isSubmitting =
    addNewWeeklySchedule.isPending || updateSchedule.isPending;

  return (
    <CustomDialog open={open} handleOpen={handleOpen} className="w-[30rem]">
      <div className="text-[1.5rem] font-medium h-max text-center">
        {selectedSchedule ? "Edit" : "Add"} Schedule
      </div>

      <div className="table-container !bg-[var(--dark-black)] !py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="weekDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Week Day</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a day" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {filteredWeekDays?.map((item) => {
                        return (
                          <SelectItem
                            key={item.value}
                            value={item.value.toString()}
                          >
                            {item.key}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input placeholder="00:00:00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input placeholder="00:00:00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CustomButton
              type="submit"
              className="green-button w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoadingSpinner />
              ) : selectedSchedule ? (
                "Update"
              ) : (
                "Add"
              )}
            </CustomButton>
          </form>
        </Form>
      </div>
    </CustomDialog>
  );
}

export default ScheduleForm;
