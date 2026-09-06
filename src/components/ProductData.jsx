import { BaggageClaim, DollarSign, Fullscreen, Vote, Zap } from "lucide-react";
import CountDown from "./CountDown";
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { update_cart } from "../redux/slices/productSlice";
import { setSuccessMessage } from "../redux/slices/globalSlice";
import DotLoader from "./DotLoader";
import { getDiscountedPrice } from "../utils/services";
import Preview from "./modals & toasts/Preview";
import { AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { update_checkout } from "../redux/slices/productSlice";

const ProductData = ({ product, cartMap }) => {
  const [loading, setLoading] = useState(new Set());
  const [previewImage, setPreviewImage] = useState(null);
  const checkout = useSelector((state) => state.products.checkout);

  const dispatch = useDispatch();
  const timerRef = useRef(null);
  const navigate = useNavigate();

  // updating cart fnc
  function updateCart(isAlreadyAdded) {
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
          msg: `Product ${isAlreadyAdded ? "removed from" : "added to"} cart !`,
        }),
      );
    }, 200);
  }

  // buy btn action
  function buyProduct() {
    dispatch(
      update_checkout({
        ...checkout,
        subtotal: getDiscountedPrice(product.price, product.discount),
        toPurchase: [product.id],
      }),
    );
    navigate("/checkout");
  }

  // timer cleanup
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="flex gap-3 items-center md:flex-row flex-col">
      <AnimatePresence>
        {previewImage && (
          <Preview
            image={previewImage}
            offPreview={() => {
              setPreviewImage(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* product image */}
      <div className="md:w-1/2 w-full aspect-4/3 relative overflow-hidden rounded-xl">
        <img
          src={product.image}
          alt={product.name}
          loading="eager"
          fetchPriority="high"
          className="h-full w-full object-cover object-center"
        />

        {/* countdown */}
        {product.flash.isFlash && (
          <div className="bg-peach-dark text-white flex md:hidden items-center justify-center text-lg font-medium w-30 h-10 absolute left-2 top-2">
            <CountDown time={product.flash.time} />
          </div>
        )}

        {/* full screen btn */}
        <div className="absolute right-2 top-2 z-10">
          <button
            aria-label="Preview product image"
            onClick={() => setPreviewImage(product.image)}
            className="bg-white h-10 w-10 flex items-center justify-center rounded-md group cursor-pointer active:border-gray-400 border border-transparent"
          >
            <Fullscreen
              strokeWidth={1.8}
              className="group-hover:h-6.5 group-hover:w-6.5 w-5.5 h-5.5"
            />
          </button>
        </div>
      </div>

      {/* product details */}
      <div className="md:w-1/2 w-full md:space-y-3 space-y-2">
        {/* countdown */}
        {product.flash.isFlash && (
          <div className="border border-peach-dark text-peach-dark md:flex hidden items-center justify-center text-lg font-medium w-30 h-10">
            <CountDown time={product.flash.time} />
          </div>
        )}

        {/* discounted and real price */}
        <div className="space-x-2 md:mt-4">
          <span className="text-3xl font-semibold">
            ${getDiscountedPrice(product.price, product.discount)}
          </span>
          {product.discount > 0 && (
            <span className="line-through text-gray-600">${product.price}</span>
          )}
        </div>

        {/* product name & description */}
        <div className="-space-y-0.5">
          <h2 className="text-lg md:text-xl font-medium">{product.name}</h2>
          <p className="text-gray-600 md:text-[16px] text-sm">
            {product.shortDescription}
          </p>
        </div>

        {/* flash and discount */}
        <div className="-space-y-0.5">
          <h3
            className={`italic items-center font-medium text-peach-ultra ${product.flash.isFlash ? "flex" : "hidden"}`}
          >
            <Zap size={20} />
            <span>Flash Sale</span>
          </h3>
          <p className="text-lg">{product.discount}% Discount</p>
        </div>

        {/* btns */}
        <div className="flex gap-3">
          <button
            onClick={buyProduct}
            className="bg-green-pastel active:bg-green-sage hover:bg-green-sage px-4 py-2 flex items-center gap-1"
          >
            <DollarSign size={20} strokeWidth={1.6} />
            <span>Buy</span>
          </button>
          <button
            disabled={loading.has(product.id)}
            onClick={() => updateCart(cartMap[product.id])}
            className={`border w-33 h-10.5 flex items-center justify-center gap-1 ${cartMap[product.id] ? "border-peach-dark text-peach-dark" : "border-green-pastel hover:bg-green-sage active:bg-green-sage "}`}
          >
            {loading.has(product.id) ? (
              <DotLoader />
            ) : cartMap[product.id] ? (
              <>
                <Vote size={22} strokeWidth={1.6} />
                <span>Added</span>
              </>
            ) : (
              <>
                <BaggageClaim size={22} strokeWidth={1.6} />
                <span>Add Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductData);
