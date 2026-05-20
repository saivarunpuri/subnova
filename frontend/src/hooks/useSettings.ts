import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export interface SettingsData {
  _id: string;
  paymentQrUrl: string;
}

// Fetch global settings
export const useSettings = () => {
  return useQuery<SettingsData>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get('/settings');
      return data;
    },
  });
};

// Update global settings (upload QR code)
export const useUpdatePaymentQr = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.put('/settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};
