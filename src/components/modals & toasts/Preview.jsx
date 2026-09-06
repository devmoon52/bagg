import { X } from "lucide-react";
import { motion } from "motion/react";
import React, { useEffect } from "react";

const Preview = ({ offPreview, image }) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        offPreview();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [offPreview]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-9998 flex items-center justify-center bg-black/60 p-3 md:p-6"
      onClick={offPreview}
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.92,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          scale: 0.92,
        }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        className="relative flex max-h-full max-w-full flex-col items-end gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close button */}
        <button
          onClick={offPreview}
          aria-label="Close image preview"
          className="flex h-9.5 w-9.5 shrink-0 cursor-pointer items-center justify-center rounded-md bg-white text-black transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <X size={21} strokeWidth={1.8} />
        </button>

        {/* image */}
        <div className="flex max-h-[calc(100dvh-5rem)] max-w-[95vw] items-center justify-center overflow-hidden rounded-md md:max-h-[85dvh] md:max-w-[90vw]">
          <img
            src={image}
            alt="Preview"
            loading="eager"
            fetchPriority="high"
            className="block max-h-[calc(100dvh-5rem)] max-w-[95vw] object-contain object-center md:max-h-[85dvh] md:max-w-[90vw]"
          />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Preview;
