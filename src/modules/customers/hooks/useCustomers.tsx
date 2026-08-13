import { useState, useEffect, useCallback } from 'react';
import { customerService } from '../services/customer.service';
import { CustomerSummaryItem, CustomerDetailItem, CustomerItem, CustomerContactSummaryItem } from '../types';
import { getAvatarBackgroundColor } from '../constants/customer.constants';

interface UseCustomersOptions {
  autoFetch?: boolean;
}

let cachedCustomers: CustomerSummaryItem[] | null = null;
let cachedFormattedCustomers: CustomerItem[] | null = null;
const cachedDetailMap = new Map<string | number, CustomerDetailItem>();
const cachedContactsMap = new Map<string | number, CustomerContactSummaryItem[]>();

export const useCustomers = (options: UseCustomersOptions = { autoFetch: true }) => {
  const { autoFetch = true } = options;

  const [customers, setCustomers] = useState<CustomerSummaryItem[]>(cachedCustomers || []);
  const [formattedCustomers, setFormattedCustomers] = useState<CustomerItem[]>(cachedFormattedCustomers || []);
  const [customerContacts, setCustomerContacts] = useState<CustomerContactSummaryItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetailItem | null>(null);
  
  const hasInitialData = Boolean(cachedFormattedCustomers && cachedFormattedCustomers.length > 0);
  const [isLoading, setIsLoading] = useState<boolean>(!hasInitialData);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formatCustomerData = useCallback((data: CustomerSummaryItem[]): CustomerItem[] => {
    return data.map((item) => {
      const name = item.customer_name || 'Unknown Customer';
      const initial = item.short_name || name.slice(0, 2).toUpperCase();
      return {
        id: String(item.customer_id),
        profileInitial: initial,
        name: name,
        customerType: item.customer_type_name || 'General',
        totalContacts: 1,
        lastActive: 'Recently active',
        status: item.status === 'ACTIVE' ? 'active' : 'inactive',
        avatarBackgroundColor: getAvatarBackgroundColor(name),
      };
    });
  }, []);

  const formatCustomerContactData = useCallback((data: CustomerContactSummaryItem[]): CustomerContactSummaryItem[] => {
    return data.map((item) => ({
      customer_contact_id: item.customer_contact_id,
      customer_id: item.customer_id,
      contact_name: item.contact_name || 'No Name',
      job_title: item.job_title || 'No Title',
      phone_number: item.phone_number || '-',
      email: item.email || '-',
      is_primary: item.is_primary ?? false,
      status: item.status || 'ACTIVE',
      created_at: item.created_at,
    }));
  }, []);

  const fetchCustomerContact = useCallback(async (id: string | number, options?: { forceLoading?: boolean }) => {
    const cachedContacts = cachedContactsMap.get(id);
    
    if (cachedContacts) {
      setCustomerContacts(cachedContacts);
    }

    if (!cachedContacts || options?.forceLoading) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await customerService.getCustomerContact(id);
      const formatted = formatCustomerContactData(data);
      
      cachedContactsMap.set(id, formatted);
      setCustomerContacts(formatted);
      return formatted;
    } catch (err: any) {
      const errorMessage = err?.message || `Gagal mengambil daftar kontak untuk customer dengan ID: ${id}`;
      setError(errorMessage);
      return cachedContacts || [];
    } finally {
      setIsLoading(false);
    }
  }, [formatCustomerContactData]);

  const fetchCustomers = useCallback(async (options?: { forceLoading?: boolean }) => {
    if (!cachedFormattedCustomers || options?.forceLoading) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await customerService.getCustomers();
      
      cachedCustomers = data;
      const formatted = formatCustomerData(data);
      cachedFormattedCustomers = formatted;

      setCustomers(data);
      setFormattedCustomers(formatted);
    } catch (err: any) {
      const errorMessage = err?.message || 'Gagal mengambil data pelanggan dari server.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [formatCustomerData]);

  const fetchCustomerDetail = useCallback(async (id: string | number) => {
    const cachedDetail = cachedDetailMap.get(id);
    if (cachedDetail) {
      setSelectedCustomer(cachedDetail);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await customerService.getCustomerDetail(id);
      cachedDetailMap.set(id, data);
      setSelectedCustomer(data);
      return data;
    } catch (err: any) {
      const errorMessage = err?.message || `Gagal mengambil detail customer dengan ID: ${id}`;
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCustomerById = useCallback((id: string | undefined): CustomerItem => {
    const foundInList = formattedCustomers.find((item) => String(item.id) === String(id));
    
    if (selectedCustomer && String(selectedCustomer.customer_id) === String(id)) {
      return {
        id: String(selectedCustomer.customer_id),
        profileInitial: selectedCustomer.short_name || (selectedCustomer.customer_name ? selectedCustomer.customer_name.slice(0, 2).toUpperCase() : 'CU'),
        name: selectedCustomer.customer_name || 'Customer Detail',
        customerType: selectedCustomer.customer_type_name || foundInList?.customerType || 'General',
        totalContacts: selectedCustomer.customerContact?.length || foundInList?.totalContacts || 1,
        lastActive: foundInList?.lastActive || 'Active recently',
        status: (selectedCustomer.status === 'ACTIVE' ? 'active' : 'inactive'),
        npwp: selectedCustomer.npwp || '-',
        email: selectedCustomer.email || '-',
        address: selectedCustomer.address || '-',
        billingAddress: selectedCustomer.billing_address || '-',
        city: selectedCustomer.city_name || '-',
        paymentTermDays: selectedCustomer.payment_term_days ?? 30,
        approvalStatus: selectedCustomer.approval_status || (selectedCustomer.status === 'ACTIVE' ? 'APPROVED' : 'PENDING'),
        documentCategory: selectedCustomer.document_category_name || 'Standard',
        createdBy: selectedCustomer.created_by_name || 'System Admin',
      };
    }

    return foundInList || {
      id: id || 'unknown',
      profileInitial: 'CU',
      name: 'Customer Detail',
      customerType: 'General',
      totalContacts: 1,
      lastActive: 'Active recently',
      status: 'active',
      npwp: '-',
      email: '-',
      address: '-',
      billingAddress: '-',
      city: '-',
    };
  }, [selectedCustomer, formattedCustomers]);

  const refreshCustomers = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const data = await customerService.getCustomers();
      cachedCustomers = data;
      const formatted = formatCustomerData(data);
      cachedFormattedCustomers = formatted;

      setCustomers(data);
      setFormattedCustomers(formatted);
    } catch (err: any) {
      setError(err?.message || 'Gagal memperbarui data.');
    } finally {
      setIsRefreshing(false);
    }
  }, [formatCustomerData]);

  useEffect(() => {
    if (autoFetch) {
      fetchCustomers();
    }
  }, [autoFetch, fetchCustomers]);

  return {
    customers,
    formattedCustomers,
    selectedCustomer,
    customerContacts,
    getCustomerById,
    isLoading,
    isRefreshing,
    error,
    fetchCustomers,
    fetchCustomerDetail,
    fetchCustomerContact,
    formatCustomerContactData,
    refreshCustomers,
    setError,
  };
};

export default useCustomers;
