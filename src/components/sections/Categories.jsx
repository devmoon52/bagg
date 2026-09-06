import { ChevronLeft, ChevronRight, TextAlignStart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { categories } from "../../data/category";
import { useEffect, useRef, useState } from "react";
import { debounce } from "../../utils/optimize";

const Categories = () => {
  const [scrolled, setScrolled] = useState({
    isAbsoluteLeft: true,
    isAbsoluteRight: false,
  });

  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const fnRef = useRef(null);

  // snap left - right btn action
  function snapLeft() {
    const cardWidth = cardRef.current.offsetWidth;

    // card width + 12 padding
    containerRef.current.scrollBy({
      left: cardWidth + 12,
      behavior: "smooth",
    });
  }

  // snap right - left btn action
  function snapRight() {
    const cardWidth = cardRef.current.offsetWidth;

    // card width + 12 padding
    containerRef.current.scrollBy({
      left: -(cardWidth + 12),
      behavior: "smooth",
    });
  }

  if (!fnRef.current) {
    fnRef.current = debounce(() => {
      const scrollLeft = containerRef.current.scrollLeft;
      const clientWidth = containerRef.current.clientWidth;
      const scrollWidth = containerRef.current.scrollWidth;

      let isAbsoluteLeft = scrollLeft <= 0;
      let isAbsoluteRight = scrollLeft + clientWidth >= scrollWidth;

      setScrolled({
        isAbsoluteLeft,
        isAbsoluteRight,
      });
    }, 150);
  }

  function handleScroll() {
    fnRef.current();
  }

  useEffect(() => {
    return () => {
      fnRef.current.cancel();
    };
  }, []);

  return (
    <section className="bg-gray-200 md:px-3 px-1.5 py-8">
      <div className="max-w-7xl mx-auto space-y-3">
        <div className="flex items-center gap-2">
          <TextAlignStart strokeWidth={2.2} aria-hidden="true" size={26} />
          <h2 className="text-xl font-medium">Categories</h2>
        </div>

        <div className="relative overflow-x-clip">
          {/* indicators */}
          <>
            <button
              onClick={snapRight}
              className={`absolute left-0 bg-peach-soft/40 text-peach-ultra p-3 cursor-pointer hover:bg-peach-dark hover:text-white transition-colors duration-200 top-1/2 -translate-y-1/2 z-8888 ${scrolled.isAbsoluteLeft ? "hidden" : "block"} rounded-sm`}
            >
              <ChevronLeft />
            </button>
            <button
              onClick={snapLeft}
              className={`absolute right-0 bg-peach-soft/40 text-peach-ultra p-3 cursor-pointer hover:bg-peach-dark hover:text-white transition-colors duration-200 top-1/2 -translate-y-1/2 z-8888 ${scrolled.isAbsoluteRight ? "hidden" : "block"} rounded-sm`}
            >
              <ChevronRight />
            </button>
          </>

          {/* categories */}
          <ul
            ref={containerRef}
            onScroll={handleScroll}
            className="flex items-center gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          >
            {categories.map((category) => (
              <li
                ref={cardRef}
                key={category.id}
                className="max-w-50 bg-white p-2 text-center border border-gray-300 shrink-0 hover:border-transparent hover:shadow-md transition-all duration-200 snap-start"
              >
                <NavLink
                  className={"space-y-2"}
                  to={`/category?name=${category.qParam}`}
                >
                  <div>
                    <img
                      src={category.categoryImage}
                      loading="lazy"
                      fetchPriority="auto"
                      alt={`${category.categoryName} product`}
                    />
                  </div>
                  <div>
                    <h2 className="text-nowrap truncate">
                      {category.categoryName}
                    </h2>
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Categories;
