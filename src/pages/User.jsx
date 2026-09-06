import Header from "../components/sections/Header";
import { useSelector } from "react-redux";
import { getDiscountedPrice } from "../utils/services";
import {
  ChevronLeft,
  ChevronRight,
  FileHeart,
  Receipt,
  ShoppingCart,
} from "lucide-react";
import { productSelector } from "../redux/selectors/productSelector";
import { useMemo, useRef, useEffect, useState } from "react";
import { debounce } from "../utils/optimize";
import products from "../assets/images/products.jpg";
import Shipping from "../components/sections/Shipping";

const User = () => {
  const purchaseHistory = useSelector(
    (state) => state.products.purchaseHistory,
  );
  const { wishlist, total } = useSelector(productSelector);
  const cart = useSelector((state) => state.products.cart);

  const [scrolled, setScrolled] = useState({
    isAbsoluteLeft: true,
    isAbsoluteRight: false,
  });

  const cardRef = useRef(null);
  const fnRef = useRef(null);
  const sliderRef = useRef(null);

  const quickStats = [
    {
      id: 1,
      Icon: Receipt,
      name: "Total Orders",
      count: purchaseHistory.history.length,
    },
    {
      id: 2,
      Icon: FileHeart,
      name: "Wishlist",
      count: wishlist.length,
    },
    {
      id: 3,
      Icon: ShoppingCart,
      name: "My Cart",
      count: cart.length,
    },
  ];

  // purchase items map
  const purchasedItemsMap = useMemo(() => {
    const ids = new Set(purchaseHistory.productIDs);

    return total.filter((product) => ids.has(product.id));
  }, [purchaseHistory.productIDs]);

  // get returning fn on debounce
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

  // move right
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

  // move left
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

  // handle scroll fnc
  function handleScroll() {
    fnRef.current();
  }

  // cleanup timer on debounce
  useEffect(() => {
    return () => {
      fnRef.current.cancel();
    };
  }, []);

  return (
    <div>
      <title>
        John Doe | User account | Bagg - manage products
      </title>

      <Header />
      <main className="space-y-8">
        {/* user data */}
        <section className="max-w-7xl mx-auto space-y-5 relative py-8 md:px-3 px-1.5 overflow-hidden">
          {/* bg image */}
          <img
            src={products}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
            alt="E-commerce products & user data background"
          />
          <div className="bg-black/10 absolute inset-0 h-full w-full -z-10" />

          {/* avatar and user data */}
          <div className="flex justify-start">
            <div className="bg-white/40 backdrop-blur-sm border border-gray-400/50 rounded-lg overflow-hidden flex items-center">
              <div className="sm:w-22 w-18 h-full flex justify-center items-center sm:text-3xl text-2xl font-bold border-r border-gray-400/50">
                JD
              </div>
              <div className="py-3 px-4">
                <h1 className="sm:text-2xl text-xl font-semibold">
                  John Doe
                </h1>
                <p className="sm:text-[16px] text-sm font-medium text-gray-600">
                  johndoe1122@gmail.com
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickStats.map((stats) => {
              return (
                <div
                  key={stats.id}
                  className="bg-white/40 backdrop-blur-sm border border-gray-400/50 px-3 py-2 rounded-md space-y-2 basis-70 grow"
                >
                  <div className="flex items-center gap-1.5">
                    <stats.Icon size={22} />
                    <h2 className=" font-medium">{stats.name}</h2>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-700 text-lg font-medium">
                      {stats.count}
                    </p>
                    <span className="text-gray-700">Last Week</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="md:px-3 px-1.5">
          {/* wrapper */}
          <div className="max-w-7xl mx-auto space-y-2">
            <div>
              <h2 className="text-xl font-medium">Recent orders</h2>
            </div>
            <ul className="space-y-2">
              {purchaseHistory.history.length === 0 && (
                <li className="font-medium text-gray-600 sm:text-[16px] text-sm">
                  No recent orders !
                </li>
              )}
              {purchaseHistory.history.map((history, i) => {
                const date = new Date(history.purchaseTime).toLocaleString();
                return (
                  <li
                    key={i + 1}
                    className="bg-white px-3 py-2 rounded-md shadow space-y-2"
                  >
                    <div>
                      <p className="font-medium text-gray-600">{date}</p>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Full name:</span>{" "}
                        {history.firstName} {history.lastName}
                      </p>
                      <p>
                        <span className="font-medium">Total cost:</span> $
                        {history.grantTotal}
                      </p>
                      <p>
                        <span className="font-medium">Card:</span>{" "}
                        {history.cardNumber}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span>{" "}
                        {history.address} <mark>{history.postCode}</mark> ||{" "}
                        {history.country}
                      </p>
                      <p>
                        <span className="font-medium">Contact:</span>{" "}
                        {history.email} || {history.phone}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <div className="md:px-3 px-1.5">
          <hr className="max-w-7xl mx-auto border-t border-gray-300" />
        </div>

        <section className="md:px-3 px-1.5">
          <div className="max-w-7xl mx-auto space-y-2">
            <div>
              <h2 className="text-xl font-medium">Purchased items</h2>
            </div>

            <div className="relative">
              {/* btns */}
              {purchasedItemsMap?.length > 0 && (
                <>
                  {/* btn left */}
                  {!scrolled.isAbsoluteLeft && (
                    <button
                      onClick={moveLeft}
                      className="absolute top-1/2 left-0 -translate-y-1/2 h-12 w-12 flex justify-center items-center bg-peach-soft/40 text-peach-dark hover:text-white hover:bg-peach-dark transition-colors duration-200 rounded-sm cursor-pointer active:bg-peach-dark active:text-white z-50"
                    >
                      <ChevronLeft aria-hidden="true" />
                    </button>
                  )}

                  {!scrolled.isAbsoluteRight && (
                    <button
                      onClick={moveRight}
                      className="absolute top-1/2 right-0 -translate-y-1/2 h-12 w-12 flex justify-center items-center bg-peach-soft/40 text-peach-dark hover:bg-peach-dark hover:text-white transition-colors duration-200 rounded-sm cursor-pointer active:bg-peach-dark active:text-white z-50"
                    >
                      <ChevronRight aria-hidden="true" />
                    </button>
                  )}
                </>
              )}

              <ul
                onScroll={handleScroll}
                ref={sliderRef}
                className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
              >
                {purchasedItemsMap?.length === 0 && (
                  <li className="font-medium text-gray-600 sm:text-[16px] text-sm">
                    No purchased items !
                  </li>
                )}
                {purchasedItemsMap?.map((product) => {
                  return (
                    <li
                      key={product.id}
                      ref={cardRef}
                      className="shrink-0 basis-80 aspect-15/11 overflow-hidden rounded-lg relative snap-start"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        fetchPriority="high"
                        loading="eager"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

                      <div className="absolute z-10 text-white bottom-2 left-2">
                        <h2 className="text-xl font-medium">
                          ${getDiscountedPrice(product.price, product.discount)}
                        </h2>
                        <h3 className="">{product.name}</h3>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        <div className="md:px-3 px-1.5">
          <hr className="max-w-7xl mx-auto border-t border-gray-300" />
        </div>

        <Shipping />
      </main>
    </div>
  );
};

export default User;
