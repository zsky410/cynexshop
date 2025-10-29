import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaShoppingCart,
  FaPhoneAlt,
  FaStar,
  FaHeart,
  FaBox,
  FaArrowUp,
  FaShieldAlt,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ProductCard from "./ProductCard";
import CartSidebar from "./CartSidebar";
import { useCart } from "../context/CartContext";
import { useProductById, useProducts } from "../hooks/useProducts";
import type { ProductOffering, ProductPackage } from "../types";

const offeringKey = (offering: ProductOffering, index: number) =>
  offering.id || offering.type || offering.label || `offering-${index}`;

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const { product, loading, error } = useProductById(id);
  const { products: allProducts } = useProducts();

  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedOfferingKey, setSelectedOfferingKey] = useState<string | null>(
    null
  );
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);

  const computeOfferings = useMemo(() => {
    if (!product) return [] as ProductOffering[];

    if (product.offerings && product.offerings.length > 0) {
      return product.offerings;
    }

    if (product.options && product.options.length > 0) {
      return [
        {
          id: "default",
          type: product.upgradeMethod ?? "Gói",
          label: product.upgradeMethod ?? "Gói",
          packages: product.options.map((option) => ({
            duration: option.duration || option.label,
            price: option.price,
            originalPrice: option.originalPrice,
          })),
        },
      ];
    }

    return [] as ProductOffering[];
  }, [product]);

  useEffect(() => {
    if (computeOfferings.length === 0) {
      setSelectedOfferingKey(null);
      setSelectedPackageIndex(0);
      return;
    }

    const firstOffering = computeOfferings[0];
    const key = offeringKey(firstOffering, 0);
    setSelectedOfferingKey(key);
    setSelectedPackageIndex(0);
  }, [computeOfferings]);

  const selectedOffering = useMemo(() => {
    if (!selectedOfferingKey) return null;
    return computeOfferings.find((offering, index) => {
      return offeringKey(offering, index) === selectedOfferingKey;
    });
  }, [computeOfferings, selectedOfferingKey]);

  const selectedPackage: ProductPackage | null = useMemo(() => {
    if (!selectedOffering) return null;
    return (
      selectedOffering.packages?.[selectedPackageIndex] ??
      selectedOffering.packages?.[0] ??
      null
    );
  }, [selectedOffering, selectedPackageIndex]);

  // Get similar products (same category, excluding current product)
  const similarProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter(
        (p) =>
          p.id !== product.id && p.category && p.category === product.category
      )
      .slice(0, 5);
  }, [allProducts, product]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "₫";
  };

  const currentPrice = selectedPackage?.price ?? product?.price ?? 0;

  const currentOriginalPrice =
    selectedPackage?.originalPrice ?? product?.originalPrice ?? undefined;

  const currentDiscount = (() => {
    if (product?.discountPercentage) return product.discountPercentage;
    if (currentPrice && currentOriginalPrice) {
      const diff =
        100 - Math.round((currentPrice / currentOriginalPrice) * 100);
      return diff > 0 ? diff : null;
    }
    return null;
  })();

  const handleAddToCart = () => {
    if (!product) return;

    const selectedLabelParts = [
      selectedOffering?.label || selectedOffering?.type,
      selectedPackage?.duration,
    ].filter(Boolean);

    addToCart({
      productId: product.id,
      productName: product.name,
      productImage:
        product.image ??
        product.image_url ??
        "https://via.placeholder.com/400x200.png?text=Product",
      optionId:
        selectedOfferingKey && selectedPackage
          ? `${selectedOfferingKey}:${selectedPackageIndex}`
          : undefined,
      optionLabel:
        selectedLabelParts.length > 0
          ? selectedLabelParts.join(" - ")
          : undefined,
      price: currentPrice,
      quantity: 1,
    });

    // Show notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Không tìm thấy sản phẩm
          </h1>
          <p className="text-gray-500 text-sm">
            {error
              ? "Đã xảy ra lỗi khi tải dữ liệu."
              : "Sản phẩm có thể đã bị xóa."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const productImage = (() => {
    const src = product.image ?? product.image_url ?? "";
    if (!src) return "https://via.placeholder.com/640x360.png?text=Product";
    if (/^https?:/i.test(src)) return src;
    return `${import.meta.env.BASE_URL}${src}`;
  })();

  const availablePackages = selectedOffering?.packages ?? [];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={cartSidebarOpen}
        onClose={() => setCartSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header with back button */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16">
            {/* Back Button */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="text-lg" />
              <span className="font-medium">Quay lại</span>
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setCartSidebarOpen(true)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <FaShoppingCart className="text-2xl text-gray-700" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {items.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Product Details Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Product Image */}
              <div className="bg-white rounded-xl overflow-hidden border border-gray-200 self-start">
                <img
                  src={productImage}
                  alt={product.name}
                  className="w-full h-auto"
                  style={{ display: "block" }}
                />
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                {/* Product Title */}
                <h1 className="text-2xl font-bold text-gray-900">
                  {product.name}
                </h1>

                {/* Product Stats */}
                <div className="flex gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <FaStar className="text-yellow-500" />
                    <span>Chưa có đánh giá</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaHeart className="text-pink-500" />
                    <span>{product.likes || 0} yêu thích</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaShoppingCart className="text-green-600" />
                    <span>{product.sold || 0} đã bán</span>
                  </div>
                </div>

                {/* Price */}
                <div className="py-3 border-y">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-3xl font-bold text-red-600">
                      {formatPrice(currentPrice)}
                    </span>
                    {currentOriginalPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(currentOriginalPrice)}
                      </span>
                    )}
                  </div>
                  {currentDiscount && (
                    <div>
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                        Giảm {currentDiscount}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Details Info */}
                <div className="space-y-2 text-xs">
                  {product.status && (
                    <div className="flex items-center gap-2">
                      <FaBox className="text-gray-500" />
                      <span className="text-gray-500">Tình trạng:</span>
                      <span
                        className={`font-medium ${
                          product.status === "inStock"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.status === "inStock" ? "Còn hàng" : "Hết hàng"}
                      </span>
                    </div>
                  )}
                  {product.upgradeMethod && (
                    <div className="flex items-center gap-2">
                      <FaArrowUp className="text-gray-500" />
                      <span className="text-gray-500">Hình thức nâng cấp:</span>
                      <span className="font-medium text-gray-900">
                        {product.upgradeMethod}
                      </span>
                    </div>
                  )}
                  {product.warranty && (
                    <div className="flex items-center gap-2">
                      <FaShieldAlt className="text-gray-500" />
                      <span className="text-gray-500">Thời gian bảo hành:</span>
                      <span className="font-medium text-gray-900">
                        {product.warranty}
                      </span>
                    </div>
                  )}
                </div>

                {/* Offering Selection */}
                {computeOfferings.length > 0 && (
                  <div className="space-y-4 pt-2">
                    {computeOfferings.length > 1 && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          Chọn hình thức
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {computeOfferings.map((offering, index) => {
                            const key = offeringKey(offering, index);
                            const label =
                              offering.label ||
                              offering.type ||
                              `Gói ${index + 1}`;
                            return (
                              <button
                                key={key}
                                onClick={() => {
                                  setSelectedOfferingKey(key);
                                  setSelectedPackageIndex(0);
                                }}
                                className={`px-4 py-2 rounded-lg font-medium transition-all border-2 text-sm ${
                                  selectedOfferingKey === key
                                    ? "border-blue-500 bg-blue-500 text-white shadow-md"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                                }`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {availablePackages.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          Chọn gói
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {availablePackages.map((pkg, index) => (
                            <button
                              key={`${selectedOfferingKey ?? "pkg"}-${index}`}
                              onClick={() => setSelectedPackageIndex(index)}
                              className={`px-4 py-2 rounded-lg font-medium transition-all border-2 text-sm ${
                                selectedPackageIndex === index
                                  ? "border-blue-500 bg-blue-500 text-white shadow-md"
                                  : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                              }`}
                            >
                              <div className="flex flex-col text-left">
                                <span>
                                  {pkg.duration || `Gói ${index + 1}`}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatPrice(pkg.price)}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      handleAddToCart();
                      setCartSidebarOpen(true);
                    }}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold text-sm hover:bg-blue-600 transition flex items-center justify-center gap-2"
                  >
                    Mua ngay
                  </button>
                  <button
                    onClick={() => {
                      handleAddToCart();
                    }}
                    className="w-12 h-12 bg-blue-50 border-2 border-blue-200 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center justify-center"
                  >
                    <FaShoppingCart className="text-lg" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Description Section */}
            <div className="bg-gray-50 rounded-xl p-6 lg:p-8 space-y-4 mb-12">
              <h3 className="font-bold text-gray-900 text-xl lg:text-2xl">
                Mô tả sản phẩm
              </h3>
              <div className="text-gray-600 space-y-4 text-base lg:text-lg leading-relaxed">
                {product.descriptionMarkdown || product.description ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {product.descriptionMarkdown || product.description || ""}
                  </ReactMarkdown>
                ) : (
                  <p className="text-sm text-gray-500">
                    Thông tin chi tiết đang được cập nhật.
                  </p>
                )}
              </div>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Sản phẩm tương tự
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {similarProducts.map((similarProduct) => (
                    <ProductCard
                      key={similarProduct.id}
                      product={similarProduct}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition flex items-center justify-center">
          <FaPhoneAlt className="text-2xl" />
        </button>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-24 right-6 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-semibold">
              Đã thêm vào giỏ hàng thành công!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
