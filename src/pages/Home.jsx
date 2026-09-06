import Header from "../components/sections/Header";
import Categories from "../components/sections/Categories";
import FlashSale from "../components/sections/FlashSale";
import HeroSlider from "../components/sections/HeroSlider";
import NewArrivals from "../components/sections/NewArrivals";
import TrendingProducts from "../components/sections/TrendingProducts";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import Brands from "../components/sections/Brands";
import Reviews from "../components/sections/Reviews";
import Footer from "../components/sections/Footer";
import ScrollToTop from "../components/ScrollToTop";

const Home = () => {
  return (
    <div>
      {/* page title */}
      <title>Home | Explore products & offers</title>
      <ScrollToTop /> {/* Scroll To Top */}
      <Header />
      <main className="md:space-y-12 space-y-8">
        <HeroSlider />

        <Categories />

        <FlashSale />

        <TrendingProducts />

        <NewArrivals />

        <FeaturedProducts />

        <Brands />

        <Reviews />

        <Footer />
      </main>
    </div>
  );
};

export default Home;
