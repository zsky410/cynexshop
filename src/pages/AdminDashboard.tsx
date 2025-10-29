import { useEffect, useMemo, useState } from "react";
import {
  FaArrowRight,
  FaChartLine,
  FaCloudUploadAlt,
  FaLayerGroup,
  FaPlus,
  FaSave,
  FaStar,
  FaTag,
  FaTrashAlt,
} from "react-icons/fa";
import type { Product, ProductOption } from "../types";
import { categories, products as staticProducts } from "../data/products";

type ProductStatus = "inStock" | "outOfStock";

type ProductDraft = {
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  status: ProductStatus;
  warranty: string;
  upgradeMethod: string;
  image: string;
  description: string;
  fulfillmentType: "account" | "upgrade" | "key";
  isNew: boolean;
  isBestSeller: boolean;
};

const defaultDraft: ProductDraft = {
  name: "",
  category: categories[0]?.name ?? "Giải trí",
  price: 0,
  originalPrice: 0,
  discountPercentage: 0,
  status: "inStock",
  warranty: "",
  upgradeMethod: "",
  image: "",
  description: "",
  fulfillmentType: "account",
  isNew: true,
  isBestSeller: false,
};

const createEmptyOption = (index: number): ProductOption => ({
  id: `draft-option-${index}`,
  label: "",
  duration: "",
  price: 0,
  originalPrice: 0,
  discountPercentage: 0,
});

const fulfillmentOptions = [
  { value: "account", label: "Tài khoản" },
  { value: "upgrade", label: "Nâng cấp" },
  { value: "key", label: "Key bản quyền" },
];

const statusOptions: { value: ProductStatus; label: string }[] = [
  { value: "inStock", label: "Còn hàng" },
  { value: "outOfStock", label: "Hết hàng" },
];

