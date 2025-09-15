import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import api from '@/lib/api';
import { Job, TaskType, User } from '@/shared/types/job';

interface TasksResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Job[];
}

const calculateUserRating = (reviews: User['reviews'] = []) => {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, review) => acc + Number(review.rating), 0);
  return sum / reviews.length;
};

export const useClientTasks = ({ type }: { type: TaskType }) => {
  const { token } = useAuthStore();

  const query = useInfiniteQuery<TasksResponse>({
    queryKey: ['client-tasks', type],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const endpoint = `user/jobs/${type}/`;
      const response = await api.get<TasksResponse>(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: pageParam,
          _t: Date.now(), // Prevent caching
        },
      });

      const validTasks = response.data.results
        .filter((task) => task && typeof task === 'object' && 'id' in task)
        .map((task) => ({
          ...task,
          uniqueId: `page${pageParam}_task${task.id}`,
          
          worker: task.bidding_details?.[0]?.worker
            ? {
                ...task.bidding_details[0].worker,
                rating: calculateUserRating(task.bidding_details[0].worker.reviews),
              }
            : undefined,
        }));

      return {
        ...response.data,
        results: validTasks,
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      const nextPage = url.searchParams.get('page');
      return nextPage ? Number(nextPage) : undefined;
    },
    enabled: !!token,
  });

  return {
    tasks: query.data?.pages.flatMap((page) => page.results) || [],
    loading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
    hasNextPage: query.hasNextPage || false,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isFetching: query.isFetching,
    onRefresh: query.refetch,
    loadMore: query.fetchNextPage,
  };
};
