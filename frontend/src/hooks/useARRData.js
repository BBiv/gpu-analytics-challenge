import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export const useARRData = () => {
  return useQuery({
    queryKey: ['arr-data'],
    queryFn: () => apiClient.get('/api/arr-data'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
