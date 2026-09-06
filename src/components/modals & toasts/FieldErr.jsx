import { TriangleAlert } from "lucide-react";
import { motion } from "motion/react";

const FieldErr = ({ msg, reverse = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32 }}
      className={`bg-red-100 rounded-sm px-3 py-2 text-sm flex items-start gap-1.5 absolute top-full text-red-500 w-max max-w-70 z-10 shadow border border-red-400/30
      after:content-[''] 
      after:absolute 
      after:-top-1.75
      after:w-3 
      after:h-3 
      after:bg-red-100 
      after:border-t 
      after:border-l 
      after:border-red-400/30 
      after:rotate-45
      ${reverse ? "right-2 after:right-4" : "left-4 after:left-4"}
    `}
    >
      <TriangleAlert size={18} className="shrink-0 mt-px" />
      <p className="">{msg}</p>
    </motion.div>
  );
};

export default FieldErr;
