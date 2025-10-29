export interface ProductOption {
  id: string;
  label: string;
  duration: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  rating?: number;
  discountPercentage?: number;
  options?: ProductOption[];
  // Additional product info
  likes?: number;
  sold?: number;
  status?: "inStock" | "outOfStock";
  warranty?: string;
  upgradeMethod?: string;
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
