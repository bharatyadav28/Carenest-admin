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
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { useDeleteWeeklySchedule } from "@/store/data/booking/hooks";

interface Props {
  weeklySchedule?: weeklyScheduleType[];
  bookingId?: string;
}

function WeeklySchedule({ weeklySchedule, bookingId }: Props) {
  const [openForm, setOpenForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<weeklyScheduleType | null>(null);

  const deleteWeeklySchedule = useDeleteWeeklySchedule();

  const handleOpenForm = () => {
    setOpenForm((prev) => !prev);
  };

  const bookedDays = weeklySchedule?.map((schedule) =>
    schedule.weekDay?.toString()
  );

  const handleDeleteSchedule = (scheduleId: string | undefined) => {
    if (!scheduleId) return;
    if (bookingId) deleteWeeklySchedule.mutate({ bookingId, scheduleId });
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
                {false && <TableLoader colSpan={7} />}
                {sortedSchedule?.length === 0 && (
                  <EmptyTable colSpan={7} text="No schedule exists" />
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
                        <div className="flex">
                          <UpdateButton
                            onClick={() => {
                              setSelectedSchedule(schedule);
                              handleOpenForm();
                            }}
                          />
                          <DeleteButton
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            isDeleting={deleteWeeklySchedule?.isPending}
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
