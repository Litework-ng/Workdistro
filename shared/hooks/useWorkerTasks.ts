import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import api from '@/lib/api';
import { Job, User, TaskType, } from '@/shared/types/job';

interface BidResponse {
  id: string;
  job: {
    id: string;
    user: User;
    images?: any[];
    subject: string;
    description: string;
    budget: number;
    location: string;
    status?: 'pending' | 'accepted' | 'in_progress' | 'completed';
    date_created: string;
    cancel_reason: string | null;
    service_cat: number;
  };
  worker: User;
  bid: number;
  cover_letter: string;
  status?: 'pending' | 'accepted' | 'in_progress' | 'completed';
  date_created: string;
}

interface TasksResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BidResponse[] | Job[];
}

interface WorkerBid {
  id: number;
  bid: string;
  cover_letter: string;
  status?: 'pending' | 'accepted' | 'in_progress' | 'completed';
  date_created: string;
  worker: number;
  job: number;
}

interface JobResponse extends Job {
  worker_bid?: WorkerBid;
}

const calculateUserRating = (reviews: User['reviews'] = []): number => {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, review) => acc + Number(review.rating), 0);
  return sum / reviews.length;
};

export function useWorkerTasks(type: TaskType) {
  const { token } = useAuthStore();
  const endpoint = type === 'bids' ? 'worker/bid/' : `worker/jobs/${type}/`;

  const query = useInfiniteQuery({
    queryKey: ['worker-tasks', type],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await api.get<TasksResponse>(endpoint, {
        params: { page: pageParam },
        headers: { Authorization: `Bearer ${token}` },
      });

      const results = type === 'bids'
        ? (response.data.results as BidResponse[]).map(bid => ({
            id: bid.job.id,
            subject: bid.job.subject,
            description: bid.job.description,
            budget: Number(bid.job.budget),
            location: bid.job.location,
            status: bid.job.status || 'pending',
            date_created: bid.job.date_created,
            images: bid.job.images || [],
            user: bid.job.user,
            service_cat: bid.job.service_cat,
            bid_amount: bid.bid.toString(),
            bid_id: bid.id,
            cover_letter: bid.cover_letter,
          }))
        : (response.data.results as JobResponse[]).map(task => ({
            ...task,
            status: task.status || 'pending',
            budget: Number(task.budget),
            images: task.images || [],
            user: {
              ...task.user,
              rating: calculateUserRating(task.user?.reviews || []),
            },
            // Add bid information from worker_bid
            bid_amount: task.worker_bid?.bid.toString() || '',
            bid_id: task.worker_bid?.id.toString() || '',
            cover_letter: task.worker_bid?.cover_letter || ''
          }));

      return {
        ...response.data,
        results,
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      try {
        const nextUrl = new URL(lastPage.next);
        return nextUrl.searchParams.get('page') 
          ? Number(nextUrl.searchParams.get('page')) 
          : undefined;
      } catch {
        return undefined;
      }
    },
    enabled: !!token,
  });

  return {
    tasks: query.data?.pages.flatMap(page => page.results) || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    loadMore: query.fetchNextPage,
    onRefresh: query.refetch,
  };
}
