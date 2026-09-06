import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Global from "./pages/Global";
import Frame from "./pages/Frame";
import NewArrivalPage from "./pages/NewArrivalPage";

import ProgressBar from "./components/ProgressBar";
import "nprogress/nprogress.css";
import nProgress from "nprogress";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import FlashSalesPage from "./pages/FlashSalesPage";
import TrendingProductsPage from "./pages/TrendingProductsPage";
import FeaturedProductPage from "./pages/FeaturedProductPage";
import PopularProductsPage from "./pages/PopularProductsPage";
import CategoryWise from "./pages/CategoryWise";
import Shop from "./pages/Shop";
import Wishlist from "./pages/Wishlist";
import User from "./pages/User";
import Search from "./pages/Search";
nProgress.configure({ showSpinner: false, speed: 400 });

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProgressBar key={"home"}>
        <Home />
      </ProgressBar>
    ),
  },
  {
    path: "/shop",
    element: (
      <ProgressBar key={"shop"}>
        <Shop />
      </ProgressBar>
    ),
  },
  {
    path: "/user",
    element: (
      <ProgressBar key={"user"}>
        <User />
      </ProgressBar>
    ),
  },
  {
    path: "/search",
    element: (
      <ProgressBar key={"search"}>
        <Search />
      </ProgressBar>
    ),
  },
  {
    // types navigation
    path: "/type",
    element: <Frame />,
    children: [
      {
        path: "new-arrivals",
        element: (
          <ProgressBar key={"new-arrivals"}>
            <NewArrivalPage />
          </ProgressBar>
        ),
      },
      {
        path: "trendings",
        element: (
          <ProgressBar key={"new-arrivals"}>
            <TrendingProductsPage />
          </ProgressBar>
        ),
      },
      {
        path: "featured",
        element: (
          <ProgressBar key={"featured-products"}>
            <FeaturedProductPage />
          </ProgressBar>
        ),
      },
      {
        path: "popular",
        element: (
          <ProgressBar key={"popular-products"}>
            <PopularProductsPage />
          </ProgressBar>
        ),
      },
    ],
  },

  {
    // flash sales navigation
    path: "/flash-sales",
    element: (
      <Frame>
        <ProgressBar key={"flash-sales"}>
          <FlashSalesPage />
        </ProgressBar>
      </Frame>
    ),
  },
  {
    path: "/category",
    element: (
      <ProgressBar key={"category-page"}>
        <CategoryWise />
      </ProgressBar>
    ),
  },

  {
    path: "/cart",
    element: (
      <ProgressBar key={"cart"}>
        <Cart />
      </ProgressBar>
    ),
  },
  {
    path: "/wishlist",
    element: (
      <ProgressBar key={"wishlist"}>
        <Wishlist />
      </ProgressBar>
    ),
  },

  {
    path: "/checkout",
    element: (
      <ProgressBar key={"checkout"}>
        <Checkout />
      </ProgressBar>
    ),
  },
]);

const App = () => {
  return (
    <>
      <Global />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
