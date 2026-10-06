import { useState, useEffect, useCallback } from 'react';
import { diaryService } from '@modules/diary/services/diary.service';
import { customerContactService } from '../services/customer-contact.service';
import { ContactInteraction, ContactItem } from '../types';
import { formatContact } from '../utils';

const RECENT_INTERACTION_LIMIT = 3;

/** Ambil detail kontak + interaksi terbaru (diary entries) untuk kontak tersebut */
export const useCustomerContactDetail = (id?: string) => {
  const [contact, setContact] = useState<ContactItem | null>(null);
  const [interactions, setInteractions] = useState<ContactInteraction[]>([]);
  const [lastActivity, setLastActivity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const detail = await customerContactService.getContactDetail(id);
        if (!isMounted) return;
        setContact(formatContact(detail));
      } catch (err: any) {
        if (isMounted) {
          setContact(null);
          setError(err?.message || 'Gagal mengambil detail kontak.');
        }
        if (isMounted) setIsLoading(false);
        return;
      }

      // Interaksi bersifat pelengkap: kegagalan memuatnya tidak boleh menggagalkan halaman
      try {
        const response = await diaryService.getDiaries({
          customer_contact_id: id,
          page: 1,
          per_page: RECENT_INTERACTION_LIMIT,
        });
        if (!isMounted) return;
        const mapped: ContactInteraction[] = response.data.map((entry) => ({
          id: String(entry.sales_diary_entry_id),
          title: entry.title,
          type: entry.interaction_type_name || entry.interaction_type || 'Note',
          entryAt: entry.entry_at,
        }));
        setInteractions(mapped);
        setLastActivity(mapped[0]?.entryAt ?? null);
      } catch {
        if (isMounted) {
          setInteractions([]);
          setLastActivity(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  /** Muat ulang detail kontak tanpa indikator loading (mis. setelah kembali dari halaman edit) */
  const reloadContact = useCallback(async () => {
    if (!id) return;
    try {
      const detail = await customerContactService.getContactDetail(id);
      setContact(formatContact(detail));
    } catch {
      // Data lama tetap ditampilkan jika refresh gagal
    }
  }, [id]);

  return { contact, interactions, lastActivity, isLoading, error, reloadContact };
};

export default useCustomerContactDetail;
