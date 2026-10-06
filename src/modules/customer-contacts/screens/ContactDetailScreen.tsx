import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { ActionSheet, ActionSheetItem, ConfirmDialog, ErrorDialog } from '@shared/components';
import { Colors, Gradients, Layout, Shadows } from '@shared/constants';
import { ContactDetailHero, ContactInfoCard, RecentInteractions } from '../components';
import { useCustomerContactDetail, useCustomerContacts } from '../hooks';
import { callPhone, openWhatsApp, sendEmail } from '../utils';

export const ContactDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { contact, interactions, lastActivity, isLoading, error, reloadContact } =
    useCustomerContactDetail(id);
  const { deleteContact, isSaving } = useCustomerContacts({ autoFetch: false });
  const [sheetVisible, setSheetVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const hasFocusedOnce = useRef(false);

  // Muat ulang saat kembali dari halaman edit (lewati fokus pertama, sudah dimuat hook)
  useFocusEffect(
    useCallback(() => {
      if (hasFocusedOnce.current) reloadContact();
      hasFocusedOnce.current = true;
    }, [reloadContact])
  );

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home/customer-contacts');
    }
  }, [router]);

  const runAction = useCallback(async (action: () => Promise<boolean>, failMessage: string) => {
    const opened = await action();
    if (!opened) Alert.alert('Gagal', failMessage);
  }, []);

  const handleCall = () => {
    if (contact?.phone) runAction(() => callPhone(contact.phone), 'Tidak dapat membuka aplikasi telepon.');
  };

  const handleWhatsApp = () => {
    if (contact?.phone) runAction(() => openWhatsApp(contact.phone), 'Tidak dapat membuka WhatsApp.');
  };

  const handleEmail = () => {
    if (contact?.email) runAction(() => sendEmail(contact.email), 'Tidak dapat membuka aplikasi email.');
  };

  const handleDiary = () => {
    if (!contact) return;
    router.push({
      pathname: '/home/diary/create',
      params: { customer_id: contact.customerId, customer_contact_id: contact.id },
    });
  };

  const handleDelete = useCallback(async () => {
    if (!contact) return;
    const { success, errorMessage } = await deleteContact(contact.id);
    setConfirmVisible(false);
    if (success) {
      handleBack();
    } else {
      // Tunggu dialog konfirmasi tertutup sebelum dialog error dibuka agar Modal tidak bertumpuk
      setTimeout(() => setDeleteError(errorMessage || 'Gagal menghapus kontak.'), 250);
    }
  }, [contact, deleteContact, handleBack]);

  const optionItems: ActionSheetItem[] = [
    {
      key: 'edit',
      label: 'Edit Kontak',
      icon: 'create-outline',
      onPress: () => {
        setSheetVisible(false);
        if (contact) router.push(`/home/customer-contacts/edit/${contact.id}` as any);
      },
    },
    {
      key: 'delete',
      label: 'Hapus Kontak',
      icon: 'trash-outline',
      destructive: true,
      onPress: () => {
        setSheetVisible(false);
        // Beri waktu sheet tertutup sebelum dialog dibuka agar Modal tidak bertumpuk
        setTimeout(() => setConfirmVisible(true), 250);
      },
    },
  ];

  const handleCreateDeal = () => {
    if (!contact) return;
    router.push({
      pathname: '/home/deals/create',
      params: { customer_id: contact.customerId, customer_contact_id: contact.id },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar style="light" />

      <ContactDetailHero
        contact={contact}
        onBack={handleBack}
        onCall={handleCall}
        onWhatsApp={handleWhatsApp}
        onEmail={handleEmail}
        onDiary={handleDiary}
        onOptionsPress={() => setSheetVisible(true)}
      />

      <ActionSheet
        visible={sheetVisible}
        title="Contact Options"
        subtitle={contact?.name}
        items={optionItems}
        onClose={() => setSheetVisible(false)}
      />

      <ConfirmDialog
        visible={confirmVisible}
        destructive
        title="Hapus Kontak?"
        message={`${contact?.name ?? 'Kontak ini'} akan dihapus. Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        isLoading={isSaving}
        onConfirm={handleDelete}
        onCancel={() => setConfirmVisible(false)}
      />

      <ErrorDialog
        visible={deleteError !== null}
        title="Kontak Tidak Dapat Dihapus"
        message={deleteError}
        onClose={() => setDeleteError(null)}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && !contact && (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.stateText}>Memuat detail kontak...</Text>
          </View>
        )}

        {!isLoading && !contact && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error || 'Kontak tidak ditemukan.'}</Text>
          </View>
        )}

        {contact && (
          <>
            <ContactInfoCard contact={contact} lastActivity={lastActivity} />

            <RecentInteractions
              interactions={interactions}
              onSeeAll={() => router.push('/home/diary')}
              onPressItem={(item) => router.push(`/home/diary/${item.id}`)}
            />

            <TouchableOpacity
              style={styles.dealButton}
              onPress={handleCreateDeal}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <LinearGradient
                colors={Gradients.button.colors}
                start={Gradients.button.start}
                end={Gradients.button.end}
                style={StyleSheet.absoluteFill}
              />
              <Ionicons name="briefcase-outline" size={17} color={Colors.text.inverse} />
              <Text style={styles.dealButtonText}>Create Deal</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Layout.screenPaddingHorizontal2,
    paddingBottom: 32,
    gap: 16,
  },
  stateContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 8,
  },
  stateText: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  errorContainer: {
    padding: 12,
    backgroundColor: Colors.semanticBg.error,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    fontSize: 13,
    color: Colors.semantic.error,
    textAlign: 'center',
  },
  dealButton: {
    height: 52,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    ...Shadows.lg,
  },
  dealButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
});
