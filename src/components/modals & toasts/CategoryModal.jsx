import { useEffect } from "react";
import { motion } from "motion/react";
import { List, X } from "lucide-react";
import { categories } from "../../data/category";
import { NavLink } from "react-router-dom";

const CategoryModal = ({ offCategory }) => {
  useEffect(() => {
    document.body.style.height = `${100}dvh`;
    document.body.style.overflow = `hidden`;

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        offCategory();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.height = ``;
      document.body.style.overflow = ``;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [offCategory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={offCategory}
      className="bg-black/20 fixed inset-0 w-full flex items-center justify-center z-9999"
    >
      {/* modal container */}
      <motion.div
        initial={{ y: -20, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: -20, scale: 0.95 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-2xl w-[94%] px-4 py-3 relative space-y-3 shadow-md rounded-md @container"
      >
        {/* close btn */}
        <button
          onClick={offCategory}
          className="absolute right-1 top-1 cursor-pointer"
        >
          <X aria-hidden="true" />
        </button>

        {/* heading */}
        <div className="flex items-center gap-1 text-gray-700">
          <List size={22} aria-hidden="true" strokeWidth={2.6} />
          <h2 id="category-modal-title" className="text-lg font-semibold">
            Category & Types
          </h2>
        </div>

        {/* category wise navigations */}
        <div className="max-h-70.5 overflow-auto">
          <ul className="flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <li className="basis-54 grow" key={category.id}>
                <NavLink
                  onClick={offCategory}
                  to={`/category?name=${category.qParam}`}
                  className={`flex items-center gap-2 px-3 py-2 border border-gray-300 hover:border-peach-light hover:text-peach-dark transition-all duration-200 rounded-sm`}
                >
                  <category.Icon
                    className="shrink-0"
                    size={22}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                  <h3>{category.categoryName}</h3>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* separation line */}
        <div className="border-b border-gray-300" />

        {/* type wise navigations */}
        <div className="grid gap-1 @lg:grid-cols-4 grid-cols-2">
          <div>
            <NavLink
              onClick={offCategory}
              to={`/type/trendings`}
              className={({ isActive }) =>
                `transition-colors duration-200 w-full inline-block px-3 py-2 rounded-sm ${isActive ? "bg-green-pastel" : "hover:bg-green-pastel/70 bg-green-pastel/40"}`
              }
            >
              Trendings
            </NavLink>
          </div>
          <div>
            <NavLink
              onClick={offCategory}
              to={`/type/new-arrivals`}
              className={({ isActive }) =>
                `transition-colors duration-200 w-full inline-block px-3 py-2 rounded-sm ${isActive ? "bg-green-pastel" : "hover:bg-green-pastel/70 bg-green-pastel/40"}`
              }
            >
              New Arrivals
            </NavLink>
          </div>
          <div>
            <NavLink
              onClick={offCategory}
              to={`/type/popular`}
              className={({ isActive }) =>
                `transition-colors duration-200 w-full inline-block px-3 py-2 rounded-sm ${isActive ? "bg-green-pastel" : "hover:bg-green-pastel/70 bg-green-pastel/40"}`
              }
            >
              Popular
            </NavLink>
          </div>
          <div>
            <NavLink
              onClick={offCategory}
              to={`/type/featured`}
              className={({ isActive }) =>
                `transition-colors duration-200 w-full inline-block px-3 py-2 rounded-sm ${isActive ? "bg-green-pastel" : "hover:bg-green-pastel/70 bg-green-pastel/40"}`
              }
            >
              Featured
            </NavLink>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CategoryModal;
