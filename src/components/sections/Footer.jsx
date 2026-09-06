import { ChevronUp, Handbag } from "lucide-react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import FieldErr from "../modals & toasts/FieldErr";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  getSubscribe,
  setSuccessMessage,
} from "../../redux/slices/globalSlice";
import DotLoader from "../DotLoader";
import { productSelector } from "../../redux/selectors/productSelector";
import { accessLinks, helpLinks, socialMediaLinks } from "../../data/listData";
import { add_notification } from "../../redux/slices/notificationSlice";

const Footer = () => {
  const isSubscribed = useSelector((state) => state.global.subscribed);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const timerRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  function subscribe(data) {
    if (isSubscribed) return;
    setLoading(true);

    timerRef.current = setTimeout(() => {
      dispatch(getSubscribe());
      dispatch(
        add_notification({
          id: Date.now(),
          icon: "bellRing",
          heading: "Subscribed to bagg successfully",
          message:
            "You have successfully subscribed to bagg. Now you will be updated with our upcoming events & products.",
          date: "1",
          dateType: "day",
          isNew: true,
        }),
      );
      dispatch(
        setSuccessMessage({
          id: "subscribe",
          msg: "Subscribed to Bagg.",
        }),
      );
      setLoading(false);
    }, 200);

    reset();
  }

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  function scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="border-t-2 border-gray-300 bg-gray-200">
      <div className="space-y-3">
        <div className="max-w-7xl mx-auto flex justify-between flex-wrap gap-3 md:px-3 sm:px-1.5 px-4 py-8">
          {/* first box */}
          <div className="space-y-8 basis-70 sm:block hidden">
            <div className="flex items-center gap-1 text-peach-ultra">
              <Handbag aria-hidden="true" size={28} strokeWidth={2.6} />
              <h2 className="text-lg font-semibold">Bagg</h2>
            </div>

            <form onSubmit={handleSubmit(subscribe)} className="space-y-2">
              <h3 className="font-medium">Stay Updated</h3>
              <div className="relative">
                <input
                  type="email"
                  disabled={isSubscribed}
                  {...register("email", {
                    required: "Email is required !",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address !",
                    },
                  })}
                  placeholder="Enter email"
                  autoComplete="email"
                  id="email"
                  className="block border outline-none px-3 py-2 rounded-md border-gray-300 focus:ring focus:border-green-pastel ring-green-pastel w-full"
                />
                <AnimatePresence>
                  {errors.email && <FieldErr msg={errors.email.message} />}
                </AnimatePresence>
              </div>
              <button
                type="submit"
                disabled={isSubscribed}
                className={`rounded-md transition-colors duration-200 w-32 h-10 flex justify-center items-center ${isSubscribed ? "bg-peach-soft/40 text-peach-dark border border-peach-dark" : "bg-green-pastel hover:bg-green-sage cursor-pointer"}`}
              >
                {loading ? (
                  <DotLoader />
                ) : isSubscribed ? (
                  "Subscribed"
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          </div>

          {/* middle box */}
          <div className="w-max space-y-2 shrink-0">
            <h2 className="font-medium">Quick Access</h2>

            <nav>
              <ul>
                {accessLinks.map((link) => (
                  <li key={link.id}>
                    <NavLink
                      className={`text-gray-600 text-sm hover:text-black`}
                      to={link.url}
                    >
                      {link.link_to}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* last box */}
          <div className="md:basis-70 w-max space-y-2">
            <h2 className="font-medium">Get Help From Us</h2>
            <nav>
              <ul>
                {helpLinks.map((link) => (
                  <li key={link.id}>
                    <NavLink
                      className={`text-gray-600 text-sm hover:text-black`}
                      to={link.url}
                    >
                      {link.link_to}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              {socialMediaLinks.map((link) => (
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  key={link.id}
                  href={link.url}
                >
                  <img
                    src={link.image}
                    className="h-6 w-6 object-contain"
                    alt={link.alt}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* back to top btn */}
        <div className="text-center">
          <button
            onClick={scrollTop}
            className="bg-green-pastel w-full py-4 flex items-center justify-center gap-1 hover:bg-green-sage"
          >
            <span>Back To Top</span>
            <ChevronUp className="animate-bounce" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
