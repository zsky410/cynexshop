import { useMemo, useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import NewHeader from "../components/NewHeader";
import Sidebar from "../components/Sidebar";
import Banner from "../components/Banner";
import ProductSection from "../components/ProductSection";
import { useProducts } from "../hooks/useProducts";
import CartSidebar from "../components/CartSidebar";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const { products, newProducts, bestSellerProducts, loading, error } =
    useProducts();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { section1Products, section2Products } = useMemo(() => {
    if (products.length === 0) {
      return {
        section1Products: [] as typeof products,
        section2Products: [] as typeof products,
      };
    }
    // Chỉ lấy đúng các sản phẩm đã gán flag
    const bestSellers = bestSellerProducts;
    const newest = newProducts;
    return {
      section1Products: bestSellers,
      section2Products: newest,
    };
  }, [products, bestSellerProducts, newProducts]);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Global Header - full width */}
      <div className="fixed inset-x-0 top-0 z-50">
        <NewHeader
          onMenuClick={toggleSidebar}
          onCartClick={() => setCartSidebarOpen(true)}
        />
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={cartSidebarOpen}
        onClose={() => setCartSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <main className="flex-1 p-4 lg:p-6 pt-20 lg:pt-24">
          <Banner />

          <ProductSection
            title="Sản phẩm mới"
            products={section2Products}
            loading={loading}
            emptyMessage={
              error
                ? "Không lấy được dữ liệu sản phẩm."
                : "Chưa có sản phẩm mới"
            }
          />

          <ProductSection
            title="Sản phẩm bán chạy"
            products={section1Products}
            loading={loading}
            emptyMessage={
              error
                ? "Không lấy được dữ liệu sản phẩm."
                : "Chưa có sản phẩm bán chạy"
            }
          />
        </main>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition flex items-center justify-center">
          <FaPhoneAlt className="text-2xl" />
        </button>
      </div>
    </div>
  );
}

export default Home;
