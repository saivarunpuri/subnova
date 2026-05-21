import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export interface CouponData {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate: string;
  isActive: boolean;
  createdAt?: string;
}

export interface ValidationResponse {
  valid: boolean;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  discountedPrice: number;
}

export const useCoupons = () => {
  return useQuery<CouponData[]>({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data } = await api.get('/coupons');
      return data;
    },
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCoupon: Omit<CouponData, '_id' | 'isActive'> & { isActive?: boolean }) => {
      const { data } = await api.post('/coupons', newCoupon);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updatedCoupon }: Partial<CouponData> & { id: string }) => {
      const { data } = await api.put(`/coupons/${id}`, updatedCoupon);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/coupons/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};

export const useValidateCoupon = () => {
  return useMutation<ValidationResponse, any, { code: string; packId: string }>({
    mutationFn: async (payload) => {
      const { data } = await api.post('/coupons/validate', payload);
      return data;
    },
  });
};
