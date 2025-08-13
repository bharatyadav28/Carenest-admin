import { FiPlus as PlusIcon } from "react-icons/fi";

interface Props {
  handleOpenCaregiverMenu: () => void;
}
function AddMoreCard({ handleOpenCaregiverMenu }: Props) {
  return (
    <div
      onClick={handleOpenCaregiverMenu}
      className="relative group p-6 rounded-xl border-2 md:w-[15rem] flex flex-col items-center justify-center gap-4
                             border-slate-600/80 bg-gradient-to-br from-slate-800/40 to-slate-700/20
                             hover:border-emerald-400/70 hover:from-slate-800/60 hover:to-slate-700/40
                             hover:shadow-lg hover:shadow-emerald-500/10 hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      <span
        className="w-16 h-16 flex items-center justify-center rounded-full border border-slate-500/60
                               bg-gradient-to-br from-slate-700/60 to-slate-600/40
                               group-hover:border-emerald-400/70 group-hover:from-slate-700/80 group-hover:to-slate-600/60
                               group-hover:shadow-[0_0_0_3px_rgba(16,185,129,0.15)] transition-colors"
      >
        <PlusIcon
          size={34}
          className="text-slate-300 group-hover:text-emerald-300 transition-colors"
        />
      </span>

      <div className="text-center space-y-1">
        <p className="font-semibold text-slate-100 text-sm tracking-wide group-hover:text-emerald-300 transition-colors">
          More caregivers
        </p>
        <p className="text-[10px] uppercase tracking-wider text-slate-500 group-hover:text-slate-400 transition-colors">
          Add / Assign
        </p>
      </div>

      {/* Subtle radial highlight on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.12),transparent_70%)]" />
      </div>
    </div>
  );
}

export default AddMoreCard;
