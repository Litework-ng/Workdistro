import type {User} from '@/shared/types/user';

export interface Review {
  id: number;
  rating: string;
  message: string;
  date_created: string;
  user: User;
  reviewer: User;
}



export interface WorkerBid {
  id: number;
  bid: string;
  cover_letter: string;
  status?: 'pending' | 'accepted' | 'in_progress' | 'completed';
  date_created: string;
  worker: User;
  job: number;
  reviews?: Review[];
}

export interface JobImage {
  id: number;
  image_url: string;
}

export interface BidDetails {
  id: string;
  worker: User;
  bid: string;
  cover_letter: string;
  status?: 'pending' | 'accepted' | 'in_progress' | 'completed';
  date_created: string;
}

export interface JobImage {
  id: number;
  image: string;
}

export interface Job {
  id:  string;
  user: User;
  worker?: User;
  images?: JobImage[];
  subject: string;
  description: string;
  budget: number;
  bid_amount?: string;
  location: string;
    status?: 'pending' | 'accepted' | 'in_progress' | 'completed';
  date_created: string;
  cancel_reason: string | null;
  service_cat: number;
  bidding_details?: BidDetails[];
  worker_bid?: WorkerBid;
  bid_id?: string;
  cover_letter?: string;
}

export type TaskType = 'bids' | 'in-progress' | 'completed' | 'pending';
export type UserType = 'client' | 'worker';


