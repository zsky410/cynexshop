import { useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { products } from "../data/products";
import NewHeader from "../components/NewHeader";
import Sidebar from "../components/Sidebar";
import Banner from "../components/Banner";
import ProductSection from "../components/ProductSection";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const bestSellers = products.filter((p) => p.isBestSeller);
  const newProducts = products.filter((p) => p.isNew);

  // If no products filtered, use first 4 and last 4
  const section1Products =
    bestSellers.length > 0 ? bestSellers : products.slice(0, 4);
  const section2Products =
    newProducts.length > 0 ? newProducts : products.slice(4, 8);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <NewHeader onMenuClick={toggleSidebar} />

        <main className="flex-1 p-4 lg:p-6">
          <Banner />

          <ProductSection title="Sản phẩm mới" products={section2Products} />

          <ProductSection
            title="Sản phẩm bán chạy"
            products={section1Products}
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
