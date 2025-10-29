import { FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { items, getTotal, removeFromCart, updateQuantity } = useCart();

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "₫";
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Giỏ hàng</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <FaTimes className="text-xl text-gray-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Giỏ hàng trống</p>
                <p className="text-sm text-gray-400">
                  Thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.optionId || "default"}`}
                    className="bg-gray-50 rounded-xl p-4 flex gap-4"
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}${item.productImage}`}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-sm mb-1">
                        {item.productName}
                      </h3>
                      {item.optionLabel && (
                        <p className="text-xs text-gray-600 mb-2">
                          {item.optionLabel}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-red-600">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1,
                                item.optionId
                              )
                            }
                            className="w-6 h-6 rounded border border-gray-300 hover:bg-gray-200 transition text-xs"
                          >
                            -
                          </button>
                          <span className="text-sm text-gray-700 w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity + 1,
                                item.optionId
                              )
                            }
                            className="w-6 h-6 rounded border border-gray-300 hover:bg-gray-200 transition text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        removeFromCart(item.productId, item.optionId)
                      }
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-gray-900">Tổng cộng:</span>
                <span className="font-bold text-red-600 text-xl">
                  {formatPrice(getTotal())}
                </span>
              </div>
              <button className="w-full bg-blue-500 text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition">
                Thanh toán
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default CartSidebar;
