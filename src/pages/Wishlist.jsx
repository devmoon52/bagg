import { useDispatch, useSelector } from "react-redux";
import Header from "../components/sections/Header";
import { productSelector } from "../redux/selectors/productSelector";
import { FileHeart, Fullscreen } from "lucide-react";
import { getDiscountedPrice } from "../utils/services";
import { useEffect, useMemo, useRef, useState } from "react";
import Preview from "../components/modals & toasts/Preview";
import { AnimatePresence, hover } from "motion/react";
import { debounce } from "../utils/optimize";
import {
  toggle_like,
  update_checkout,
  update_cart,
} from "../redux/slices/productSlice";
import ScrollToTop from "../components/ScrollToTop";
import { useNavigate } from "react-router-dom";
import { setSuccessMessage } from "../redux/slices/globalSlice";
import DotLoader from "../components/DotLoader";

const Wishlist = () => {
  const { wishlist } = useSelector(productSelector);
  const checkout = useSelector((state) => state.products.checkout);
  const cart = useSelector((state) => state.products.cart);

  const [previewImage, setPreviewImage] = useState(null);
  const [opened, setOpened] = useState(null);
  const [loading, setLoading] = useState(new Set());

  // for re-render component
  const [isTouchDevice, setIsTouchDevice] = useState(
    window.matchMedia("(pointer: coarse)").matches,
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // close detail box on outside click
  useEffect(() => {
    function handleClick() {
      if (!isTouchDevice) return;
      setOpened(null);
    }

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [isTouchDevice]);

  // resize event for matchMedia
  useEffect(() => {
    function handleResize() {
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      setIsTouchDevice(isTouch);
    }

    const debounced = debounce(handleResize, 200);
    window.addEventListener("resize", debounced);

    return () => {
      window.removeEventListener("resize", debounced);
      debounced.cancel();
    };
  }, []);

  // buy btn action
  function buyProduct(product) {
    dispatch(
      update_checkout({
        ...checkout,
        subtotal: getDiscountedPrice(product.price, product.discount),
        toPurchase: [product.id],
      }),
    );
    navigate("/checkout");
  }

  const cartMap = useMemo(() => {
    return new Set(cart.map((product) => product.id));
  }, [cart]);

  // update cart fnc
  function updateShoppingCart(product) {
    setLoading((prev) => {
      const next = new Set(prev);

      next.add(product.id);
      return next;
    });

    timerRef.current = setTimeout(() => {
      dispatch(update_cart(product));
      setLoading((prev) => {
        const next = new Set(prev);

        next.delete(product.id);
        return next;
      });
      dispatch(
        setSuccessMessage({
          id: product.id,
          msg: `Product ${cartMap.has(product.id) ? "removed from" : "added to"} cart !`,
        }),
      );
    }, 200);
  }

  // timeout cleanup
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div>
      <title>
        Wishlist | Bagg - wishlist products
      </title>

      <ScrollToTop />
      <Header />

      <AnimatePresence>
        {previewImage && (
          <Preview
            image={previewImage}
            offPreview={() => setPreviewImage(null)}
          />
        )}
      </AnimatePresence>

      <main className="space-y-8 md:my-8 my-6">
        <section className="md:px-3 px-1.5">
          {/* wrapper */}
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-1">
              <FileHeart aria-hidden="true" size={25} strokeWidth={2.6} />
              <h1 className="text-xl font-semibold">Wishlist</h1>
            </div>
            {wishlist.length === 0 && (
              <div className="mt-4 text-gray-600">
                <h2 className="font-medium text-lg">Wishlist is empty !</h2>
                <p>Explore products and add to wishlist.</p>
              </div>
            )}
          </div>
        </section>
        <section className="md:px-3 px-1.5">
          {/* wrapper */}
          <div className="max-w-7xl mx-auto">
            <ul className="flex gap-3 flex-wrap">
              {wishlist.map((product) => {
                return (
                  <li key={product.id} className="basis-70 grow">
                    {/* card container */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isTouchDevice) return;
                        setOpened(product.id);
                      }}
                      className="w-full aspect-square rounded-lg overflow-hidden relative shadow group"
                    >
                      {/* image */}
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        fetchPriority="low"
                        className={`h-full w-full object-cover object-center group-hover:-translate-y-27 transition-transform duration-300 z-11 relative ${opened === product.id ? "-translate-y-27" : "translate-y-0"}`}
                      />

                      {/* remove btn */}
                      <button
                        onClick={() => {
                          dispatch(toggle_like(product.id));
                        }}
                        className="absolute right-2 top-2 bg-peach-ultra text-white rounded-full text-sm shadow hover:bg-peach-dark cursor-pointer transition-colors duration-200 w-22.5 h-9 flex justify-center items-center z-12"
                      >
                        Remove
                      </button>

                      {/* preview btn */}
                      <button
                        onClick={() => setPreviewImage(product.image)}
                        className="absolute top-2 left-2 bg-peach-ultra h-9 w-9 flex justify-center items-center text-white group/btn rounded-md cursor-pointer hover:bg-peach-dark shadow z-12"
                      >
                        <Fullscreen
                          className="group-hover/btn:scale-110"
                          size={20}
                          aria-hidden="true"
                          strokeWidth={1.7}
                        />
                      </button>

                      {/* product details */}
                      <div className="bg-white absolute bottom-0 w-full py-2 px-3 z-10">
                        <h2 className="font-medium">{product.name}</h2>
                        <div className="space-x-1">
                          <span className="text-xl font-semibold">
                            $
                            {getDiscountedPrice(
                              product.price,
                              product.discount,
                            )}
                          </span>
                          {product.discount > 0 && (
                            <span className="text-sm text-gray-600 line-through">
                              ${product.price}
                            </span>
                          )}
                        </div>

                        {/* btns - buy, add to cart */}
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => buyProduct(product)}
                            className="bg-green-pastel text-sm px-4 py-1.5 rounded-full hover:bg-green-sage"
                          >
                            Buy
                          </button>
                          <button
                            disabled={loading.has(product.id)}
                            onClick={() => updateShoppingCart(product)}
                            className={`text-sm w-24 h-8 rounded-full  flex justify-center items-center ${cartMap.has(product.id) ? "bg-peach-soft/40 border border-peach-dark text-peach-dark" : "bg-green-pastel hover:bg-green-sage"}`}
                          >
                            {loading.has(product.id) ? (
                              <DotLoader size="sm" />
                            ) : cartMap.has(product.id) ? (
                              "Added"
                            ) : (
                              "Add Cart"
                            )}
                          </button>
                        </div>
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

export default Wishlist;
