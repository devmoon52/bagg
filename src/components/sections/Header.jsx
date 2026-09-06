import {
  BellRing,
  Handbag,
  Heart,
  Search,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { productSelector } from "../../redux/selectors/productSelector";
import CategoryModal from "../modals & toasts/CategoryModal";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { debounce, throttle } from "../../utils/optimize";
import Notifications from "../modals & toasts/Notifications";
import SearchModal from "../modals & toasts/SearchModal";

const Header = () => {
  const [openCategory, setOpenCategory] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [mdScreen, setMdScreen] = useState(window.innerWidth >= 768);
  const [showNav, setShowNav] = useState(true);

  const { cart } = useSelector((state) => state.products);
  const { wishlist } = useSelector(productSelector);

  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const searchBoxRef = useRef(null);

  // controll scroll position - navber control
  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setShowNav(true);
      } else if (currentScrollY < lastScrollY.current) {
        setShowNav(true); // scrolling up
      } else if (currentScrollY > lastScrollY.current) {
        setShowNav(false); // scrolling down
      }
      lastScrollY.current = currentScrollY;
    }

    window.addEventListener("scroll", throttle(handleScroll, 150));

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // control notification modal
  useEffect(() => {
    function handleClick() {
      if (!openNotification) return;

      setOpenNotification(false);
    }

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [openNotification]);

  // control mdScreen on resize - for search bar
  useEffect(() => {
    function handleResize() {
      setMdScreen(window.innerWidth >= 768);
    }

    const debounced = debounce(handleResize, 200);

    window.addEventListener("resize", debounced);

    return () => {
      window.removeEventListener("resize", debounced);
      debounced.cancel();
    };
  }, []);

  function getSearchResult(value) {
    if (!value) return;

    setSearchModal(false);
    navigate(`/search?result-for=${value}`);
  }

  return (
    <>
      {/* category modal box */}
      <AnimatePresence>
        {openCategory && (
          <CategoryModal offCategory={() => setOpenCategory(false)} />
        )}
        {searchModal && (
          <SearchModal
            getResult={getSearchResult}
            offSearch={() => setSearchModal(false)}
          />
        )}
      </AnimatePresence>

      <Notifications
        isOpen={openNotification}
        onClose={() => setOpenNotification(false)}
      />

      {/* top header */}
      <header className=" md:px-3 px-1.5 py-2.5 md:py-3.5 bg-gray-300 sticky top-0 z-9991">
        <div className="flex items-center gap-3 justify-between max-w-7xl mx-auto">
          {/* logo */}
          <div className="flex items-center gap-1 text-peach-ultra">
            <Handbag
              aria-hidden="true"
              className="sm:h-9.5 h-8.5 sm:w-9.5 w-8.5"
              strokeWidth={2.6}
            />
            <h1 className="sm:text-2xl font-semibold text-xl">Bagg</h1>
          </div>

          <div className="flex items-center justify-end gap-2 flex-1">
            {/* search bar */}
            <div className="flex items-center bg-white rounded-full md:max-w-85 md:w-full">
              <input
                type="text"
                ref={searchBoxRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    getSearchResult(searchBoxRef.current.value);
                  }
                }}
                name="search-field"
                placeholder="Find a product"
                className="outline-none md:py-2 md:pl-5 md:pr-3 grow md:w-auto w-0"
              />
              <button
                onClick={() => {
                  if (mdScreen) {
                    getSearchResult(searchBoxRef.current.value);
                  } else {
                    setSearchModal(true);
                  }
                }}
                className="md:w-9 w-9.5 md:h-9 h-9.5 flex items-center justify-center rounded-full mr-px cursor-pointer hover:text-peach-dark"
              >
                <Search aria-hidden="true" />
              </button>
            </div>

            {/* profile & notification */}
            <NavLink to={"/user"}>
              {({ isActive }) => (
                <button
                  className={`h-9.5 w-9.5 rounded-full flex border border-peach-dark/30 justify-center items-center cursor-pointer   transition-colors duration-200 shrink-0
                ${isActive ? "bg-peach-dark text-white" : "bg-peach-soft/40 text-peach-ultra hover:bg-peach-dark hover:text-white"}
                `}
                >
                  <UserRound aria-hidden="true" size={20} />
                </button>
              )}
            </NavLink>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenNotification(true);
              }}
              className="bg-peach-soft/40 border border-peach-dark/30 text-peach-ultra h-9.5 w-9.5 rounded-full flex justify-center items-center cursor-pointer hover:bg-peach-dark hover:text-white transition-colors duration-200 shrink-0"
            >
              <BellRing aria-hidden="true" size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* navigations header */}
      <div
        className={`md:py-3.5 py-2 border-b border-gray-300 md:px-3 px-1.5 transition-all duration-400 bg-[#f5f5f5] sticky z-9990 ${showNav ? "md:top-17 top-14.5" : "top-0"}`}
      >
        {/* navigation wrapper */}
        <div className="max-w-7xl mx-auto flex items-center gap-3 justify-between relative">
          <nav className="md:space-x-3 space-x-2 md:mx-auto">
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                `${isActive ? "text-black" : "text-gray-500"} font-medium`
              }
            >
              Home
            </NavLink>
            <NavLink
              to={"/shop"}
              className={({ isActive }) =>
                `${isActive ? "text-black" : "text-gray-500"} font-medium`
              }
            >
              Shop
            </NavLink>
            <button
              onClick={() => setOpenCategory(true)}
              className={`font-medium text-gray-500 cursor-pointer`}
            >
              Categories
            </button>
          </nav>

          <div className="flex items-center gap-1 md:absolute right-0">
            {/* cart page navigation */}
            <NavLink to={"/cart"} className={"rounded-full"}>
              <button className="p-1.5 rounded-full hover:bg-peach-soft/40 active:bg-peach-soft/40 hover:text-peach-dark relative cursor-pointer">
                <ShoppingCart aria-hidden="true" />
                {cart.length > 0 && (
                  <div className="h-2 w-2 bg-peach-dark rounded-full absolute right-0.5 top-0.5" />
                )}
              </button>
            </NavLink>

            {/* wishlist page navigation */}
            <NavLink to={"/wishlist"} className={"rounded-full"}>
              <button className="p-1.5 cursor-pointer hover:bg-peach-soft/40 rounded-full active:bg-peach-soft/40 hover:text-peach-dark relative">
                <Heart aria-hidden="true" />
                {wishlist.length > 0 && (
                  <div className="h-2 w-2 bg-peach-dark rounded-full absolute right-0.5 top-0.5" />
                )}
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
