export interface ProductOption {
  id: string;
  label: string;
  duration: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
}

export interface ProductPackage {
  duration: string;
  price: number;
  originalPrice?: number;
}

export interface ProductOffering {
  id?: string;
  type?: string;
  label?: string;
  description?: string;
  packages: ProductPackage[];
}

export interface Product {
  id: string;
  slug?: string | null;
  name: string;
  price?: number | null;
  originalPrice?: number | null;
  image?: string | null;
  image_url?: string | null;
  category?: string | null;
  isNew?: boolean | null;
  isBestSeller?: boolean | null;
  rating?: number | null;
  discountPercentage?: number | null;
  options?: ProductOption[];
  offerings?: ProductOffering[];
  basePrice?: number | null;
  baseOriginalPrice?: number | null;
  // Additional product info
  likes?: number | null;
  sold?: number | null;
  status?: "inStock" | "outOfStock" | null;
  warranty?: string | null;
  upgradeMethod?: string | null;
  fulfillmentType?: "account" | "upgrade" | "key" | string | null;
  description?: string | null;
  descriptionMarkdown?: string | null;
}

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  optionId?: string;
  optionLabel?: string;
  price: number;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}
