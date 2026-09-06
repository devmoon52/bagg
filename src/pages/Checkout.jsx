import {
  BadgeCheck,
  ChevronDown,
  CircleCheck,
  ContactRound,
  CornerUpLeft,
  CreditCard,
  HandCoins,
  MapPinHouse,
  ReceiptText,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AnimatePresence } from "motion/react";
import FieldErr from "../components/modals & toasts/FieldErr";
import { useEffect, useMemo, useRef } from "react";
import {
  confirm_purchase,
  raset_cart,
  raset_checkout,
} from "../redux/slices/productSlice";
import { setSuccessMessage } from "../redux/slices/globalSlice";
import DotLoader from "../components/DotLoader";
import ScrollToTop from "../components/ScrollToTop";
import { add_notification } from "../redux/slices/notificationSlice";

const Checkout = () => {
  const { checkout, purchaseHistory, cart } = useSelector(
    (state) => state.products,
  );

  const dispatch = useDispatch();
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  // shipping by country map
  const countryShippingMap = useMemo(() => {
    let map = {};

    for (const countryData of checkout.countryOptions) {
      map[countryData.name] = countryData;
    }

    return map;
  }, [checkout.countryOptions]);

  // watching country
  const selectedCountry = watch("country");

  // submit datas
  function submitData(data) {
    const dataToSubmit = {
      ...data,
      grantTotal:
        checkout.subtotal + countryShippingMap[selectedCountry]?.shipping,
    };

    return new Promise((resolve) => {
      timerRef.current = setTimeout(() => {
        const productIDs = [
          ...new Set([...purchaseHistory.productIDs, ...checkout.toPurchase]),
        ];
        // purchase history & set notification
        dispatch(
          confirm_purchase({
            products: productIDs,
            history: dataToSubmit,
          }),
        );
        dispatch(
          add_notification({
            id: Date.now(),
            icon: "checkCircle",
            heading: "Order created successfully",
            message: `Your order has been created successfully on $${dataToSubmit.grantTotal}. We’ll start processing it shortly.`,
            date: "1",
            dateType: "day",
            isNew: true,
          }),
        );

        // raset cart and checkout
        dispatch(raset_cart());
        dispatch(raset_checkout());

        // popup success message
        dispatch(
          setSuccessMessage({
            id: "order",
            msg: "Order has been created successfully !",
          }),
        );
        // navigation
        navigate("/");

        resolve();
      }, 1000);
    });
  }

  // timeout clean-up
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div>
      <title>Checkout | Purchase your products</title>

      {/* header */}
      <ScrollToTop />
      <header className="md:px-3 px-1.5 border-b border-gray-300">
        <div className="max-w-7xl mx-auto py-3.5 flex">
          <NavLink
            to={-1}
            className={`flex items-center gap-1 cursor-pointer hover:underline`}
          >
            <CornerUpLeft size={20} strokeWidth={1.8} />
            <h3>Go Back</h3>
          </NavLink>
        </div>
      </header>

      <main className="mt-6 mb-12 md:px-3 px-1.5">
        <form
          onSubmit={handleSubmit(submitData)}
          className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-start gap-3 space-y-6"
        >
          <aside className="grow-3 basis-sm md:space-y-10 space-y-6">
            {/* contact information section */}
            <section className="space-y-2">
              <div className="flex items-center gap-1.5 font-medium text-gray-600">
                <ContactRound aria-hidden="true" />
                <h2 className="text-lg">Contact Information</h2>
              </div>
              <div className="space-y-1">
                {/* first & last name */}
                <div className="flex gap-2">
                  {/* first name */}
                  <div className="grow basis-25 relative">
                    <label htmlFor="first-name" className="text-sm font-medium">
                      First name
                    </label>
                    <input
                      {...register("firstName", {
                        required: "First name is required !",
                        minLength: {
                          value: 2,
                          message: "First name requires minimum 2 words !",
                        },
                        maxLength: {
                          value: 15,
                          message: "First name is too long !",
                        },
                      })}
                      type="text"
                      id="first-name"
                      autoComplete="given-name"
                      className={`border px-3 py-2 outline-none bg-white w-full mt-0.5 ${errors.firstName ? "ring-red-500 ring border-red-500" : "focus:border-green-sage focus:ring border-gray-300 ring-green-sage"}`}
                    />

                    <AnimatePresence>
                      {errors.firstName && (
                        <FieldErr msg={errors.firstName.message} />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* last name */}
                  <div className="grow-3 basis-40 relative">
                    <label htmlFor="last-name" className="text-sm font-medium">
                      Last name
                    </label>

                    <input
                      {...register("lastName", {
                        required: "Last name is required",
                        minLength: {
                          value: 3,
                          message: "Last name requires minimum 3 words !",
                        },
                        maxLength: {
                          value: 30,
                          message: "Last name is too long !",
                        },
                      })}
                      type="text"
                      autoComplete="family-name"
                      id="last-name"
                      className={`border px-3 py-2 outline-none bg-white w-full mt-0.5 ${errors.lastName ? "ring-red-500 ring border-red-500" : "focus:border-green-sage focus:ring ring-green-sage border-gray-300"}`}
                    />

                    <AnimatePresence>
                      {errors.lastName && (
                        <FieldErr
                          reverse={true}
                          msg={errors.lastName.message}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* email address */}
                <div className="relative">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </label>
                  <input
                    {...register("email", {
                      required: "Email is required !",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address !",
                      },
                    })}
                    type="email"
                    id="email"
                    autoComplete="email"
                    className={`border px-3 py-2 outline-none bg-white w-full  mt-0.5 ${errors.email ? "ring-red-500 ring border-red-500" : "focus:border-green-sage focus:ring ring-green-sage border-gray-300"}`}
                  />

                  <AnimatePresence>
                    {errors.email && <FieldErr msg={errors.email.message} />}
                  </AnimatePresence>
                </div>

                {/* phone number */}
                <div className="relative">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^\+?[0-9\s\-\(\)]{7,20}$/,
                        message: "Invalid phone number !",
                      },
                      validate: (value) => {
                        const digitsOnly = value.replace(/\D/g, "");
                        if (digitsOnly.length < 7 || digitsOnly.length > 15) {
                          return "Phone number is invalid !";
                        }
                        return true;
                      },
                    })}
                    type="tel"
                    id="phone"
                    autoComplete="tel"
                    className={`border px-3 py-2 outline-none bg-white w-full mt-0.5 ${errors.phone ? "ring-red-500 ring border-red-500" : "focus:border-green-sage focus:ring ring-green-sage border-gray-300"}`}
                  />
                  <AnimatePresence>
                    {errors.phone && <FieldErr msg={errors.phone.message} />}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            <hr className="border-t border-gray-300" />

            {/* Shipping Address */}
            <section className="space-y-2">
              <div className="flex items-center gap-1.5 font-medium text-gray-600">
                <MapPinHouse aria-hidden="true" />
                <h2 className="text-lg">Shipping Address</h2>
              </div>

              <div className="space-y-1">
                {/* select country */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-1">
                  <label htmlFor="country" className="text-sm font-medium">
                    Select Country
                  </label>

                  <div className="relative w-full sm:w-64">
                    <select
                      id="country"
                      {...register("country", {
                        required: "Please select a country !",
                      })}
                      autoComplete="off"
                      className={`w-full appearance-none bg-white border pl-3 pr-8 py-2.5 text-sm outline-none focus:ring-1 cursor-pointer ${errors.country ? "ring-red-500 ring border-red-500" : "focus:border-green-sage focus:ring ring-green-sage border-gray-300"}`}
                    >
                      {checkout?.countryOptions?.map((country) => (
                        <option
                          key={country.id}
                          value={country.name}
                          className="py-1"
                        >
                          {country.name}
                        </option>
                      ))}
                    </select>

                    {/* arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-gray-500">
                      <ChevronDown
                        aria-hidden="true"
                        size={18}
                        strokeWidth={2}
                      />
                    </div>

                    <AnimatePresence>
                      {errors.country && (
                        <FieldErr msg={errors.country.message} />
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* address */}
                <div className="relative">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address
                  </label>
                  <input
                    {...register("address", {
                      required: "Address is required !",
                      minLength: {
                        value: 10,
                        message:
                          "Please enter a detailed address (at least 10 characters) !",
                      },
                      validate: (value) => {
                        const words = value.trim().split(/\s+/);
                        if (words.length < 2) {
                          return "Please provide a complete street address !";
                        }
                        return true;
                      },
                    })}
                    type="text"
                    id="address"
                    autoComplete="street-address"
                    className={`border px-3 py-2 outline-none bg-white w-full mt-0.5 ${errors.address ? "ring-red-500 ring border-red-500" : "focus:border-green-sage focus:ring ring-green-sage border-gray-300"}`}
                  />
                  <AnimatePresence>
                    {errors.address && (
                      <FieldErr msg={errors.address.message} />
                    )}
                  </AnimatePresence>
                </div>

                {/* city and post-code */}
                <div className="flex gap-2">
                  {/* city */}
                  <div className="grow basis-40 relative">
                    <label htmlFor="city" className="text-sm font-medium">
                      City
                    </label>
                    <input
                      {...register("city", {
                        required: "City name is required !",
                        minLength: {
                          value: 3,
                          message: "City name must be at least 3 characters !",
                        },
                        pattern: {
                          value: /^[a-zA-Z\s.-]+$/,
                          message: "Invalid city name !",
                        },
                      })}
                      type="text"
                      id="city"
                      autoComplete="address-level2"
                      className={`border px-3 py-2 outline-none bg-white w-full mt-0.5 ${errors.city ? "ring-red-500 ring border-red-500" : "focus:border-green-sage focus:ring ring-green-sage border-gray-300"}`}
                    />
                    <AnimatePresence>
                      {errors.city && <FieldErr msg={errors.city.message} />}
                    </AnimatePresence>
                  </div>

                  {/* post code */}
                  <div className="grow basis-40 relative">
                    <label htmlFor="postCode" className="text-sm font-medium">
                      Postal Code
                    </label>
                    <input
                      {...register("postCode", {
                        required: "Postal code is required !",
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Invalid postal code !",
                        },
                        minLength: {
                          value: 4,
                          message: "Postal code must be at least 4 digits !",
                        },
                        maxLength: {
                          value: 8,
                          message: "Postal code cannot exceed 8 digits !",
                        },
                      })}
                      type="text"
                      id="postCode"
                      autoComplete="postal-code"
                      className={`border px-3 py-2 outline-none bg-white w-full  mt-0.5 ${errors.postCode ? "ring-red-500 ring border-red-500" : "focus:border-green-sage focus:ring ring-green-sage border-gray-300"}`}
                    />
                    <AnimatePresence>
                      {errors.postCode && (
                        <FieldErr
                          reverse={true}
                          msg={errors.postCode.message}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-t border-gray-300" />

            {/* payment */}
            <section className="space-y-2">
              <div className="flex items-center gap-1.5 font-medium text-gray-600">
                <HandCoins aria-hidden="true" />
                <h2 className="text-lg">Payment Info</h2>
              </div>

              <div className="flex items-center gap-1 text-peach-ultra border-b border-gray-200 pb-1 text-sm">
                <CreditCard aria-hidden="true" size={20} />
                <h3 className="font-medium">Credit or Debit Card</h3>
              </div>

              {/* card number */}
              <div className="relative">
                <label htmlFor="cardNumber" className="text-sm font-medium">
                  Card Number
                </label>
                <input
                  {...register("cardNumber", {
                    required: "Card number is required!",
                    validate: (value) => {
                      const rawValue = value.replace(/\s+/g, "");
                      if (!/^[0-9]{12,19}$/.test(rawValue)) {
                        return "Card number must be between 12 and 19 digits!";
                      }
                      return true;
                    },
                  })}
                  type="text"
                  id="cardNumber"
                  placeholder="1234 5678 9101 1121"
                  autoComplete="cc-number"
                  className={`border px-3 py-2 outline-none bg-white w-full mt-0.5 ${errors.cardNumber ? "ring-red-500 ring border-red-500" : "focus:border-green-sage focus:ring ring-green-sage border-gray-300"}`}
                />
                <AnimatePresence>
                  {errors.cardNumber && (
                    <FieldErr msg={errors.cardNumber.message} />
                  )}
                </AnimatePresence>
              </div>

              {/* ext & cvc */}
              <div className="flex gap-3">
                {/* exp date */}
                <div className="grow basis-1/2 relative">
                  <label htmlFor="expiryDate" className="text-sm font-medium">
                    Expiry Date (MM/YY)
                  </label>
                  <input
                    {...register("expiryDate", {
                      required: "Expiry date is required!",
                      pattern: {
                        value: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
                        message: "Use MM/YY format (e.g. 12/28)!",
                      },
                    })}
                    type="text"
                    id="expiryDate"
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                    className={`border px-3 py-2 outline-none bg-white w-full mt-0.5 ${errors.expiryDate ? "ring-red-500 ring border-red-500" : "focus:border-green-sage focus:ring ring-green-sage border-gray-300"}`}
                  />
                  <AnimatePresence>
                    {errors.expiryDate && (
                      <FieldErr msg={errors.expiryDate.message} />
                    )}
                  </AnimatePresence>
                </div>

                {/* cvc / cvv */}
                <div className="grow basis-1/2 relative">
                  <label htmlFor="cvc" className="text-sm font-medium">
                    CVC / CVV
                  </label>
                  <input
                    {...register("cvc", {
                      required: "CVC is required!",
                      pattern: {
                        value: /^[0-9]{3,4}$/,
                        message: "CVC must be 3 or 4 digits!",
                      },
                    })}
                    type="text"
                    id="cvc"
                    placeholder="123"
                    autoComplete="cc-csc"
                    className={`border px-3 py-2 outline-none bg-white w-full mt-0.5 ${errors.cvc ? "ring-red-500 ring border-red-500" : "focus:border-green-sage focus:ring ring-green-sage border-gray-300"}`}
                  />
                  <AnimatePresence>
                    {errors.cvc && (
                      <FieldErr reverse={true} msg={errors.cvc.message} />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>
          </aside>

          {/* order summary */}
          <div className="box sticky top-19.25 grow basis-70 bg-peach-dark rounded-md text-white px-3 py-2 shadow pb-12 space-y-2">
            <div className="flex items-center gap-1">
              <ReceiptText size={26} strokeWidth={2.2} />
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </div>

            <div className="flex items-center gap-1 py-1">
              <BadgeCheck size={22} strokeWidth={2.2} />
              <h3 className="font-medium">
                Deliver to {selectedCountry || "your country"}
              </h3>
            </div>

            <div className="mt-4">
              <p>Sub Total : ${checkout.subtotal}</p>
              <p>Shipping : ${countryShippingMap[selectedCountry]?.shipping}</p>
              <p>
                Grant Total : $
                {checkout.subtotal +
                  countryShippingMap[selectedCountry]?.shipping}
              </p>
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting || checkout.subtotal === 0}
                className={`px-5 flex items-center justify-center w-full h-11 rounded-full gap-1 transition-colors duration-200 ${isSubmitting || checkout.subtotal === 0 ? "bg-green-sage text-gray-600 cursor-not-allowed" : "text-black cursor-pointer bg-green-pastel hover:bg-[#c0e6a8]"}`}
              >
                {isSubmitting ? (
                  <DotLoader />
                ) : (
                  <>
                    <CircleCheck size={20} />
                    <span>Place Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
