import { getDiscountedPrice } from "../utils/services";
import DotLoader from "./DotLoader";
import { BaggageClaim, Heart, Vote } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggle_like } from "../redux/slices/productSlice";
import { memo } from "react";

const ProductCard = ({ product, cartMap, loading, updateCart, relativeContainer }) => {
  const dispacth = useDispatch();

  return (
    <div className="w-full h-full space-y-2">
      {/* product image */}
      <div className="w-full aspect-6/4 relative">
        <img
          src={product.image}
          className="w-full h-full object-cover object-center"
          alt={product.name}
          loading="lazy"
          fetchPriority="auto"
        />

        <div className="absolute top-2 right-2">
          <button
            onClick={() => {
              dispacth(toggle_like(product.id));
            }}
            className="cursor-pointer rounded-md h-9 w-9 bg-white flex items-center justify-center"
          >
            <Heart
              size={22}
              strokeWidth={1.8}
              color={product.liked ? "#f8785f":"black"}
              fill={product.liked ? "#f8785f" : "none"}
            />
          </button>
        </div>
      </div>

      {/* product detail */}
      <div className="space-y-2 px-3 py-3">
        <div>
          <h2 className="text-lg font-medium">{product.name}</h2>
          <p className="text-gray-600 text-sm">{product.shortDescription}</p>
        </div>

        {/* price */}
        <div className="space-x-2">
          <span className="text-2xl font-semibold">
            ${getDiscountedPrice(product.price, product.discount)}
          </span>
          {product.discount > 0 && (
            <span className="text-gray-600 line-through">${product.price}</span>
          )}
        </div>

        {/* btns */}
        <div className="flex gap-2">
          <button
            disabled={loading.has(product.id)}
            onClick={() => updateCart(product)}
            className={`border text-sm w-33 h-10.5 flex items-center justify-center gap-1 ${cartMap[product.id] ? "border-peach-dark bg-peach-soft/40 text-peach-dark" : "bg-green-pastel hover:bg-green-sage active:bg-green-sage border-transparent"}`}
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
          <NavLink to={relativeContainer.url}>
            <button className="border text-sm h-10.5 px-4 border-green-sage hover:bg-green-sage active:bg-green-sage">
              View Details
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);
