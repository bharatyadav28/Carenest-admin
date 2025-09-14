import { useState, useEffect } from "react";
import { PlusIcon, SearchIcon } from "lucide-react";

import CustomSheet from "@/components/common/CustomSheet";
import { useGivers } from "@/store/data/users/hooks";
import { AddButton, CustomButton, CustomInput } from "../common/CustomInputs";
import { caregiverType } from "@/lib/interface-types";
import CaregiverCard from "./CaregiverCard";
import { ContainerLoader } from "../LoadingSpinner";
import GiverForm from "../user-management/GiverForm";
import { Button } from "../ui/button";

interface Props {
  open: boolean;
  handleOpen: () => void;
  handleDeleteDialog: () => void;
  setChoosenGiver: (giver: caregiverType | null) => void;
}

function CaregiverMenu({
  open,
  handleOpen,
  handleDeleteDialog,
  setChoosenGiver,
}: Props) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openAddGiver, setOpenAddGiver] = useState(false);

  const { data, isFetching } = useGivers(debouncedSearch?.trim());

  const caregivers = data?.data?.caregivers || [];

  const handleOpenAddGiver = () => {
    setOpenAddGiver((prev) => !prev);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search?.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <>
      <CustomSheet open={open} handleOpen={handleOpen}>
        <div className="py-4 px-4">
          <div className="flex items-center gap-2">
            <div className="uppercase text-lg">Select Caregiver</div>
            <AddButton
              onClick={handleOpenAddGiver}
              tooltipContent="Add new caregiver"
              className="size-6"
            />
          </div>
          <div className=" w-full max-w-full flex items-center border border-gray-400 rounded-md ps-2 mt-4 ">
            <SearchIcon size={18} />
            <CustomInput
              text={search}
              setText={setSearch}
              className="py-5 border-none focus-visible:ring-0 !bg-inherit w-full"
              placeholder="Search by name or email"
            />
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            {!isFetching &&
              caregivers?.length > 0 &&
              caregivers?.map((caregiver: caregiverType) => (
                <CaregiverCard
                  key={caregiver.id}
                  caregiver={caregiver}
                  handleDeleteDialog={handleDeleteDialog}
                  setChoosenGiver={setChoosenGiver}
                  isMenu={true}
                />
              ))}
            {isFetching && <ContainerLoader className="mt-[8rem]" />}
          </div>
        </div>
      </CustomSheet>

      <GiverForm open={openAddGiver} handleOpen={handleOpenAddGiver} />
    </>
  );
}

export default CaregiverMenu;
