import { useQuery } from '@tanstack/react-query';
import { Job } from '@/shared/types/job';
import  api  from '@/lib/api';
import { useAuthStore } from '@/shared/stores/useAuthStore';

// useJob.ts
export const useJob = (jobId: string) => {
const { token } = useAuthStore();

  const query = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const response = await api.get<Job>(`job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!token && !!jobId,
  });

  return {
    job: query.data,
    loading: query.isLoading,
    error: query.error as Error | null,
  };
};