import { useSelector } from "react-redux";
import SuccessPopup from "../components/modals & toasts/SuccessPopup";
import { AnimatePresence } from "motion/react";

const Global = () => {
  const { success } = useSelector((state) => state.global);

  return (
    <>
      {/* pop up for success message */}
      <AnimatePresence>
        {success && <SuccessPopup key={success.id} msg={success.msg} />}
      </AnimatePresence>
    </>
  );
};

export default Global;
