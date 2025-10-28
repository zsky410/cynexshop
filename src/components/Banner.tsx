const Banner = () => {
  return (
    <div className="mb-6 lg:mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl lg:rounded-2xl p-6 lg:p-8 text-white">
        <h2 className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-3">
          Chào mừng đến với CynexShop
        </h2>
        <p className="text-blue-100 mb-4 lg:mb-6 text-sm lg:text-lg">
          Tài khoản Premium giá tốt nhất thị trường - An toàn, uy tín, nhanh
          chóng
        </p>
        <button className="bg-yellow-400 text-yellow-900 px-5 py-2.5 lg:px-6 lg:py-3 rounded-xl font-bold hover:bg-yellow-300 transition text-sm lg:text-base">
          Khám phá ngay
        </button>
      </div>
    </div>
  );
};

export default Banner;
