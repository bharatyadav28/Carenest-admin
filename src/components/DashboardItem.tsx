import CountUp from "react-countup";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

interface Props {
  name: string;
  count: number;
  color: string;
  index: number;
  href: string;
  state?: Record<string, any>;
}
function DashboardItem({ name, count, color, index, href, state }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    const newPageState = state ? { ...state } : {};
    navigate(href, {
      state: { ...newPageState },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.2,
      }}
      onClick={handleClick}
    >
      <motion.div
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring" }}
        className="w-full flex flex-col bg-[var(--border)] rounded-sm items-center py-8 gap-2 cursor-pointer"
      >
        <div className={`text-2xl `} style={{ color: color }}>
          <CountUp end={count} />
        </div>
        <div>{name}</div>
      </motion.div>
    </motion.div>
  );
}

export default DashboardItem;
