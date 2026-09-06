import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSuccessMessage } from "../../redux/slices/globalSlice";
import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";

const SuccessPopup = ({ msg }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSuccessMessage(null));
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [msg]);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -10,
      }}
      className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-3 rounded-md shadow-md fixed top-7 left-1/2 -translate-x-1/2 z-9999 md:w-auto w-[90%]"
    >
      <CheckCircle
        className="shrink-0 text-green-600"
        size={22}
        strokeWidth={2.4}
        aria-hidden="true"
      />
      <span className="font-medium">{msg}</span>
    </motion.div>
  );
};

export default SuccessPopup;
