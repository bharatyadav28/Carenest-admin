import { caregiverType } from "@/lib/interface-types";
import { cdnURL } from "@/lib/resuable-data";
import { AssignButton, ViewButton } from "../common/CustomInputs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  caregiver: caregiverType;
  handleDeleteDialog: () => void;
  setChoosenGiver: (giver: caregiverType | null) => void;
}
function CaregiverCard({
  caregiver,
  handleDeleteDialog,
  setChoosenGiver,
}: Props) {
  const handleAssign = () => {
    setChoosenGiver(caregiver);
    handleDeleteDialog();
  };

  return (
    <div
      className={`relative group p-6 rounded-xl border-2 transition-all duration-300 md:w-[15rem] hover:scale-105 hover:shadow-lg hover:cursor-pointer ${
        caregiver.isFinalSelection
          ? "border-emerald-400 bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 shadow-emerald-500/20"
          : "border-slate-600 bg-gradient-to-br from-slate-800/50 to-slate-700/30 hover:border-slate-500 hover:shadow-slate-500/10"
      }`}
    >
      {/* Experience Badge */}
      <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
        {caregiver?.maxExperience || 0} yrs
      </div>

      {/* Selection Indicator */}
      {caregiver.isFinalSelection && (
        <div className="absolute top-3 left-3">
          <div className="w-5 h-5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Profile Image */}
      <div className="flex justify-center mb-4 mt-2">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-xl ring-2 ring-slate-500/50">
          {caregiver.avatar ? (
            <img
              src={`${cdnURL}/${caregiver.avatar}`}
              alt={caregiver.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-slate-300 text-2xl font-bold">
              {caregiver.name?.charAt(0)?.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Name */}
      <div className="text-center mb-2">
        <h3 className="font-semibold text-slate-100 text-base truncate">
          {caregiver.name}
        </h3>
      </div>

      {/* Email */}
      <div className="text-center">
        <p className="text-slate-400 text-sm truncate">{caregiver.email}</p>
      </div>

      {/* Status Indicator */}
      <div className="mt-3 flex justify-center">
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            caregiver.isFinalSelection
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-slate-600/30 text-slate-400 border border-slate-500/30"
          }`}
        >
          {caregiver.isUsersChoice ? "User's choice" : "Admin's choice"}
        </span>
      </div>

      <div className="absolute inset-0  bg-opacity-20 rounded-xl border-none backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 ">
        <Tooltip>
          <TooltipTrigger>
            <AssignButton className="border-none" onClick={handleAssign} />
          </TooltipTrigger>
          <TooltipContent>Assign</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <ViewButton className="border-none " />
          </TooltipTrigger>
          <TooltipContent>View profile</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export default CaregiverCard;
