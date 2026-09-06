import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/sections/Header";
import { FileSearchCorner, Fullscreen, Heart } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productSelector } from "../redux/selectors/productSelector";
import { categories } from "../data/category";
import { motion } from "motion/react";
import { debounce } from "../utils/optimize";
import DotLoader from "../components/DotLoader";
import Preview from "../components/modals & toasts/Preview";
import { AnimatePresence } from "motion/react";
import { getDiscountedPrice } from "../utils/services";
import { toggle_like, update_checkout } from "../redux/slices/productSlice";
import { update_cart } from "../redux/slices/productSlice";
import { setSuccessMessage } from "../redux/slices/globalSlice";

const categoryMap = categories.reduce((acc, category) => {
  acc[category.category] = category;
  return acc;
}, {});

const Search = () => {
  const { total } = useSelector(productSelector);
  const checkout = useSelector((state) => state.products.checkout);
  const cart = useSelector((state) => state.products.cart);
  const [searchParams] = useSearchParams();
  const searchFor = searchParams.get("result-for");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(new Set());

  const isDraggingRef = useRef(false);
  const sliderRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const [constraints, setConstraints] = useState({
    left: 0,
    right: 0,
  });
  const [currentCategor, setCurrentCategor] = useState("all");
  const [isDragable, setisDragable] = useState(true);

  // products result for search - query
  const result = useMemo(() => {
    const products = [];
    const categories = new Set();

    for (const product of total) {
      const name = product.name.toLowerCase();
      const category = product.category.toLowerCase();
      const query = searchFor.toLowerCase();

      if (name.includes(query) || category.includes(query)) {
        categories.add(product.category);
        products.push(product);
      }
    }

    return { products, categories };
  }, [searchFor, total]);

  // track search-query + update currentCategory
  useEffect(() => {
    setCurrentCategor("all");
  }, [searchFor]);

  // update constraints
  useEffect(() => {
    function handleResize() {
      const scrollWidth = sliderRef.current.scrollWidth;
      const clientWidth = sliderRef.current.clientWidth;

      if (scrollWidth <= clientWidth) {
        setisDragable(false);
      } else {
        setisDragable(true);
      }
      setConstraints({ right: 0, left: -(scrollWidth - clientWidth) });
    }

    handleResize();
    const debounced = debounce(handleResize, 200);

    window.addEventListener("resize", debounced);

    return () => {
      debounced.cancel();
      window.removeEventListener("resize", debounced);
    };
  }, [result.categories]);

  // derived filtered products
  const filteredProducts = useMemo(() => {
    if (currentCategor === "all") {
      return result.products;
    }

    const currentProducts = result.products.filter(
      (product) => product.category === currentCategor,
    );
    return currentProducts;
  }, [currentCategor, result.products]);

  // buy now action
  function buyAction(product) {
    const discountedPrice = getDiscountedPrice(product.price, product.discount);

    dispatch(
      update_checkout({
        ...checkout,
        subtotal: discountedPrice,
        toPurchase: [product.id],
      }),
    );
    navigate("/checkout");
  }

  // product-id cart map
  const productCartMap = useMemo(() => {
    return new Set(cart.map((product) => product.id));
  }, [cart]);

  // add or remote from cart
  function addToCart(product) {
    setLoading((prev) => {
      // start loading
      const next = new Set(prev);

      next.add(product.id);
      return next;
    });

    timerRef.current = setTimeout(() => {
      dispatch(update_cart(product)); // update cart
      setLoading((prev) => {
        // stop loading
        const next = new Set(prev);

        next.delete(product.id);
        return next;
      });
      dispatch(
        setSuccessMessage({
          id: product.id,
          msg: `${productCartMap.has(product.id) ? "Product removed from cart !" : "Product added to cart !"}`,
        }),
      );
    }, 200);
  }

  useEffect(() => {
    document.title = `${searchFor.slice(0, 15)} | Search result | Bagg`;
  }, [searchFor]);

  return (
    <div>
      <Header />

      <AnimatePresence>
        {preview && (
          <Preview image={preview} offPreview={() => setPreview(null)} />
        )}
      </AnimatePresence>

      <main className="md:my-8 my-6 md:space-y-8 space-y-6">
        <section className="md:px-3 px-1.5">
          {/* wrapper */}
          <div className="flex items-center gap-1 max-w-7xl mx-auto">
            <FileSearchCorner size={22} aria-hidden="true" />
            <h2 className="font-medium">Result For : {searchFor}</h2>
          </div>
        </section>

        <section className="md:px-3 px-1.5">
          {/* wrapper */}
          <div className="max-w-7xl mx-auto space-y-3">
            {/* categories */}
            <div className="overflow-x-hidden">
              <motion.ul
                drag={isDragable ? "x" : false}
                ref={sliderRef}
                onDragStart={() => (isDraggingRef.current = true)}
                onDragEnd={() => (isDraggingRef.current = false)}
                dragConstraints={constraints}
                className="flex gap-2"
              >
                <li className="shrink-0">
                  <button
                    onClick={() => {
                      if (isDraggingRef.current) return;
                      setCurrentCategor("all");
                    }}
                    className={`px-3 py-2 rounded-sm  shadow transition-colors duration-200 ${currentCategor === "all" ? "text-white bg-peach-dark" : "hover:bg-peach-soft/40 hover:text-peach-ultra bg-white "}`}
                  >
                    All
                  </button>
                </li>
                {Array.from(result.categories).map((category, i) => {
                  return (
                    <li key={i} className="shrink-0">
                      <button
                        onClick={() => {
                          if (isDraggingRef.current) return;
                          setCurrentCategor(category);
                        }}
                        className={`px-3 transition-colors duration-200 py-2 rounded-sm shadow ${currentCategor === category ? "bg-peach-dark text-white" : "hover:bg-peach-soft/40 hover:text-peach-ultra bg-white"}`}
                      >
                        {categoryMap[category].categoryName}
                      </button>
                    </li>
                  );
                })}
              </motion.ul>
            </div>

            {/* search result products */}
            <ul className="space-y-3">
              {filteredProducts?.map((product, i) => {
                return (
                  <li
                    key={product.id}
                    className="flex sm:items-center sm:flex-row flex-col sm:gap-3 bg-white sm:p-2 rounded-md shadow overflow-hidden "
                  >
                    {/* image */}
                    <div className="sm:basis-70 shrink-0 sm:rounded-lg overflow-hidden sm:aspect-15/11 aspect-video relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading={i > 4 ? "eager" : "lazy"}
                        fetchPriority={i > 4 ? "high" : "auto"}
                        className="h-full w-full object-cover object-center"
                      />

                      <button
                        onClick={() => setPreview(product.image)}
                        className="absolute top-2 right-2 group bg-white w-8 h-8 flex justify-center items-center rounded-md shadow cursor-pointer"
                      >
                        <Fullscreen
                          size={20}
                          strokeWidth={1.8}
                          aria-hidden="true"
                          className="group-hover:scale-105"
                        />
                      </button>
                      <button
                        onClick={() => dispatch(toggle_like(product.id))}
                        className="absolute top-2 right-12 bg-white w-8 h-8 flex justify-center items-center rounded-md shadow cursor-pointer"
                      >
                        <Heart
                          size={20}
                          strokeWidth={1.8}
                          aria-hidden="true"
                          color={product.liked ? "#f8785f" : "black"}
                          fill={product.liked ? "#f8785f" : "none"}
                        />
                      </button>
                    </div>

                    {/* content */}
                    <div className="px-3 py-2">
                      <h2 className="text-lg font-medium">{product.name}</h2>
                      <p className="text-gray-600 text-sm sm:block hidden">
                        {product.shortDescription}
                      </p>

                      <div className="space-x-1.5 sm:mt-2">
                        <span className="font-medium text-lg">
                          ${getDiscountedPrice(product.price, product.discount)}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-sm text-gray-600 line-through">
                            ${product.price}
                          </span>
                        )}
                      </div>

                      {/* btns */}
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => buyAction(product)}
                          className="px-4 text-sm py-2 bg-green-pastel sm:rounded-full rounded-md hover:bg-green-sage transition-colors duration-200 active:bg-green-sage"
                        >
                          Buy Now
                        </button>
                        <button
                          disabled={loading.has(product.id)}
                          onClick={() => addToCart(product)}
                          className={`w-24.5 h-9.5 text-sm border flex justify-center items-center sm:rounded-full rounded-md transition-colors duration-200 ${productCartMap.has(product.id) ? "border-peach-dark text-peach-dark bg-peach-soft/40" : "border-green-sage hover:bg-green-sage"}`}
                        >
                          {loading.has(product.id) ? (
                            <DotLoader size="sm" />
                          ) : productCartMap.has(product.id) ? (
                            "Added"
                          ) : (
                            "Add Cart"
                          )}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Search;
