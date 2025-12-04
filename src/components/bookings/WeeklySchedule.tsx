import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableLoader } from "../LoadingSpinner";
import { weeklyScheduleType } from "@/lib/interface-types";
import { weekNumMapping } from "@/lib/resuable-data";
import { AddButton, DeleteButton, UpdateButton } from "../common/CustomInputs";
import { EmptyTable } from "../common/EmptyTable";
import ScheduleForm from "./ScheduleForm";
import { useDeleteWeeklySchedule } from "@/store/data/booking/hooks";

interface Props {
  weeklySchedule?: weeklyScheduleType[];
  bookingId?: string;
}

function WeeklySchedule({ weeklySchedule, bookingId }: Props) {
  const [openForm, setOpenForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<weeklyScheduleType | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteWeeklySchedule = useDeleteWeeklySchedule();

  const handleOpenForm = () => {
    setOpenForm((prev) => !prev);
  };

  const bookedDays = weeklySchedule?.map((schedule) =>
    schedule.weekDay?.toString()
  );

  const handleDeleteSchedule = (scheduleId: string | undefined) => {
    if (!scheduleId) return;
    
    setDeletingId(scheduleId); // Track which schedule is being deleted
    
    if (bookingId) {
      deleteWeeklySchedule.mutate(
        { bookingId, scheduleId },
        {
          onSettled: () => {
            // Clear the deleting state when mutation completes (success or error)
            setDeletingId(null);
          },
        }
      );
    }
  };

  const sortedSchedule = weeklySchedule?.sort(
    (a, b) => Number(a.weekDay) - Number(b.weekDay)
  );

  return (
    <>
      <div className="table-main-container mt-8">
        <div className="input-container">
          <label>
            <div className="flex gap-2 items-center">
              <div> Weekly Schedule</div>
              <AddButton
                onClick={() => {
                  handleOpenForm();
                  setSelectedSchedule(null);
                }}
                tooltipContent="Add new schedule"
              />
            </div>
          </label>
          <div className="flex flex-wrap gap-4  sub-table-container">
            <Table className="custom-table ">
              <TableCaption>A list of Weekly Schedule</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Week Day</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {false && <TableLoader colSpan={4} />}
                {sortedSchedule?.length === 0 && (
                  <EmptyTable colSpan={4} text="No schedule exists" />
                )}

                {sortedSchedule?.length! > 0 &&
                  sortedSchedule?.map((schedule) => (
                    <TableRow key={schedule.weekDay}>
                      <TableCell>
                        {weekNumMapping[Number(schedule.weekDay)]}
                      </TableCell>
                      <TableCell>{schedule.startTime}</TableCell>
                      <TableCell>{schedule.endTime}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <UpdateButton
                            onClick={() => {
                              setSelectedSchedule(schedule);
                              handleOpenForm();
                            }}
                          />
                          <DeleteButton
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            isDeleting={deletingId === schedule.id && deleteWeeklySchedule?.isPending}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <ScheduleForm
        open={openForm}
        handleOpen={handleOpenForm}
        selectedSchedule={selectedSchedule}
        bookedDays={bookedDays || []}
        bookingId={bookingId}
      />
    </>
  );
}

export default WeeklySchedule;