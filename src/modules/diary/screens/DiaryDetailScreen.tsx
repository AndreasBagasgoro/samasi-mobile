import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@shared/constants';
import {
  DiaryDetailHeader,
  DiaryOverviewCard,
  DiaryLocationCard,
  DiaryPhotoSection,
} from '../components';
import { useDiary } from '../hooks';

export const DiaryDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getDiaryById, fetchDiaryDetail, isLoading, error } = useDiary({
    autoFetch: false,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDiaryDetail(id);
    }
  }, [id, fetchDiaryDetail]);

  const handleRefresh = useCallback(async () => {
    if (!id) return;
    setIsRefreshing(true);
    await fetchDiaryDetail(id);
    setIsRefreshing(false);
  }, [id, fetchDiaryDetail]);

  const handleOptionsPress = useCallback(() => {
    Alert.alert(
      'Diary Options',
      'Pilih tindakan untuk entry diary ini:',
      [
        {
          text: 'Edit Diary',
          onPress: () => {
            if (id) {
              router.push(`/home/diary/edit/${id}` as any);
            }
          },
        },
        {
          text: 'Tutup',
          style: 'cancel',
        },
      ]
    );
  }, [id, router]);

  const diary = getDiaryById(id);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* 1. Header (Back | Diary Entry | ···) */}
      <DiaryDetailHeader
        title="Diary Entry"
        onBack={() => router.back()}
        onOptionsPress={handleOptionsPress}
      />

      {/* Loading banner jika data detail pertama kali diambil */}
      {isLoading && !isRefreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0052CC" />
          <Text style={styles.loadingText}>Memuat detail diary...</Text>
        </View>
      )}

      {/* Error banner jika terjadi error jaringan/server */}
      {error && !isLoading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* 2. Main Scroll Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#0052CC']}
            tintColor="#0052CC"
          />
        }
      >
        {/* Section 1: Overview Card (Badge, Date, Customer & Contact, Notes) */}
        <DiaryOverviewCard diary={diary} />

        {/* Section 2: Location Card (Pin, Place, Coordinates) */}
        <DiaryLocationCard diary={diary} />

        {/* Section 3: Photos Section (Pastel rounded photos) */}
        <DiaryPhotoSection photos={diary.photos} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // #F8FAFC
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
    backgroundColor: '#EFF6FF',
  },
  loadingText: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '500',
  },
  errorContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    fontSize: 12,
    color: '#991B1B',
    textAlign: 'center',
  },
});

export default DiaryDetailScreen;
