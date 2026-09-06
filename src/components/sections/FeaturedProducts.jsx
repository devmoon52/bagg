import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productSelector } from "../../redux/selectors/productSelector";
import { getDiscountedPrice } from "../../utils/services";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { debounce } from "../../utils/optimize";
import { toggle_like, update_cart } from "../../redux/slices/productSlice";
import DotLoader from "../DotLoader";
import { setSuccessMessage } from "../../redux/slices/globalSlice";
import { NavLink } from "react-router-dom";

const FeaturedProducts = () => {
  const { types } = useSelector(productSelector);
  const { featured } = types;
  const cart = useSelector((state) => state.products.cart);
  const [scrolled, setScrolled] = useState({
    isAbsoluteLeft: true,
    isAbsoluteRight: false,
  });
  const [loading, setLoading] = useState(new Set());

  const cardRef = useRef(null);
  const sliderRef = useRef(null);
  const fnRef = useRef(null);
  const timerRef = useRef(null);
  const dispatch = useDispatch();

  function moveRight() {
    const slider = sliderRef.current;
    const card = cardRef.current;

    if (!slider || !card) return;

    const cardWidth = card.scrollWidth;
    const gap = 3;

    slider.scrollBy({
      left: cardWidth + gap,
      behavior: "smooth",
    });
  }

  function moveLeft() {
    const slider = sliderRef.current;
    const card = cardRef.current;

    if (!slider || !card) return;

    const cardWidth = card.scrollWidth;
    const gap = 3;

    slider.scrollBy({
      left: -(cardWidth + gap),
      behavior: "smooth",
    });
  }

  if (!fnRef.current) {
    fnRef.current = debounce(() => {
      const scrollLeft = sliderRef.current.scrollLeft;
      const clientWidth = sliderRef.current.clientWidth;
      const scrollWidth = sliderRef.current.scrollWidth;

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

  // cart added map
  const cartAddedMap = useMemo(() => {
    let map = new Set(cart.map((p) => p.id));
    return map;
  }, [cart]);

  // add to cart fn
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

  return (
    <section className="md:px-3 px-1.5">
      {/* wrapper */}
      <div className="max-w-7xl mx-auto space-y-3">
        <div>
          <h2 className="sm:text-2xl text-xl font-semibold text-center">
            Featured Products
          </h2>
        </div>

        <div className="relative">
          {/* left and right moving */}
          <>
            {/* btn left */}
            {!scrolled.isAbsoluteLeft && (
              <button
                onClick={moveLeft}
                className="absolute top-1/3 left-0 -translate-y-1/2 h-12 w-12 flex justify-center items-center bg-peach-soft/40 text-peach-dark hover:text-white hover:bg-peach-dark transition-colors duration-200 rounded-sm cursor-pointer active:bg-peach-dark active:text-white z-50"
              >
                <ChevronLeft aria-hidden="true" />
              </button>
            )}

            {!scrolled.isAbsoluteRight && (
              <button
                onClick={moveRight}
                className="absolute top-1/3 right-0 -translate-y-1/2 h-12 w-12 flex justify-center items-center bg-peach-soft/40 text-peach-dark hover:bg-peach-dark hover:text-white transition-colors duration-200 rounded-sm cursor-pointer active:bg-peach-dark active:text-white z-50"
              >
                <ChevronRight aria-hidden="true" />
              </button>
            )}
          </>

          <ul
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-3 overflow-auto snap-x snap-mandatory scrollbar-hide"
          >
            {featured.map((product) => {
              const isAddedToCart = cartAddedMap.has(product.id);

              return (
                <li
                  ref={cardRef}
                  key={product.id}
                  className="sm:basis-86 basis-full shrink-0 snap-start space-y-3"
                >
                  <div className="w-full aspect-15/11 rounded-2xl overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="eager"
                      fetchPriority="auto"
                      className="h-full w-full object-cover object-center"
                    />

                    {/* like btn */}
                    <button
                      onClick={() => {
                        dispatch(toggle_like(product.id));
                      }}
                      className="absolute top-2 right-2 bg-white p-2.5 rounded-full cursor-pointer shadow"
                    >
                      <Heart
                        color={product.liked ? "#ef6448" : "black"}
                        fill={product.liked ? "#ef6448" : "none"}
                        size={20}
                        strokeWidth={1.8}
                      />
                    </button>
                  </div>
                  <div>
                    <h2 className="font-medium">{product.name}</h2>
                    <div className="space-x-1">
                      <span className="text-xl font-semibold">
                        ${getDiscountedPrice(product.price, product.discount)}
                      </span>
                      <del className="text-sm text-gray-600">
                        ${product.price}
                      </del>
                    </div>

                    {/* btns */}
                    <div className="flex gap-2 mt-1.5">
                      <button
                        disabled={loading.has(product.id)}
                        onClick={() => addToCart(product)}
                        className={`w-30 h-10 transition-colors duration-200 flex justify-center items-center ${isAddedToCart ? "border bg-peach-soft/40 text-peach-dark" : "bg-green-pastel hover:bg-green-sage"}`}
                      >
                        {loading.has(product.id) ? (
                          <DotLoader />
                        ) : isAddedToCart ? (
                          "Added"
                        ) : (
                          "Add Cart"
                        )}
                      </button>
                      <NavLink to={`/type/featured?proId=${product.id}`}>
                        <button className="border border-green-sage px-4 hover:bg-green-sage transition-colors duration-200 h-10">
                          View Detail
                        </button>
                      </NavLink>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
