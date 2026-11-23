export type UserRole = 'admin' | 'seller' | 'customer';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone_number?: string | null;
  phone_number_verified?: boolean;
  profile_image?: string | null;
  balance?: string;
  is_active?: boolean;
  // seller_info?: Record<string, any> | null;
  seller_info?: SellerInfo | null;
  created_at?: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type SellerInfo = {
  id: string;
  shop_name: string;
  major: string;
  shop_location: string;
  description: string;
  approval_status: ApprovalStatus;
  payment_url: string | null;
  id_front_image: string | null;
  id_back_image: string | null;
};