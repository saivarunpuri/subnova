import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useBundles = (category?: string) => {
  return useQuery({
    queryKey: ['bundles', category],
    queryFn: async () => {
      const { data } = await api.get('/bundles', { params: { category } });
      return data;
    },
  });
};