const AdminDashboard = () => {
  const [draft, setDraft] = useState<ProductDraft>(defaultDraft);
  const [options, setOptions] = useState<ProductOption[]>([
    createEmptyOption(1),
  ]);
  const [optionCounter, setOptionCounter] = useState(2);
  const [inventory, setInventory] = useState<Product[]>(staticProducts);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = window.setTimeout(() => setToastMessage(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const totalInventoryValue = useMemo(
    () => inventory.reduce((sum, product) => sum + (product.price || 0), 0),
    [inventory]
  );

  const totalPlans = useMemo(
    () =>
      inventory.reduce(
        (acc, product) => acc + (product.options?.length ?? 0),
        0
      ),
    [inventory]
  );

  const featuredCount = useMemo(
    () => inventory.filter((item) => item.isBestSeller || item.isNew).length,
    [inventory]
  );

  const handleDraftChange = <K extends keyof ProductDraft>(
    key: K,
    value: ProductDraft[K]
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleOptionChange = (
    optionId: string,
    key: keyof ProductOption,
    value: ProductOption[keyof ProductOption]
  ) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === optionId
          ? {
              ...opt,
              [key]:
                key === "price" ||
                key === "originalPrice" ||
                key === "discountPercentage"
                  ? Number(value) || 0
                  : value,
            }
          : opt
      )
    );
  };

  const handleAddOption = () => {
    setOptions((prev) => [...prev, createEmptyOption(optionCounter)]);
    setOptionCounter((prev) => prev + 1);
  };

  const handleRemoveOption = (optionId: string) => {
    setOptions((prev) => prev.filter((opt) => opt.id !== optionId));
  };

  const resetForm = () => {
    setDraft(defaultDraft);
    setOptions([createEmptyOption(1)]);
    setOptionCounter(2);
  };

  const buildProductPayload = (): Product => {
    const sanitizedOptions = options
      .filter((opt) => opt.label.trim() && opt.price > 0)
      .map((opt, index) => ({
        ...opt,
        id: opt.id || `draft-option-${index}`,
      }));

    const identifier = `draft-${Date.now()}`;

    return {
      id: identifier,
      name: draft.name || "Sản phẩm mới",
      price: Number(draft.price) || 0,
      originalPrice: draft.originalPrice
        ? Number(draft.originalPrice)
        : undefined,
      image: draft.image || "assets/banner-product/placeholder.svg",
      category: draft.category || "Khác",
      discountPercentage: draft.discountPercentage || undefined,
      options: sanitizedOptions.length > 0 ? sanitizedOptions : undefined,
      status: draft.status,
      warranty: draft.warranty || undefined,
      upgradeMethod: draft.upgradeMethod || undefined,
      isNew: draft.isNew,
      isBestSeller: draft.isBestSeller,
      fulfillmentType: draft.fulfillmentType,
      description: draft.description || undefined,
    };
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newProduct = buildProductPayload();

    setInventory((prev) => [newProduct, ...prev]);
    setPreviewProduct(newProduct);
    setToastMessage(
      "Đã lưu bản nháp sản phẩm. Bạn có thể tiếp tục tinh chỉnh hoặc tích hợp API sau."
    );
  };

  const handleSaveDraft = () => {
    const newProduct = buildProductPayload();
    setPreviewProduct(newProduct);
    setToastMessage("Bản xem trước đã được cập nhật.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="uppercase tracking-[0.4em] text-xs text-blue-400/80 font-semibold">
              Admin Workspace
            </p>
            <h1 className="mt-3 text-4xl font-bold text-white">
              Quản lý sản phẩm
            </h1>
            <p className="mt-2 max-w-2xl text-slate-400">
              Thiết kế trang admin chuẩn bị cho tính năng CRUD. Thêm, chỉnh sửa
              các gói dịch vụ, cập nhật mô tả, hình thức phân phối và danh mục
              sản phẩm trong giao diện trực quan.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 hover:bg-blue-500/20 transition"
          >
            <FaStar className="text-blue-300" />
            Lưu bản xem trước
          </button>
        </header>

        {toastMessage && (
          <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/10 px-5 py-4 text-sm text-blue-200 shadow-lg shadow-blue-900/20">
            {toastMessage}
          </div>
        )}

        <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Tổng sản phẩm
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {inventory.length}
                </p>
              </div>
              <span className="rounded-full bg-blue-500/10 p-3 text-blue-300">
                <FaLayerGroup />
              </span>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Bao gồm cả sản phẩm đã nhập và bản nháp mới.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Danh mục
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {categories.length}
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/10 p-3 text-emerald-300">
                <FaTag />
              </span>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Thiết lập danh mục phù hợp cho từng sản phẩm.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Tổng gói dịch vụ
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {totalPlans}
                </p>
              </div>
              <span className="rounded-full bg-purple-500/10 p-3 text-purple-300">
                <FaPlus />
              </span>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Số lượng gói (thời hạn) đang gắn với sản phẩm.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Sản phẩm nổi bật
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {featuredCount}
                </p>
              </div>
              <span className="rounded-full bg-amber-500/10 p-3 text-amber-300">
                <FaChartLine />
              </span>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Đánh dấu sản phẩm mới hoặc bán chạy để ưu tiên hiển thị.
            </p>
          </div>
        </section>

        <section className="mt-12 grid gap-8 xl:grid-cols-[2.1fr,1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:p-8 backdrop-blur"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Thông tin sản phẩm
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Nhập thông tin cơ bản, gói thời hạn và nội dung mô tả.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:border-white/30 transition"
                >
                  Làm mới biểu mẫu
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600"
                >
                  <FaSave />
                  Lưu vào danh sách
                </button>
              </div>
            </div>

            <div className="mt-8 space-y-10">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Cơ bản
                </h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                      Tên sản phẩm
                    </span>
                    <input
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                      placeholder="Ví dụ: Netflix Premium"
                      value={draft.name}
                      onChange={(event) =>
                        handleDraftChange("name", event.target.value)
                      }
                      required
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                      Danh mục
                    </span>
                    <select
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                      value={draft.category}
                      onChange={(event) =>
                        handleDraftChange("category", event.target.value)
                      }
                    >
                      {categories.map((category) => (
                        <option
                          value={category.name}
                          key={category.id}
                          className="bg-slate-900"
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                      Giá bán
                    </span>
                    <input
                      type="number"
                      min={0}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                      placeholder="VD: 399000"
                      value={draft.price}
                      onChange={(event) =>
                        handleDraftChange("price", Number(event.target.value))
                      }
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                      Giá gốc
                    </span>
                    <input
                      type="number"
                      min={0}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                      placeholder="VD: 1800000"
                      value={draft.originalPrice}
                      onChange={(event) =>
                        handleDraftChange(
                          "originalPrice",
                          Number(event.target.value)
                        )
                      }
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                      Giảm giá (%)
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                      placeholder="VD: 78"
                      value={draft.discountPercentage}
                      onChange={(event) =>
                        handleDraftChange(
                          "discountPercentage",
                          Number(event.target.value)
                        )
                      }
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                      Tình trạng kho
                    </span>
                    <div className="flex gap-2 rounded-xl border border-white/10 bg-slate-900/60 p-1 text-sm">
                      {statusOptions.map((statusOption) => (
                        <button
                          type="button"
                          key={statusOption.value}
                          onClick={() =>
                            handleDraftChange("status", statusOption.value)
                          }
                          className={`flex-1 rounded-lg px-3 py-2 font-medium transition ${
                            draft.status === statusOption.value
                              ? "bg-blue-500/80 text-white shadow-lg"
                              : "text-slate-400 hover:bg-white/5"
                          }`}
                        >
                          {statusOption.label}
                        </button>
                      ))}
                    </div>
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                      Hình thức bán
                    </span>
                    <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-slate-900/60 p-1 text-sm">
                      {fulfillmentOptions.map((fulfillment) => (
                        <button
                          type="button"
                          key={fulfillment.value}
                          onClick={() =>
                            handleDraftChange(
                              "fulfillmentType",
                              fulfillment.value as ProductDraft["fulfillmentType"]
                            )
                          }
                          className={`rounded-lg px-3 py-2 font-medium transition ${
                            draft.fulfillmentType === fulfillment.value
                              ? "bg-blue-500/80 text-white shadow-lg"
                              : "text-slate-400 hover:bg-white/5"
                          }`}
                        >
                          {fulfillment.label}
                        </button>
                      ))}
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Ưu tiên hiển thị
                </h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleDraftChange("isNew", !draft.isNew)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                      draft.isNew
                        ? "border-emerald-400/70 bg-emerald-500/10 text-emerald-200 shadow-lg shadow-emerald-500/20"
                        : "border-white/10 text-slate-300 hover:border-white/30"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    Gắn nhãn "Sản phẩm mới"
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDraftChange("isBestSeller", !draft.isBestSeller)
                    }
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                      draft.isBestSeller
                        ? "border-amber-400/70 bg-amber-500/10 text-amber-200 shadow-lg shadow-amber-500/20"
                        : "border-white/10 text-slate-300 hover:border-white/30"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    Đánh dấu "Bán chạy"
                  </button>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                    Thông tin bảo hành & hỗ trợ
                  </h3>
                  <div className="mt-4 space-y-4">
                    <label className="flex flex-col gap-2">
                      <span className="text-xs uppercase tracking-wide text-slate-400">
                        Thời gian bảo hành
                      </span>
                      <input
                        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                        placeholder="VD: Bảo hành trọn đời"
                        value={draft.warranty}
                        onChange={(event) =>
                          handleDraftChange("warranty", event.target.value)
                        }
                      />
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="text-xs uppercase tracking-wide text-slate-400">
                        Hình thức nâng cấp / ghi chú vận hành
                      </span>
                      <input
                        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                        placeholder="VD: Gia hạn trực tiếp bằng email khách"
                        value={draft.upgradeMethod}
                        onChange={(event) =>
                          handleDraftChange("upgradeMethod", event.target.value)
                        }
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                    Ảnh đại diện sản phẩm
                  </h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-[1.2fr,1fr]">
                    <label className="flex flex-col gap-2">
                      <span className="text-xs uppercase tracking-wide text-slate-400">
                        Đường dẫn hình ảnh
                      </span>
                      <div className="relative flex items-center">
                        <FaCloudUploadAlt className="absolute left-3 text-slate-500" />
                        <input
                          className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-10 py-3 text-sm text-white placeholder-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                          placeholder="assets/banner-product/Netflix.png"
                          value={draft.image}
                          onChange={(event) =>
                            handleDraftChange("image", event.target.value)
                          }
                        />
                      </div>
                      <span className="text-xs text-slate-500">
                        Sử dụng đường dẫn từ thư mục `public/assets` hoặc URL
                        ngoài.
                      </span>
                    </label>

                    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-2 text-center">
                      {draft.image ? (
                        <img
                          src={`${import.meta.env.BASE_URL}${draft.image}`}
                          alt="Product preview"
                          className="h-28 w-full rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-28 w-full items-center justify-center rounded-lg border border-dashed border-white/10 text-xs text-slate-500">
                          Xem trước hình ảnh
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Gói dịch vụ / thời hạn
                </h3>
                <div className="mt-4 space-y-4">
                  {options.map((option) => (
                    <div
                      key={option.id}
                      className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/40"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h4 className="text-sm font-semibold text-white">
                          Gói {option.label ? option.label : "mới"}
                        </h4>
                        {options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(option.id)}
                            className="inline-flex items-center gap-2 rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-300 transition hover:border-red-400 hover:text-red-200"
                          >
                            <FaTrashAlt /> Xoá gói
                          </button>
                        )}
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <label className="flex flex-col gap-2">
                          <span className="text-xs uppercase tracking-wide text-slate-400">
                            Tên gói
                          </span>
                          <input
                            className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                            placeholder="Gói 1 tháng"
                            value={option.label}
                            onChange={(event) =>
                              handleOptionChange(
                                option.id,
                                "label",
                                event.target.value
                              )
                            }
                          />
                        </label>

                        <label className="flex flex-col gap-2">
                          <span className="text-xs uppercase tracking-wide text-slate-400">
                            Thời hạn hiển thị
                          </span>
                          <input
                            className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                            placeholder="30 ngày"
                            value={option.duration}
                            onChange={(event) =>
                              handleOptionChange(
                                option.id,
                                "duration",
                                event.target.value
                              )
                            }
                          />
                        </label>

                        <label className="flex flex-col gap-2">
                          <span className="text-xs uppercase tracking-wide text-slate-400">
                            Giá bán gói
                          </span>
                          <input
                            type="number"
                            min={0}
                            className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                            placeholder="129000"
                            value={option.price}
                            onChange={(event) =>
                              handleOptionChange(
                                option.id,
                                "price",
                                Number(event.target.value)
                              )
                            }
                          />
                        </label>

                        <label className="flex flex-col gap-2">
                          <span className="text-xs uppercase tracking-wide text-slate-400">
                            Giá gốc gói
                          </span>
                          <input
                            type="number"
                            min={0}
                            className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                            placeholder="550000"
                            value={option.originalPrice ?? 0}
                            onChange={(event) =>
                              handleOptionChange(
                                option.id,
                                "originalPrice",
                                Number(event.target.value)
                              )
                            }
                          />
                        </label>

                        <label className="flex flex-col gap-2">
                          <span className="text-xs uppercase tracking-wide text-slate-400">
                            Giảm giá (%)
                          </span>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                            placeholder="78"
                            value={option.discountPercentage ?? 0}
                            onChange={(event) =>
                              handleOptionChange(
                                option.id,
                                "discountPercentage",
                                Number(event.target.value)
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="inline-flex items-center gap-2 rounded-full border border-dashed border-white/40 px-4 py-2 text-sm text-slate-200 transition hover:border-white hover:text-white"
                  >
                    <FaPlus /> Thêm gói mới
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Mô tả chi tiết sản phẩm
                </h3>
                <label className="mt-4 flex flex-col gap-2">
                  <span className="text-xs text-slate-500">
                    Viết nội dung nổi bật, quyền lợi & hướng dẫn cụ thể.
                  </span>
                  <textarea
                    rows={6}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                    placeholder="Ví dụ: Tài khoản chính chủ, giao ngay sau khi thanh toán, hỗ trợ 24/7..."
                    value={draft.description}
                    onChange={(event) =>
                      handleDraftChange("description", event.target.value)
                    }
                  />
                </label>
              </div>
            </div>
          </form>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-white">Xem trước</h3>
              <p className="mt-1 text-sm text-slate-400">
                Bản dựng sản phẩm sẽ hiển thị như khách hàng nhìn thấy.
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="overflow-hidden rounded-xl border border-white/5">
                  <div className="relative aspect-[2/1] w-full bg-slate-800">
                    <img
                      src={`${import.meta.env.BASE_URL}${
                        draft.image || "assets/banner-product/placeholder.svg"
                      }`}
                      alt="Product visual"
                      className="h-full w-full object-cover"
                    />
                    {draft.discountPercentage > 0 && (
                      <span className="absolute right-4 top-4 rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                        -{draft.discountPercentage}%
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 bg-slate-950/70 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-blue-300/80">
                          {draft.category || "Chưa phân loại"}
                        </p>
                        <h4 className="mt-1 text-lg font-semibold text-white">
                          {draft.name || "Tên sản phẩm"}
                        </h4>
                      </div>
                      <span className="rounded-full border border-blue-500/40 px-3 py-1 text-[11px] text-blue-200">
                        {draft.fulfillmentType === "account"
                          ? "Tài khoản"
                          : draft.fulfillmentType === "upgrade"
                          ? "Nâng cấp"
                          : "Key bản quyền"}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-3">
                      <span className="text-xl font-bold text-white">
                        {draft.price > 0
                          ? `${draft.price.toLocaleString("vi-VN")}₫`
                          : "Giá chưa đặt"}
                      </span>
                      {draft.originalPrice > 0 && (
                        <span className="text-sm text-slate-500 line-through">
                          {draft.originalPrice.toLocaleString("vi-VN")}₫
                        </span>
                      )}
                    </div>

                    {options.some((opt) => opt.label) && (
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Các gói khả dụng
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {options
                            .filter((opt) => opt.label)
                            .map((opt) => (
                              <span
                                key={opt.id}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-200"
                              >
                                {opt.label}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                    {draft.description && (
                      <p className="rounded-xl border border-white/5 bg-white/5 p-3 text-xs text-slate-300">
                        {draft.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-400">
                <p className="font-semibold text-white">
                  Tổng giá trị hàng tồn
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {totalInventoryValue.toLocaleString("vi-VN")}₫
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  Chỉ mang tính minh hoạ. Sau khi kết nối API, số liệu sẽ được
                  cập nhật trực tiếp.
                </p>
              </div>
            </div>

            {previewProduct && (
              <div className="rounded-3xl border border-emerald-400/40 bg-emerald-500/10 p-6 backdrop-blur">
                <p className="text-sm font-semibold text-emerald-200">
                  Đã tạo bản nháp:
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  {previewProduct.name}
                </p>
                <p className="mt-4 text-sm text-emerald-200/80">
                  Khi triển khai CRUD, gửi payload này tới API để lưu sản phẩm.
                </p>
                <pre className="mt-4 max-h-64 overflow-auto rounded-2xl bg-slate-950/80 p-4 text-xs text-emerald-100">
                  {JSON.stringify(previewProduct, null, 2)}
                </pre>
              </div>
            )}
          </aside>
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6 lg:p-8 backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Danh sách sản phẩm
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Xem nhanh các sản phẩm hiện có. Bạn sẽ kết nối với API để đồng
                bộ dữ liệu thật.
              </p>
            </div>

            <button className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/20">
              Quản lý nâng cao
              <FaArrowRight className="text-slate-200" />
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/5">
            <table className="min-w-full divide-y divide-white/10 text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3">Danh mục</th>
                  <th className="px-4 py-3">Giá</th>
                  <th className="px-4 py-3">Giảm</th>
                  <th className="px-4 py-3">Gói</th>
                  <th className="px-4 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {inventory.map((product) => (
                  <tr key={product.id} className="bg-slate-950/40">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-lg border border-white/10">
                          <img
                            src={`${import.meta.env.BASE_URL}${product.image}`}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {product.fulfillmentType === "account"
                              ? "Tài khoản"
                              : product.fulfillmentType === "upgrade"
                              ? "Nâng cấp"
                              : product.fulfillmentType === "key"
                              ? "Key bản quyền"
                              : "Khác"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      {product.category}
                    </td>
                    <td className="px-4 py-4 font-semibold text-white">
                      {(
                        product.price ??
                        product.basePrice ??
                        product.offerings?.[0]?.packages?.[0]?.price ??
                        0
                      ).toLocaleString("vi-VN")}
                      ₫
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      {product.discountPercentage
                        ? `${product.discountPercentage}%`
                        : "—"}
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      {product.options ? product.options.length : 0}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          product.status === "inStock"
                            ? "bg-emerald-500/10 text-emerald-200"
                            : "bg-red-500/10 text-red-200"
                        }`}
                      >
                        {product.status === "inStock" ? "Còn hàng" : "Hết hàng"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
