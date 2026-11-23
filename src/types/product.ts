export type ProductOption = {
  id: string;
  option_name: string;
  option_value: string;
};

export type ProductMedia = string | { id?: string; url?: string; image_url?: string; path?: string };

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  is_active: boolean;
  average_rating: number;
  ratings_count: number;
  category: { id: string; name: string };
  seller: { id: string; name: string };
  options: ProductOption[];
  images: ProductMedia[];
  videos: ProductMedia[];
  created_at: string;
};