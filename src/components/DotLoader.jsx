import { motion } from "motion/react";

const DotLoader = ({size = "md", mode="bright"}) => {

  return (
    <div className={`flex ${size === 'md'?'gap-2':size === 'lg'?'gap-2.5':'gap-1.5'}`}>
      {[1, 2, 3].map((_, i) => (
        <div
          className={`${size === "md" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-2.5 w-2.5"} ${mode === "bright" ? "bg-gray-600":"bg-gray-100"}  dot-loading rounded-full`}
          key={i}
          style={{
            animationDelay: `${i * 0.2}s`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default DotLoader;
