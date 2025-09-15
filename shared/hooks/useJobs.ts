import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import api from '@/lib/api';
import { Job } from '@/shared/types/job';

type JobType = 'bestMatches' | 'mostRecent';
type SortBy = 'budget' | 'date_created';

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Job[];
}

interface UseJobsParams {
  type: JobType;
  location : string | null;
  locationVersion : number;
}

export const useJobs = ({ type, location, locationVersion }: UseJobsParams) => {
  const { token } = useAuthStore();

  const sortBy: SortBy = type === 'bestMatches' ? 'budget' : 'date_created';

  const query = useInfiniteQuery<PaginatedResponse>({
    queryKey: ['jobs', type, location, locationVersion], // <-- Add location & locationVersion here
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await api.get<PaginatedResponse>('worker/feed/', {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          page: pageParam, 
          sort_by: sortBy,
          location, // <-- Pass location to API if needed
          _t: type === 'bestMatches' ? Date.now() : undefined 
        },
      });

      const validJobs = response.data.results
        .filter((job) => job && typeof job === 'object' && 'id' in job)
        .map((job, index) => ({
          ...job,
          uniqueId: type === 'bestMatches' 
            ? `${job.id}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
            : `page${pageParam}_job${job.id}`
        }));

      return {
        ...response.data,
        results: validJobs,
      };
    },
    getNextPageParam: (lastPage, _allPages) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      const nextPage = url.searchParams.get('page');
      return nextPage ? Number(nextPage) : undefined;
    },
    enabled: !!token,
  });

  return {
    jobs: query.data?.pages.flatMap((page) => page.results) || [],
    loading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
    hasNextPage: query.hasNextPage || false,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};
