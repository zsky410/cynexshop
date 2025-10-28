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
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}
