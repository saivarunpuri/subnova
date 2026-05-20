import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export const useSubmitPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post('/payments/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
};

export interface PaymentRecord {
  _id: string;
  userId: { _id: string; name: string; email: string } | string;
  bundleId: { _id: string; title: string } | string;
  screenshot: string;
  transactionId: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export const useGetPayments = (status?: string) => {
  return useQuery<PaymentRecord[]>({
    queryKey: ['payments', status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : '';
      const { data } = await api.get(`/payments${params}`);
      return data;
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      paymentId: string;
      status: 'Approved' | 'Rejected';
      ottUsername?: string;
      ottPassword?: string;
    }) => {
      const { data } = await api.put('/payments/verify', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['myPayments'] });
    },
  });
};

export interface MyPaymentRecord {
  _id: string;
  bundleId: { _id: string; title: string; validity?: string; brand?: { _id: string; name: string; category?: string } } | string | null;
  bundleTitle?: string;
  screenshot: string;
  transactionId: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  ottUsername?: string;
  ottPassword?: string;
  createdAt: string;
}

export const useGetMyPayments = () => {
  return useQuery<MyPaymentRecord[]>({
    queryKey: ['myPayments'],
    queryFn: async () => {
      const { data } = await api.get('/payments/my');
      return data;
    },
  });
};
