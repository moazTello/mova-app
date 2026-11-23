export type Rating = {
  id: string;
  rating: number;
  review?: string | null;
  user?: { id: string; name: string; profile_image?: string | null };
  user_id?: string;
  created_at?: string;
};

export const ratingUserId = (r: Rating) => r.user?.id ?? r.user_id;