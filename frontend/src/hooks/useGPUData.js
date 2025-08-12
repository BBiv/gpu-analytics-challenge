import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export const useGPUData = () => {
  return useQuery({
    queryKey: ['gpu-performance'],
    queryFn: () => apiClient.get('/api/gpu-performance'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
