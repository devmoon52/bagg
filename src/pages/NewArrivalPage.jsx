import { Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import { productSelector } from "../redux/selectors/productSelector";
import { useEffect, useMemo, useRef, useState } from "react";
import ProductData from "../components/ProductData";
import ProductCard from "../components/ProductCard";
import { update_cart } from "../redux/slices/productSlice";
import { setSuccessMessage } from "../redux/slices/globalSlice";
import nProgress from "nprogress";

const NewArrivalPage = () => {
  const { types } = useSelector(productSelector);
  const [searchParams] = useSearchParams();
  const { cart } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(new Set());

  const proId = searchParams.get("proId");
  const { newArrival } = types;

  const dispacth = useDispatch();
  const timerRef = useRef(null);

  // progress bar set up for proId navigation
  useEffect(() => {
    nProgress.done();

    return () => {
      nProgress.start();
    };
  }, [proId]);

  // new arrivals map
  const newArrivalMap = useMemo(() => {
    let map = {};

    for (const product of newArrival) {
      map[product.id] = product;
    }

    return map;
  }, [newArrival]);

  // cart map
  const cartMap = useMemo(() => {
    let map = {};

    for (const product of cart) {
      map[product.id] = product;
    }

    return map;
  }, [cart]);

  // update cart fnc
  function updateShoppingCart(product) {
    setLoading((prev) => {
      const next = new Set(prev);

      next.add(product.id);
      return next;
    });

    timerRef.current = setTimeout(() => {
      dispacth(update_cart(product));
      setLoading((prev) => {
        const next = new Set(prev);

        next.delete(product.id);
        return next;
      });
      dispacth(
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

  const selected = newArrivalMap[proId] ? newArrivalMap[proId] : null;

  return (
    <main className={`md:space-y-10 space-y-8 ${selected && "md:my-8 my-6"}`}>
      <title>
        New arrivals | Bagg - explore new products
      </title>

      {/* product details */}
      {selected && (
        <section className="md:px-3 px-1.5">
          <div className="max-w-7xl mx-auto">
            <ProductData cartMap={cartMap} product={selected} />
          </div>
        </section>
      )}

      <section className="md:px-3 px-1.5 space-y-3 bg-gray-200 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-medium">
            {proId ? "Related new arrivals" : "New Arrivals"}
          </h2>
        </div>

        <ul className="max-w-7xl mx-auto flex flex-wrap gap-3">
          {newArrival.map((product) => {
            let current = product.id === proId;

            if (!current) {
              return (
                <li key={product.id} className="grow basis-sm bg-white shadow">
                  <ProductCard
                    updateCart={updateShoppingCart}
                    loading={loading}
                    cartMap={cartMap}
                    product={product}
                    relativeContainer={{
                      url: `/type/new-arrivals?proId=${product.id}`,
                    }}
                  />
                </li>
              );
            }
          })}
        </ul>
      </section>
    </main>
  );
};

export default NewArrivalPage;
