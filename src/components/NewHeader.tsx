import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaSun,
  FaBars,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";

interface NewHeaderProps {
  onMenuClick: () => void;
}

const NewHeader = ({ onMenuClick }: NewHeaderProps) => {
  const navigate = useNavigate();
  const { items, getTotal } = useCart();
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="h-16 flex items-center justify-between px-4 lg:px-6">
        {/* Menu button for mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <FaBars className="text-2xl text-gray-700" />
        </button>

        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/logo/logo_full.png`}
            alt="CynexShop Logo"
            className="h-6 sm:h-8 object-contain"
          />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4 lg:mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              className="w-full pl-10 pr-4 lg:pr-16 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm lg:text-base"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <span className="hidden lg:inline absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
              ⌘K
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Cart */}
          <button
            onClick={() =>
              alert(
                `Giỏ hàng: ${cartItemCount} sản phẩm\nTổng tiền: ${getTotal().toLocaleString(
                  "vi-VN"
                )}₫`
              )
            }
            className="relative p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FaShoppingCart className="text-xl lg:text-2xl text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Theme Toggle - hidden on mobile */}
          <button className="hidden md:block p-2 rounded-lg hover:bg-gray-100 transition">
            <FaSun className="text-xl lg:text-2xl text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default NewHeader;
