import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { productSelector } from "../../redux/selectors/productSelector";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const NewArrivals = () => {
  const [index, setIndex] = useState(1);

  const { types } = useSelector(productSelector);
  const { newArrival } = types;

  return (
    <section className="px-3">
      {/* container */}
      <div className="max-w-7xl mx-auto space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles strokeWidth={2.2} aria-hidden="true" size={26} />
          <h2 className="text-xl font-medium">New Arrivals</h2>
        </div>
        {/* grid container 1x2 */}
        <div className="grid md:grid-cols-2 grid-rows-1 grid-cols-1 gap-3">
          <div
            to={`/type/new-arrivals?proId=${newArrival[index]?.id}`}
            role="button"
            className="overflow-hidden relative w-full aspect-4/3"
          >
            {/* image */}
            <AnimatePresence initial={false}>
              <motion.img
                key={index}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-10%", opacity: 0 }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                }}
                loading="eager"
                fetchPriority="high"
                src={newArrival[index]?.image}
                alt={newArrival[index]?.name}
                className="w-full h-full object-cover object-center"
              />
            </AnimatePresence>

            {/* overlay */}
            <NavLink
              to={`/type/new-arrivals?proId=${newArrival[index]?.id}`}
              className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-transparent peer cursor-pointer"
            />

            {/* product-name & desc */}
            <NavLink
              to={`/type/new-arrivals?proId=${newArrival[index]?.id}`}
              className="absolute top-2 left-3 pr-3 -space-y-0.5 text-white peer-hover:underline hover:underline cursor-pointer"
            >
              <h3 className="text-lg font-medium">{newArrival[index]?.name}</h3>
              <p className="text-sm">{newArrival[index]?.shortDescription}</p>
            </NavLink>

            {/* dot indicators */}
            <div className="flex items-center gap-1 absolute bottom-2 left-3">
              {[1, 2, 3, 4, 5].map((_, i) => {
                return (
                  <button
                    key={i + 1}
                    onClick={() => setIndex(i)}
                    className={`h-4 w-4 rounded-full border border-gray-400 ${index === i ? "bg-green-300" : "bg-gray-200 hover:bg-gray-300"}`}
                  ></button>
                );
              })}
            </div>

            {/* explore btn */}
            <div className="absolute right-3 bottom-2">
              <NavLink
                to={"/type/new-arrivals"}
                className={`bg-peach-dark px-4 py-2 rounded-full text-white inline-block hover:bg-peach-ultra`}
              >
                Explore More
              </NavLink>
            </div>
          </div>

          {/* grid box 2x3 */}
          <div className="grid grid-rows-2 md:grid-cols-3 grid-cols-2 gap-2">
            {newArrival.slice(-6).map((product) => (
              <NavLink
                to={`/type/new-arrivals?proId=${product.id}`}
                key={product.id}
                className="rounded-md overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  fetchPriority="auto"
                  className="h-full w-full object-cover"
                />
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
