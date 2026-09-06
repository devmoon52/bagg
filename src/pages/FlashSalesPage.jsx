import { useSearchParams } from "react-router-dom";
import ProductData from "../components/ProductData";
import { useMemo, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productSelector } from "../redux/selectors/productSelector";
import ProductCard from "../components/ProductCard";
import { update_cart } from "../redux/slices/productSlice";
import { setSuccessMessage } from "../redux/slices/globalSlice";
import nProgress from "nprogress";

const FlashSalesPage = () => {
  const [loading, setLoading] = useState(new Set());
  const [searchParams] = useSearchParams();

  const timerRef = useRef(null);
  const dispatch = useDispatch();

  const proId = searchParams.get("proId");

  const cart = useSelector((state) => state.products.cart);
  const { flashSales } = useSelector(productSelector);

  // progress bar set up for proId navigation
  useEffect(() => {
    nProgress.done();

    return () => {
      nProgress.start();
    };
  }, [proId]);

  // cart map
  const cartMap = useMemo(() => {
    let map = {};

    for (const product of cart) {
      map[product.id] = product;
    }

    return map;
  }, [cart]);

  // flash sales map
  const flashSalesMap = useMemo(() => {
    let map = {};

    for (const product of flashSales) {
      map[product.id] = product;
    }

    return map;
  }, [flashSales]);

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
          msg: `Product ${cartMap[product.id] ? "removed from" : "added to"} cart !`,
        }),
      );
    }, 200);
  }

  // clean-up timeout
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const selected = flashSalesMap[proId] ? flashSalesMap[proId] : null;

  return (
    <main
      className={`md:space-y-10 space-y-8 ${selected ? "md:my-8 my-6" : ""}`}
    >
      <title>Flash sales | Bagg - your e-commerce store</title>

      {selected && (
        <section className="md:px-3 px-1.5">
          {/* product detail */}
          <div className="max-w-7xl mx-auto">
            <ProductData cartMap={cartMap} product={selected} />
          </div>
        </section>
      )}

      <section className="md:px-3 px-1.5 bg-gray-200 py-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-medium">
              {selected ? "Related flash sales" : "Flash sales"}
            </h2>
          </div>

          <ul className="flex flex-wrap gap-3">
            {flashSales.map((product) => {
              let current = product.id === proId;

              if (!current) {
                return (
                  <li
                    key={product.id}
                    className="basis-sm grow bg-white shadow rounded-md overflow-hidden"
                  >
                    <ProductCard
                      product={product}
                      cartMap={cartMap}
                      loading={loading}
                      relativeContainer={{
                        url: `/flash-sales?proId=${product.id}`,
                      }}
                      updateCart={updateShoppingCart}
                    />
                  </li>
                );
              }
            })}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default FlashSalesPage;
