import { ArrowUpRight, ChevronDown, MapPinHouse } from "lucide-react";
import products from "../../assets/images/products.jpg";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "motion/react";
import FieldErr from "../modals & toasts/FieldErr";
import { setSuccessMessage } from "../../redux/slices/globalSlice";

const Shipping = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  function submitForm(data) {
    reset(data);
    dispatch(
      setSuccessMessage({
        id: "shipping-info",
        msg: "Your info has been recorded !",
      }),
    );
  }

  const checkout = useSelector((state) => state.products.checkout);

  return (
    <section className="md:px-3 sm:px-1.5">
      {/* wrapper */}
      <div className="max-w-7xl mx-auto space-y-3">
        <div className="flex items-center gap-1">
          <MapPinHouse size={27} aria-hidden="true" />
          <h2 className="text-xl font-medium">Shipping Information</h2>
        </div>
        <div className="w-full h-140 sm:rounded-md overflow-hidden relative">
          {/* bg image */}
          <img
            src={products}
            alt="E-commerce products"
            className="rotate-y-180 w-full h-full object-cover object-center"
          />

          <div className="absolute top-1/2 -translate-y-1/2 right-3 backdrop-blur-sm bg-white/20 px-3 py-3 max-w-md w-[94%] rounded-md border border-gray-400/50">
            <form onSubmit={handleSubmit(submitForm)} className="space-y-2">
              <div>
                <h2 className="text-lg font-medium">Set Your Address</h2>
              </div>

              {/* select country */}
              <div className="">
                <label htmlFor="country" className="text-sm font-medium">
                  Select Country
                </label>

                <div className="relative w-full">
                  <select
                    id="country"
                    {...register("country", {
                      required: "Please select a country !",
                    })}
                    autoComplete="off"
                    className={`w-full appearance-none bg-white/50 border pl-3 pr-8 py-2.5 text-sm outline-none focus:ring-1 cursor-pointer ${errors.country ? "ring-red-500 ring border-red-500" : "focus:border-green-sage focus:ring ring-green-sage border-gray-300"}`}
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
                    <ChevronDown aria-hidden="true" size={18} strokeWidth={2} />
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
                  className={`border px-3 py-2 outline-none bg-white/50 w-full mt-0.5 ${errors.address ? "ring-red-500 ring border-red-500" : "focus:border-green-sage focus:ring ring-green-sage border-gray-300"}`}
                />
                <AnimatePresence>
                  {errors.address && <FieldErr msg={errors.address.message} />}
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
                    className={`border px-3 py-2 outline-none bg-white/50 w-full mt-0.5 ${errors.city ? "ring-red-500 ring border-red-500" : "focus:border-green-sage focus:ring ring-green-sage border-gray-300"}`}
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
                    className={`border px-3 py-2 outline-none bg-white/50 w-full  mt-0.5 ${errors.postCode ? "ring-red-500 ring border-red-500" : "focus:border-green-sage focus:ring ring-green-sage border-gray-300"}`}
                  />
                  <AnimatePresence>
                    {errors.postCode && (
                      <FieldErr reverse={true} msg={errors.postCode.message} />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-3">
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-pastel rounded-md flex items-center gap-1 justify-center hover:bg-green-sage"
                >
                  <span>Submit</span>
                  <ArrowUpRight />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shipping;
