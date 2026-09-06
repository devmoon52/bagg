import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productSelector } from "../../redux/selectors/productSelector";
import {
  ArrowUpRight,
  BadgeCheck,
  BaggageClaim,
  ChartNoAxesCombined,
  Heart,
  Vote,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { toggle_like, update_cart } from "../../redux/slices/productSlice";
import DotLoader from "../DotLoader";
import { setSuccessMessage } from "../../redux/slices/globalSlice";
import { getDiscountedPrice } from "../../utils/services";

const TrendingProducts = () => {
  const [loading, setLoading] = useState(new Set());

  const { types } = useSelector(productSelector);
  const { trending } = types;
  const cart = useSelector((state) => state.products.cart);
  const purchaseHistory = useSelector(
    (state) => state.products.purchaseHistory,
  );

  const dispatch = useDispatch();
  const timerRef = useRef(null);

  // cart added map - check already cart added or not
  const cartAddedMap = useMemo(() => {
    let map = {};

    for (const product of cart) {
      map[product.id] = product;
    }
    return map;
  }, [cart]);

  // purchased product map
  const purchasedIdsMap = useMemo(() => {
    return new Set(purchaseHistory.productIDs);
  }, [purchaseHistory.productIDs]);

  // add like to product
  function addToLikedPro(id) {
    dispatch(toggle_like(id));
  }

  // add or remote from cart
  function addToCart(product, alreadyAdded) {
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
          msg: `${alreadyAdded ? "Product removed from cart !" : "Product added to cart !"}`,
        }),
      );
    }, 200);
  }

  // timer cleanup
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <section className="bg-gray-200 md:px-3 px-1.5 md:py-8 py-6">
      {/* container */}
      <div className="max-w-7xl mx-auto space-y-3">
        {/* header */}
        <div className="flex items-center gap-2">
          <ChartNoAxesCombined strokeWidth={2.2} aria-hidden="true" size={26} />
          <h2 className="text-xl font-medium">Trending Products</h2>
        </div>

        <ul className="flex flex-wrap gap-3">
          {trending.slice(0, 9).map((p) => {
            const isAdded = Boolean(cartAddedMap[p.id]);
            const isPurchased = purchasedIdsMap.has(p.id);

            return (
              <li key={p.id} className="bg-white space-y-1 basis-sm grow rounded-xl overflow-hidden shadow">
                <div className="w-full aspect-15/10 overflow-hidden relative group">
                  <img
                    src={p.image}
                    loading="lazy"
                    fetchPriority="low"
                    className="w-full h-full object-cover object-center"
                    alt={p.name}
                  />

                  {/* purchased check mark */}
                  {isPurchased && (
                    <div className="absolute left-2 top-2 flex items-center gap-1 bg-peach-soft shadow text-amber-900 px-3 py-2 rounded-full text-sm z-10">
                      <BadgeCheck size={18} />
                      <p>Purchased</p>
                    </div>
                  )}

                  {/* discount overlay */}
                  {p.discount > 0 && (
                    <div className="absolute bg-black/40 opacity-0 hover:opacity-100 inset-0 flex justify-center items-center transition-opacity duration-200">
                      <h2 className="text-2xl font-semibold text-white">
                        {p.discount}% OFF
                      </h2>
                    </div>
                  )}

                  {/* wishlist btn */}
                  <div className="absolute right-2 top-2">
                    <button
                      aria-label="Like a product"
                      onClick={() => addToLikedPro(p.id, p.liked)}
                      className={`h-10 w-10 rounded-full flex justify-center items-center cursor-pointer bg-white shadow ${p.liked ? "text-peach-ultra" : "text-black"}`}
                    >
                      <Heart
                        fill={p.liked ? "#ef6448" : "none"}
                        size={20}
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 px-3 py-3">
                  {/* title and description */}
                  <div>
                    <h3 className="text-lg">{p.name}</h3>
                    <p className="text-sm text-gray-600">
                      {p.shortDescription}
                    </p>
                  </div>

                  {/* discounted pricing */}
                  <div className="space-x-2">
                    <span className="text-2xl font-semibold">
                      ${getDiscountedPrice(p.price, p.discount)}
                    </span>
                    {p.discount > 0 && (
                      <span className="line-through text-gray-500">
                        ${p.price}
                      </span>
                    )}
                  </div>

                  {/* btns */}
                  <div className="flex gap-2">
                    <button
                      disabled={loading.has(p.id)}
                      onClick={() => addToCart(p, isAdded)}
                      className={`flex items-center justify-center gap-1  transition-colors duration-200 text-sm active:bg-green-sage border w-28.5 h-9.5 ${isAdded ? "bg-peach-light/40 text-peach-ultra border-peach-ultra" : "bg-green-pastel hover:bg-green-sage border-transparent"}`}
                    >
                      {loading.has(p.id) ? (
                        <DotLoader mode="bright" size="sm" />
                      ) : (
                        <>
                          {!isAdded ? (
                            <>
                              <BaggageClaim strokeWidth={1.6} size={22} />
                              <span>Add Cart</span>
                            </>
                          ) : (
                            <>
                              <Vote strokeWidth={1.6} size={22} />
                              <span>Added</span>
                            </>
                          )}
                        </>
                      )}
                    </button>
                    <NavLink to={`/type/trendings?proId=${p.id}`}>
                      <button className="flex items-center gap-1 border-green-sage active:bg-green-sage border px-3 py-2 hover:bg-green-sage transition-colors duration-200 text-sm">
                        View Details
                      </button>
                    </NavLink>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="pt-3">
          <NavLink
            to={"/type/trendings"}
            className={`inline-block text-peach-ultra hover:underline hover:text-peach-dark active:text-peach-dark active:underline`}
          >
            <span>Explore More Trending Products</span>
            <ArrowUpRight className="inline-block" />
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
