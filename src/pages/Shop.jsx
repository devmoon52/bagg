import { useDispatch, useSelector } from "react-redux";
import Header from "../components/sections/Header";
import { productSelector } from "../redux/selectors/productSelector";
import { categories } from "../data/category";
import { useEffect, useMemo, useRef, useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import { update_cart } from "../redux/slices/productSlice";
import { setSuccessMessage } from "../redux/slices/globalSlice";
import CategorySection from "../components/sections/CategorySection";
import { motion } from "motion/react";
import { debounce } from "../utils/optimize";

const Shop = () => {
  const [loading, setLoading] = useState(new Set());
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const calcProducts = useSelector(productSelector);
  const cart = useSelector((state) => state.products.cart);
  const categorySerial = Object.keys(calcProducts.categories);

  const dispatch = useDispatch();
  const timerRef = useRef(null);
  const dragRef = useRef(null);
  const isDraggingRef = useRef(false);

  // devide to slices according to ui
  function getSliced(list) {
    return {
      first4: list.slice(0, 4),
      second2: list.slice(4, 6),
      lastAll: list.slice(6),
    };
  }

  // category: {category obj} map
  const categoryNameMap = useMemo(() => {
    const map = {};

    for (const category of categories) {
      map[category.category] = category;
    }

    return map;
  }, [categories]);

  const cartAddedMap = useMemo(() => {
    return new Set(cart.map((product) => product.id));
  }, [cart]);

  // add cart btn action
  function addToCart(product) {
    setLoading((prev) => {
      const next = new Set(prev);
      next.add(product.id);

      return next;
    });

    timerRef.current = setTimeout(() => {
      dispatch(update_cart(product));
      dispatch(
        setSuccessMessage({
          id: product.id,
          msg: `Product ${cartAddedMap.has(product.id) ? "removed from" : "added to"} cart !`,
        }),
      );
      setLoading((prev) => {
        const next = new Set(prev);
        next.delete(product.id);

        return next;
      });
    }, 200);
  }

  // timeout cleanup
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  // drag constraints setup
  useEffect(() => {
    function handleResize() {
      const clientWidth = dragRef.current?.clientWidth;
      const scrollWidth = dragRef.current?.scrollWidth;

      const availableSpace = scrollWidth - clientWidth;
      setConstraints({ left: -availableSpace, right: 0 });
    }

    const debounceResize = debounce(handleResize, 200);
    handleResize();

    window.addEventListener("resize", debounceResize);

    return () => {
      window.removeEventListener("resize", debounceResize);
      debounceResize.cancel();
    };
  }, []);

  function getCategorySection(category) {
    const section = document.getElementById(category);

    section?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div>
      <title>Shop | Your online store experience</title>

      <ScrollToTop />
      <Header />

      <main className="space-y-8 md:space-y-10">
        <section className="md:px-3 px-1.5 border-b border-gray-300">
          {/* wrapper */}
          <div className="max-w-7xl mx-auto">
            <div className="overflow-hidden">
              <motion.div
                ref={dragRef}
                drag="x"
                dragConstraints={constraints}
                onDragStart={() => (isDraggingRef.current = true)}
                onDragEnd={() => (isDraggingRef.current = false)}
                className="flex"
              >
                {categorySerial.map((category, i) => (
                  <button
                    className="bg-white px-4 py-2 shrink-0 active:shadow-none active:border-transparent shadow border border-gray-200 hover:bg-gray-50 font-medium"
                    key={i}
                    onClick={() => {
                      if (isDraggingRef.current) return;

                      getCategorySection(category);
                    }}
                  >
                    {categoryNameMap[category]?.categoryName}
                  </button>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {categorySerial.map((category, i) => {
          const products = calcProducts.categories[category];
          const slices = getSliced(products);
          const cat = categoryNameMap[category];

          return (
            <CategorySection
              key={i}
              cat={cat}
              addToCart={addToCart}
              i={i}
              slices={slices}
              loading={loading}
              cartAddedMap={cartAddedMap}
            />
          );
        })}
      </main>
    </div>
  );
};

export default Shop;
