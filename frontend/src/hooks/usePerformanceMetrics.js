import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export const usePerformanceMetrics = () => {
  return useQuery({
    queryKey: ['servers'],
    queryFn: () => apiClient.get('/api/servers'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
