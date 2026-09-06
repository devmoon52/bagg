import { useLocation, useSearchParams } from "react-router-dom";
import Header from "../components/sections/Header";
import { categories } from "../data/category";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productSelector } from "../redux/selectors/productSelector";
import ProductCard from "../components/ProductCard";
import ProductData from "../components/ProductData";
import ScrollToTop from "../components/ScrollToTop";
import { setSuccessMessage } from "../redux/slices/globalSlice";
import { update_cart } from "../redux/slices/productSlice";
import nProgress from "nprogress";

const CategoryWise = () => {
  const product = useSelector(productSelector);
  const cart = useSelector((state) => state.products.cart);
  const [loading, setLoading] = useState(new Set());
  const { pathname, search } = useLocation();

  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const proId = searchParams.get("proId");

  const timerRef = useRef(null);
  const dispatch = useDispatch();

  // progressbar
  useEffect(() => {
    nProgress.done();

    return () => {
      nProgress.start();
    };
  }, [pathname, search]);

  // category map
  const categoryMap = useMemo(() => {
    const map = {};

    for (const category of categories) {
      map[category.qParam] = category;
    }

    return map;
  }, [categories]);

  const currentCategory = categoryMap[name];
  const currentCategoryProducts =
    product.categories[currentCategory?.category] || [];

  // products map on category
  const categoryProductsMap = useMemo(() => {
    const map = {};

    for (const product of currentCategoryProducts) {
      map[product.id] = product;
    }

    return map;
  }, [currentCategoryProducts]);

  // cart map
  const cartMap = useMemo(() => {
    let map = {};

    for (const product of cart) {
      map[product.id] = product;
    }

    return map;
  }, [cart]);

  // update cart fn
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

  // cleanup timeout
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const selected = categoryProductsMap[proId] || null;

  useEffect(() => {
    document.title = `${currentCategory?.categoryName} | Category products - bagg`;
  }, [currentCategory.categoryName]);

  return (
    <div>
      <ScrollToTop />
      <Header />

      <main
        className={`${selected ? "my-6 md:my-8" : ""} md:space-y-10 space-y-8`}
      >
        {selected && (
          <section className="md:px-3 px-1.5">
            <div className="max-w-7xl mx-auto">
              <ProductData cartMap={cartMap} product={selected} />
            </div>
          </section>
        )}

        <section className="bg-gray-200 md:px-3 px-1.5 md:py-8 py-6">
          {/* wrapper */}
          <div className="max-w-7xl mx-auto space-y-3">
            {currentCategory && (
              <div className="flex items-center gap-1.5">
                <currentCategory.Icon size={27} />
                <h2 className="text-xl font-medium">
                  {currentCategory.categoryName}
                </h2>
              </div>
            )}

            <ul className="shadow-md flex flex-wrap gap-3">
              {currentCategoryProducts.map((product) => {
                const isOpened = product.id === selected?.id;

                if (!isOpened) {
                  return (
                    <li
                      key={product.id}
                      className="bg-white basis-sm grow shadow rounded-md overflow-hidden"
                    >
                      <ProductCard
                        product={product}
                        cartMap={cartMap}
                        loading={loading}
                        updateCart={updateShoppingCart}
                        relativeContainer={{
                          url: `/category?name=${currentCategory?.qParam}&proId=${product.id}`,
                        }}
                      />
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CategoryWise;
