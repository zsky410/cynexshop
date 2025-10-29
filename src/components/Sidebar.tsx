import { Link } from "react-router-dom";
import {
  FaHome,
  FaFilm,
  FaBook,
  FaCloud,
  FaPalette,
  FaLock,
  FaBriefcase,
  FaTools,
  FaLaptop,
  FaRobot,
  FaShieldAlt,
  FaComments,
  FaFacebook,
} from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64 bg-gray-50 border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          overflow-y-auto no-scrollbar
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6 pt-20">
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-4">
            Danh mục sản phẩm
          </h2>
          <nav className="space-y-1">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium"
            >
              <FaHome className="text-lg" />
              Home
            </Link>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FaFilm className="text-lg" />
              Giải trí
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FaBook className="text-lg" />
              Học tập
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FaCloud className="text-lg" />
              Lưu trữ
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FaPalette className="text-lg" />
              Edit Ảnh - Video
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FaLock className="text-lg" />
              VPN
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FaBriefcase className="text-lg" />
              Windows - Office
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FaTools className="text-lg" />
              Tiện ích
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FaLaptop className="text-lg" />
              Làm việc
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FaRobot className="text-lg" />
              Công cụ AI
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FaShieldAlt className="text-lg" />
              Antivirus
            </a>
          </nav>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xs font-semibold text-gray-500 uppercase mb-4">
              Support
            </h2>
            <nav className="space-y-1">
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <FaComments className="text-lg" />
                Nhóm hỗ trợ Zalo
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <FaFacebook className="text-lg" />
                Hỗ trợ qua Facebook
              </a>
            </nav>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">https://cynexshop.com</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
