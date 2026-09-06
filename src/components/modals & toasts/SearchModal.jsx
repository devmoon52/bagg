import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";

const SearchModal = ({ offSearch, getResult }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = `hidden`;

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        offSearch();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = ``;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <motion.div
      onClick={offSearch}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 z-9997 flex justify-center items-start"
    >
      <motion.div
        initial={{ y: -14 }}
        animate={{ y: 0 }}
        exit={{ y: -14 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        className="bg-white my-12 py-3 px-3 max-w-md w-[92%] rounded-md space-y-2"
      >
        <h2 className="font-medium">Find What You’re Looking For</h2>
        <div className="flex border border-gray-300 rounded-sm">
          <input
            id="search-field"
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getResult(inputRef.current.value);
              }
            }}
            className="min-w-0 grow w-full py-2 px-3 outline-none"
          />
          <button
            onClick={() => getResult(inputRef.current.value)}
            className="w-12 flex justify-center items-center border-l border-gray-300"
          >
            <Search size={22} strokeWidth={1.6} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SearchModal;
