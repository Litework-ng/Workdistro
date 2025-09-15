import {User} from "@/shared/types/user";


  
  interface HalfUser {
    id: number;
    name: string;
    profile_photo?: string;
  }
  
  
  export interface AuthResponse {
    access_token: string;
    user: User;
  }