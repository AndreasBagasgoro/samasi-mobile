import { useState, useEffect, useCallback } from 'react';
import { customerService } from '../services/customer.service';
import { CustomerTypeItem, CustomerTypeNameItem } from '../types';

interface UseCustomerTypesOptions {
  autoFetch?: boolean;
}

let cachedCustomerTypes: CustomerTypeItem[] | null = null;
let cachedFormattedCustomerTypes: CustomerTypeNameItem[] | null = null;

export const useCustomerTypes = (options: UseCustomerTypesOptions = { autoFetch: true }) => {
  const { autoFetch = true } = options;

  const [customerTypes, setCustomerTypes] = useState<CustomerTypeItem[]>(cachedCustomerTypes || []);
  const [formattedCustomerTypes, setFormattedCustomerTypes] = useState<CustomerTypeNameItem[]>(cachedFormattedCustomerTypes || []);

  const hasInitialData = Boolean(cachedFormattedCustomerTypes && cachedFormattedCustomerTypes.length > 0);
  const [isLoading, setIsLoading] = useState<boolean>(!hasInitialData);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formatCustomerTypeData = useCallback((data: CustomerTypeItem[]): CustomerTypeNameItem[] => {
    return data.map((item) => (
      {
      customer_type_id: item.customer_type_id,
      customer_type_name: item.customer_type_name.toUpperCase() || 'General',
    }));
  }, []);

  const fetchCustomerTypes = useCallback(async (opts?: { forceLoading?: boolean }) => {
    if (!cachedFormattedCustomerTypes || opts?.forceLoading) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await customerService.getCustomerTypes();
      const formatted = formatCustomerTypeData(response.data);

      cachedCustomerTypes = response.data;
      cachedFormattedCustomerTypes = formatted;

      setCustomerTypes(response.data);
      setFormattedCustomerTypes(formatted);
      return formatted;
    } catch (err: any) {
      const errorMessage = err?.message || 'Gagal mengambil data tipe pelanggan dari server.';
      setError(errorMessage);
      return cachedFormattedCustomerTypes || [];
    } finally {
      setIsLoading(false);
    }
  }, [formatCustomerTypeData]);

  const refreshCustomerTypes = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await customerService.getCustomerTypes();
      const formatted = formatCustomerTypeData(response.data);

      cachedCustomerTypes = response.data;
      cachedFormattedCustomerTypes = formatted;

      setCustomerTypes(response.data);
      setFormattedCustomerTypes(formatted);
      return formatted;
    } catch (err: any) {
      setError(err?.message || 'Gagal memperbarui data tipe pelanggan.');
      return cachedFormattedCustomerTypes || [];
    } finally {
      setIsRefreshing(false);
    }
  }, [formatCustomerTypeData]);

  useEffect(() => {
    if (autoFetch) {
      fetchCustomerTypes();
    }
  }, [autoFetch, fetchCustomerTypes]);

  return {
    customerTypes,
    formattedCustomerTypes,
    isLoading,
    isRefreshing,
    error,
    fetchCustomerTypes,
    refreshCustomerTypes,
    setError,
  };
};

export default useCustomerTypes;
