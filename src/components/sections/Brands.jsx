// images
import brand1 from "../../assets/brands/brand-1.jpg";
import brand2 from "../../assets/brands/brand-2.jpg";
import brand3 from "../../assets/brands/brand-3.jpg";
import brand4 from "../../assets/brands/brand-4.jpg";
import brand5 from "../../assets/brands/brand-5.jpg";
import brand6 from "../../assets/brands/brand-6.jpg";
import brand7 from "../../assets/brands/brand-7.jpg";
import brand8 from "../../assets/brands/brand-8.jpg";
import brand9 from "../../assets/brands/brand-9.jpg";
import brand10 from "../../assets/brands/brand-10.jpg";
import brand11 from "../../assets/brands/brand-11.jpg";
import brand12 from "../../assets/brands/brand-12.jpg";
import brand13 from "../../assets/brands/brand-13.jpg";

import { useSelector } from "react-redux";
import { productSelector } from "../../redux/selectors/productSelector";

const brands = [
  brand1,
  brand2,
  brand3,
  brand4,
  brand5,
  brand6,
  brand7,
  brand8,
  brand9,
  brand10,
  brand11,
  brand12,
  brand13,
];
const infiniteBrands = [...brands, ...brands];

const Brands = () => {
  return (
    <section className="md:px-3 px-1.5 py-3">
      {/* wrapper */}
      <div className="max-w-7xl mx-auto space-y-3">
        <div>
          <h2 className="sm:text-2xl text-xl font-semibold text-center">
            Popular Brands
          </h2>
        </div>

        <div className="overflow-hidden border border-gray-300">
          <ul className="flex w-max animate-brand-scroll mix-blend-multiply">
            {infiniteBrands.map((image, i) => (
              <li
                key={i + 1}
                className="sm:w-35 w-25 aspect-square shrink-0 mr-3"
              >
                <img
                  src={image}
                  loading="lazy"
                  fetchPriority="low"
                  alt="Brand Image"
                  className="w-full h-full object-contain object-center"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Brands;
