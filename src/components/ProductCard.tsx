import { useNavigate } from "react-router-dom";
import type { Product } from "../types/index";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const imageSrc = (() => {
    const src = product.image ?? product.image_url ?? "";
    if (!src) return "https://via.placeholder.com/400x200.png?text=Product";
    if (/^https?:/i.test(src)) return src;
    return `${import.meta.env.BASE_URL}${src}`;
  })();

  const primaryPackage = product.offerings?.[0]?.packages?.[0];
  const displayPrice =
    product.price ?? product.basePrice ?? primaryPackage?.price ?? 0;
  const displayOriginalPrice =
    product.originalPrice ??
    product.baseOriginalPrice ??
    primaryPackage?.originalPrice ??
    undefined;

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl overflow-hidden flex flex-col border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[2/1] bg-white overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Discount Badge - Top Right */}
        {product.discountPercentage && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
              -{product.discountPercentage}%
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 flex-1 flex flex-col border-t border-gray-100">
        {/* Title */}
        <h3 className="font-bold text-gray-900 mb-2 text-sm leading-tight line-clamp-2 flex-1 group-hover:text-blue-600 transition-colors duration-300">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-gray-900 font-bold text-lg">
            {displayPrice.toLocaleString("vi-VN")}₫
          </span>
          {displayOriginalPrice && (
            <span className="text-gray-400 line-through text-xs">
              {displayOriginalPrice.toLocaleString("vi-VN")}₫
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
