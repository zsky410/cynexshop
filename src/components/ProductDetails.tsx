import { useParams, useNavigate } from "react-router-dom";
import { products } from "../data/products";
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
import ProductCard from "./ProductCard";
import CartSidebar from "./CartSidebar";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const { addToCart, items } = useCart();

  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(
    product?.options && product.options.length > 0
      ? product.options[0].id
      : null
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sản phẩm không tồn tại
          </h1>
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

  // Get similar products (same category, excluding current product)
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 5);

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "₫";
  };

  const getCurrentPrice = () => {
    if (product.options && product.options.length > 0 && selectedOption) {
      const option = product.options.find((opt) => opt.id === selectedOption);
      return option ? option.price : product.price;
    }
    return product.price;
  };

  const getCurrentOriginalPrice = () => {
    if (product.options && product.options.length > 0 && selectedOption) {
      const option = product.options.find((opt) => opt.id === selectedOption);
      return option ? option.originalPrice : product.originalPrice;
    }
    return product.originalPrice;
  };

  const getCurrentDiscount = () => {
    if (product.options && product.options.length > 0 && selectedOption) {
      const option = product.options.find((opt) => opt.id === selectedOption);
      return option ? option.discountPercentage : product.discountPercentage;
    }
    return product.discountPercentage;
  };

  const handleAddToCart = () => {
    const currentPrice = getCurrentPrice();
    const selectedOptionData = product.options?.find(
      (opt) => opt.id === selectedOption
    );

    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      optionId: selectedOption || undefined,
      optionLabel: selectedOptionData?.label || selectedOptionData?.duration,
      price: currentPrice,
      quantity: 1,
    });

    // Show notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

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
                  src={`${import.meta.env.BASE_URL}${product.image}`}
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
                      {formatPrice(getCurrentPrice())}
                    </span>
                    {getCurrentOriginalPrice() && (
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(getCurrentOriginalPrice()!)}
                      </span>
                    )}
                  </div>
                  {getCurrentDiscount() && (
                    <div>
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                        Giảm {getCurrentDiscount()}%
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

                {/* Options Selection */}
                {product.options && product.options.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Chọn thời hạn
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedOption(option.id)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all border-2 text-sm ${
                            selectedOption === option.id
                              ? "border-blue-500 bg-blue-500 text-white shadow-md"
                              : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
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
              <div className="text-gray-600 space-y-4 text-base lg:text-lg">
                <p>
                  Tài khoản được cung cấp đầy đủ quyền truy cập và sử dụng không
                  giới hạn các tính năng premium.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Cam kết chính hãng, bảo hành trọn đời</li>
                  <li>Giao tài khoản ngay sau khi thanh toán</li>
                  <li>Hỗ trợ kỹ thuật 24/7</li>
                  <li>Đổi trả miễn phí trong 7 ngày</li>
                </ul>
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
