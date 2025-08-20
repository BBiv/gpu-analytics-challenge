import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export const usePerformanceMetrics = (page = 1, perPage = 50) => {
  return useQuery({
    queryKey: ['servers', page, perPage],
    queryFn: () => apiClient.get(`/api/servers?page=${page}&per_page=${perPage}`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
} 