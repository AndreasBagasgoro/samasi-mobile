import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@shared/constants';

interface DiaryNotFoundProps {
  isSearchActive?: boolean;
}

export const DiaryNotFound: React.FC<DiaryNotFoundProps> = ({ isSearchActive = false }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconHalo}>
        <LinearGradient
          colors={Gradients.button.colors}
          start={Gradients.button.start}
          end={Gradients.button.end}
          style={styles.iconContainer}
        >
          <MaterialIcons name={isSearchActive ? "search-off" : "event-note"} color={Colors.text.inverse} size={34} />
        </LinearGradient>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {isSearchActive ? 'Catatan Tidak Ditemukan' : 'Belum Ada Catatan Diary'}
        </Text>
        <Text style={styles.description}>
          {isSearchActive
            ? 'Coba gunakan kata kunci pencarian lain atau ubah filter interaksi.'
            : 'Belum ada riwayat aktivitas penjualan yang tercatat. Tekan tombol (+) untuk membuat catatan baru.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  iconHalo: {
    padding: 10,
    borderRadius: 36,
    backgroundColor: Colors.primarySoft,
  },
  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 36,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default DiaryNotFound;
