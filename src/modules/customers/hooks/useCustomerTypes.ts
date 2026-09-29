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
  const [error, setError] = useState<string | null>(null);

  const formatCustomerTypeData = useCallback((data: CustomerTypeItem[]): CustomerTypeNameItem[] => {
    return data.map((item) => ({
      customer_type_id: item.customer_type_id,
      customer_type_name: item.customer_type_name.toUpperCase() || 'General',
    }));
  }, []);

  useEffect(() => {
    if (!autoFetch) return;
    if (cachedFormattedCustomerTypes && cachedFormattedCustomerTypes.length > 0) return;

    let isMounted = true;

    const loadCustomerTypes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await customerService.getCustomerTypes();
        const formatted = formatCustomerTypeData(response.data);

        cachedCustomerTypes = response.data;
        cachedFormattedCustomerTypes = formatted;

        if (isMounted) {
          setCustomerTypes(response.data);
          setFormattedCustomerTypes(formatted);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Gagal mengambil data tipe pelanggan dari server.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCustomerTypes();

    return () => {
      isMounted = false;
    };
  }, [autoFetch, formatCustomerTypeData]);

  return {
    customerTypes,
    formattedCustomerTypes,
    isLoading,
    error,
    setError,
  };
};

export default useCustomerTypes;

