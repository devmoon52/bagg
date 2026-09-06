import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { productSelector } from "../../redux/selectors/productSelector";
import CountDown from "../CountDown";
import { getDiscountedPrice } from "../../utils/services";
import { update_checkout } from "../../redux/slices/productSlice";
import { useNavigate, NavLink } from "react-router-dom";

const containerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};
const child1 = {
  hidden: {
    x: -10,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
};

const FlashSale = () => {
  const { flashSales } = useSelector(productSelector);
  const checkout = useSelector((state) => state.products.checkout);

  const [productIndex, setProductIndex] = useState(0);
  const product = flashSales[productIndex];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setProductIndex((prev) => {
        if (prev < flashSales.length - 1) {
          return prev + 1;
        } else {
          return 0;
        }
      });
    }, 20 * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [productIndex]);

  // buy action
  function buyAction() {
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

  return (
    <section className="md:px-3 px-1.5">
      {/* container */}
      <div className="max-w-7xl mx-auto flex gap-3 md:flex-row flex-col-reverse">
        {/* flash news */}
        <div className="md:space-y-2">
          <h2 className="font-bold md:space-x-0 space-x-2">
            <span className="lg:text-7xl md:text-6xl text-4xl">Exclusive</span>
            <br className="md:block hidden" />
            <span className="lg:text-9xl md:text-8xl text-4xl text-peach-ultra after:w-[70%] after:absolute after:h-2 relative md:after:block after:hidden after:bg-peach-ultra after:bottom-4 after:left-0">
              Offers
            </span>
          </h2>
          <p className="md:hidden block text-gray-600">
            Visite our Exclusive, Flash Sale offers and get up to 50% discount.
          </p>

          <NavLink to={"/flash-sales"}>
            <button className="md:mt-8 mt-3 px-4.5 py-2.5 bg-green-pastel font-semibold cursor-pointer hover:bg-green-sage transition-colors duration-200">
              View More Offers
            </button>
          </NavLink>
        </div>

        {/* flash image and content */}
        <motion.div
          key={productIndex}
          variants={containerVariant}
          initial="hidden"
          animate="visible"
          className="grow md:aspect-4/2 aspect-4/3 rounded-md overflow-hidden relative"
        >
          {/* product image */}
          <img
            loading="lazy"
            fetchPriority="auto"
            src={product.flash.flashBanner}
            className="h-full w-full object-cover object-center"
            alt={product.name}
          />

          {/* countdown */}
          <div className="bg-white w-35 h-14 rounded-full absolute right-3 top-3 flex items-center justify-center z-10 text-lg">
            <CountDown time={product.flash.time} />
          </div>

          {/* overlay effect */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

          {/* product data */}
          <div className="absolute bottom-3 left-3 text-white pr-3">
            <motion.div variants={child1}>
              <h3 className="text-3xl font-bold">{product.discount}% OFF</h3>
            </motion.div>
            <div className="-space-y-0.5">
              <motion.h2 variants={child1} className="font-semibold">
                {product.name}
              </motion.h2>
              <motion.p variants={child1} className="text-sm">
                {product.shortDescription}
              </motion.p>
            </div>
            <motion.div variants={child1} className="flex gap-3 mt-2">
              <button
                onClick={buyAction}
                className="bg-peach-soft/40 text-peach-dark px-3 py-2 cursor-pointer hover:bg-peach-dark hover:text-white transition-colors duration-200 text-sm font-semibold"
              >
                Buy Now
              </button>
              <NavLink to={`/flash-sales?proId=${product.id}`}>
                <button className="bg-p border border-peach-light py-2 px-3 cursor-pointer text-peach-dark hover:bg-peach-dark hover:text-white transition-colors duration-200 text-sm font-semibold">
                  View Details
                </button>
              </NavLink>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FlashSale;
