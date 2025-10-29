import type { Product } from "../types/index";
import ProductCard from "./ProductCard";

interface ProductSectionProps {
  title: string;
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
}

const ProductSection = ({
  title,
  products,
  loading = false,
  emptyMessage = "Chưa có sản phẩm",
}: ProductSectionProps) => {
  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="h-40 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-10 text-center text-gray-500 text-sm">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductSection;
