export interface Review {
  id: string;
  message: string;
  rating: string;
  date_created: string;
  user: User;
  reviewer: User;
}

export interface UserPortfolio {
  id: string;
  image: string;
  title: string;
  created_at: string;
  user: User;
}

export interface HalfUser {
  id: string;
  name: string;
  profile_photo: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone_number: string;
  bio?: string;
  location?: string;
  is_worker?: boolean;
  profile_photo: string | null;
  date_joined: string;
  reviews?: Review[];
  rating?: string;
  user_portfolio?: UserPortfolio[];
  jobs_completed: number;
  is_verified: boolean;
}