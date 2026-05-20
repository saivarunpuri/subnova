import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export interface OTTBrandData {
  _id: string;
  name: string;
  category: string;
  logo: string;
  description: string;
}

export interface PackData {
  _id: string;
  brand: string | OTTBrandData;
  title: string;
  price: number;
  originalPrice: number;
  validity: string;
  features: string[];
  description: string;
}

// Fetch Brands
export const useBrands = (category?: string) => {
  return useQuery<OTTBrandData[]>({
    queryKey: ['brands', category],
    queryFn: async () => {
      const { data } = await api.get('/ott/brands', { params: { category } });
      return data;
    },
  });
};

// Fetch Packs
export const usePacks = (brandId?: string) => {
  return useQuery<PackData[]>({
    queryKey: ['packs', brandId],
    queryFn: async () => {
      const { data } = await api.get('/ott/packs', { params: { brandId } });
      return data;
    },
    enabled: true,
  });
};

// Fetch Single Pack by ID
export const usePackById = (packId?: string) => {
  return useQuery<PackData>({
    queryKey: ['pack', packId],
    queryFn: async () => {
      const { data } = await api.get(`/ott/packs/${packId}`);
      return data;
    },
    enabled: !!packId,
  });
};

// ==================== ADMIN MUTATIONS ====================

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newBrand: Omit<OTTBrandData, '_id'>) => {
      const { data } = await api.post('/ott/brands', newBrand);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updatedBrand }: Partial<OTTBrandData> & { id: string }) => {
      const { data } = await api.put(`/ott/brands/${id}`, updatedBrand);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/ott/brands/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      queryClient.invalidateQueries({ queryKey: ['packs'] });
    },
  });
};

export const useCreatePack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPack: Omit<PackData, '_id'>) => {
      const { data } = await api.post('/ott/packs', newPack);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packs'] });
    },
  });
};

export const useUpdatePack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updatedPack }: Partial<PackData> & { id: string }) => {
      const { data } = await api.put(`/ott/packs/${id}`, updatedPack);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packs'] });
    },
  });
};

export const useDeletePack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/ott/packs/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packs'] });
    },
  });
};
