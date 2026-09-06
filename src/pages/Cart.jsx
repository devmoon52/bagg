import { useState } from "react";
import Header from "../components/sections/Header";
import { useDispatch, useSelector } from "react-redux";
import Preview from "../components/modals & toasts/Preview";
import { Fullscreen, Receipt } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { getDiscountedPrice } from "../utils/services";
import { update_checkout, update_cart } from "../redux/slices/productSlice";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, checkout } = useSelector((state) => state.products);

  const [previewImage, setPreviewImage] = useState(null);
  const [productQuantity, setProductQuantity] = useState(
    cart.reduce((acc, product) => {
      acc[product.id] = 1;
      return acc;
    }, {}),
  );

  // increase total price
  function increase(productID) {
    setProductQuantity((prev) => {
      return {
        ...prev,
        [productID]: prev[productID] + 1,
      };
    });
  }

  // decrease product quantity
  function decrease(productID) {
    setProductQuantity((prev) => {
      return {
        ...prev,
        [productID]: Math.max(1, prev[productID] - 1),
      };
    });
  }

  // total price calculation
  function getTotalPrice() {
    const total = cart.reduce((acc, product) => {
      const price = getDiscountedPrice(product.price, product.discount);
      return acc + productQuantity[product.id] * price;
    }, 0);

    return +total.toFixed(2);
  }

  console.log(checkout);

  function checkoutAction() {
    const totalPrice = getTotalPrice();
    const toPurchase = cart.map((p) => p.id);

    dispatch(
      update_checkout({
        ...checkout,
        subtotal: totalPrice,
        toPurchase,
      }),
    );
    navigate("/checkout");
  }

  return (
    <div>
      <title>Cart | My cart added products.</title>

      <ScrollToTop />
      <Header />

      {/* preview image */}
      <AnimatePresence>
        {previewImage && (
          <Preview
            image={previewImage}
            offPreview={() => setPreviewImage(null)}
          />
        )}
      </AnimatePresence>

      <main className="md:space-y-10 space-y-6 md:my-8 my-6">
        <section className="md:px-3 px-1.5">
          {/* wrapper */}
          <div className="max-w-7xl mx-auto space-y-3">
            <div>
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
            </div>

            {cart.length === 0 && (
              <div className="text-gray-600">
                <h2 className="text-lg font-medium">Empty shopping cart !</h2>
                <p>Please add some products to purchase something.</p>
              </div>
            )}

            {cart.length > 0 && (
              <div className="flex gap-3 flex-wrap-reverse items-end">
                {/* products */}
                <div className="grow-3 basis-sm">
                  <ul>
                    {cart.map((product, i) => (
                      <li
                        key={product.id}
                        className={`${i !== cart.length - 1 && "border-b"} border-gray-300 py-3 flex gap-3 items-center`}
                      >
                        {/* image */}
                        <div className="max-w-40 w-full aspect-square relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                          <button
                            onClick={() => setPreviewImage(product.image)}
                            className="absolute top-1 right-1 bg-white w-6 h-6 flex justify-center items-center group cursor-pointer"
                          >
                            <Fullscreen
                              className="group-hover:scale-105"
                              size={18}
                              strokeWidth={1.4}
                            />
                          </button>
                        </div>

                        {/* product details */}
                        <div className="space-y-1">
                          <h3 className="text-lg font-medium">
                            {product.name}
                          </h3>

                          {/* price and discount */}
                          <div>
                            <p className="text-sm text-gray-600">
                              <b>
                                $
                                {getDiscountedPrice(
                                  product.price,
                                  product.discount,
                                )}
                              </b>{" "}
                              insted of <b>${product.price}</b>
                            </p>
                            <p className="text-gray-600 text-sm">
                              Discount: {product.discount}%
                            </p>
                          </div>

                          {/* quantity */}
                          <div className="flex gap-3 items-center text-sm">
                            <h2>Quantity:</h2>
                            <div className="border-b-2 flex items-center gap-2">
                              <button
                                onClick={() => decrease(product.id)}
                                className="cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-10 flex justify-center items-center">
                                {productQuantity[product.id]}
                              </span>
                              <button
                                onClick={() => increase(product.id)}
                                className="cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* remove btn */}
                          <div className="text-sm">
                            <button
                              onClick={() => {
                                dispatch(update_cart(product));
                              }}
                              className="text-red-500 hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prices and details */}
                <div className="grow basis-75 bg-white shadow-md px-2 py-3">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Prices & Details</h3>

                    {/* product prices */}
                    <ul className="text-sm space-y-0.5">
                      {cart.map((product) => (
                        <li
                          key={product.id}
                          className="flex items-center gap-1"
                        >
                          <div className="h-2 w-2 rounded-full border border-gray-400" />
                          <p className="text-gray-600">
                            {productQuantity[product.id]} x $
                            {getDiscountedPrice(
                              product.price,
                              product.discount,
                            )}
                          </p>
                        </li>
                      ))}
                    </ul>

                    {/* subtotal price */}
                    <div>
                      <h2 className="text-gray-600">
                        Subtotal{" "}
                        <span className="font-semibold text-black">
                          ${getTotalPrice()}
                        </span>
                      </h2>
                    </div>

                    {/* checkout btn */}
                    <div className="mt-10">
                      <button
                        onClick={checkoutAction}
                        className="bg-peach-soft/40 text-peach-ultra rounded-full text-sm hover:bg-peach-dark hover:text-white cursor-pointer transition-colors duration-200 flex items-center gap-1 h-9 w-55 justify-center"
                      >
                        <Receipt size={18} strokeWidth={1.8} />
                        <span>Checkout Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Cart;
