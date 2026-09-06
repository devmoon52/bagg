import { toggle_like } from "../../redux/slices/productSlice";
import { useDispatch } from "react-redux";
import { getDiscountedPrice } from "../../utils/services";
import { NavLink } from "react-router-dom";
import DotLoader from "../DotLoader";
import { Heart } from "lucide-react";
import { memo } from "react";

const CategorySection = ({
  i,
  cat,
  slices,
  addToCart,
  loading,
  cartAddedMap,
}) => {
  const dispatch = useDispatch();

  return (
    <section
      id={cat.category}
      key={i}
      className={`md:px-3 px-1.5 ${(i + 1) % 2 === 0 ? "bg-gray-200 md:py-8 py-6" : ""}`}
    >
      {/* wrapper */}
      <div className="max-w-7xl mx-auto space-y-3">
        {/* category title */}
        <div className="flex items-center gap-1">
          <cat.Icon size={26} strokeWidth={2.6} />
          <h1 className="text-lg font-semibold">{cat.categoryName}</h1>
        </div>

        {/* phase 1 */}
        <div className="flex gap-2 flex-wrap">
          {/* phase 1 - 4 product & image navigation on category */}
          <ul className="grid grid-cols-2 grid-rows-2 gap-1.5 basis-70 grow">
            {slices.first4.map((product) => (
              <li
                key={product.id}
                className="w-full aspect-square rounded-md overflow-hidden"
              >
                <NavLink
                  to={`/category?name=${cat.qParam}&proId=${product.id}`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "low"}
                    className="w-full h-full object-cover object-center"
                  />
                </NavLink>
              </li>
            ))}
          </ul>

          {/* phase 1 - 2 product card */}
          <div className="basis-130 flex flex-wrap gap-2 grow-2">
            {slices.second2.map((product) => (
              <div
                key={product.id}
                className="basis-64 grow bg-white shadow rounded-md overflow-hidden"
              >
                {/* image & like btn */}
                <div className="w-full aspect-16/10 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "low"}
                    className="h-full w-full object-cover object-center"
                  />

                  {/* like btn */}
                  <button
                    onClick={() => dispatch(toggle_like(product.id))}
                    className="absolute right-2 top-2 bg-white h-9 w-9 rounded-full justify-center items-center flex cursor-pointer"
                  >
                    <Heart
                      aria-hidden="true"
                      color={product.liked ? "#f8785f" : "black"}
                      fill={product.liked ? "#f8785f" : "none"}
                      size={22}
                    />
                  </button>
                </div>

                {/* product detail */}
                <div className="px-2 py-3 space-y-1">
                  <h2 className="font-medium">{product.name}</h2>
                  <div className="space-x-1">
                    <span className="text-xl font-semibold">
                      ${getDiscountedPrice(product.price, product.discount)}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.price}
                      </span>
                    )}
                  </div>
                  {/* btns */}
                  <div className="gap-2 flex pt-1">
                    <button
                      onClick={() => addToCart(product)}
                      className={`text-sm transition-colors duration-200 w-22 h-9.5 flex justify-center items-center ${cartAddedMap.has(product.id) ? "border bg-peach-soft/40 text-peach-dark" : "bg-green-pastel hover:bg-green-sage"}`}
                    >
                      {loading.has(product.id) ? (
                        <DotLoader size="sm" />
                      ) : cartAddedMap.has(product.id) ? (
                        "Added"
                      ) : (
                        "Add Cart"
                      )}
                    </button>
                    <NavLink
                      to={`/category?name=${cat.qParam}&proId=${product.id}`}
                    >
                      <button className="text-sm px-3 py-2 border-green-pastel border hover:bg-green-sage transition-colors duration-200">
                        View Details
                      </button>
                    </NavLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* phase 2 */}
        <ul className="flex flex-wrap gap-3">
          {slices.lastAll.map((product) => (
            <li key={product.id} className="basis-72 bg-white grow shadow">
              {/* images & like btn */}
              <div className="w-full aspect-16/10 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "low"}
                  className="h-full w-full object-cover object-center"
                />

                {/* like btn */}
                <button
                  onClick={() => dispatch(toggle_like(product.id))}
                  className="absolute right-2 top-2 bg-white h-9 w-9 rounded-full justify-center items-center flex cursor-pointer"
                >
                  <Heart
                    aria-hidden="true"
                    color={product.liked ? "#f8785f" : "black"}
                    fill={product.liked ? "#f8785f" : "none"}
                    size={22}
                  />
                </button>
              </div>

              {/* product detail */}
              <div className="px-2 py-3">
                <h2 className="text-lg font-medium">{product.name}</h2>
                <p className="text-sm text-gray-600">
                  {product.shortDescription}
                </p>
                <div className="space-x-1 my-2">
                  <span className="text-xl font-semibold">
                    ${getDiscountedPrice(product.price, product.discount)}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.price}
                    </span>
                  )}
                </div>
                {/* btns */}
                <div className="gap-2 flex pt-1">
                  <button
                    onClick={() => addToCart(product)}
                    className={`text-sm transition-colors duration-200 w-22 h-9.5 flex justify-center items-center ${cartAddedMap.has(product.id) ? "border bg-peach-soft/40 text-peach-dark" : "bg-green-pastel hover:bg-green-sage"}`}
                  >
                    {loading.has(product.id) ? (
                      <DotLoader size="sm" />
                    ) : cartAddedMap.has(product.id) ? (
                      "Added"
                    ) : (
                      "Add Cart"
                    )}
                  </button>
                  <NavLink
                    to={`/category?name=${cat.qParam}&proId=${product.id}`}
                  >
                    <button className="text-sm px-3 py-2 border-green-pastel border hover:bg-green-sage transition-colors duration-200">
                      View Details
                    </button>
                  </NavLink>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default memo(CategorySection);
