import React from 'react';
import { View, StyleSheet, Image, Text, ScrollView, useWindowDimensions } from 'react-native';
import { Layout, Colors } from "@shared/constants";

// 1. Interface Props dengan `greeting` dan `name` dinamis + nilai default
interface PageLayoutProps {
  greeting?: string; // e.g. "Hai," or "Selamat Pagi,"
  name?: string;     // e.g. "Andreas" or user.name
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  greeting = 'Hai,', 
  name = 'Andreas', 
  children 
}) => {
  const { height: screenHeight } = useWindowDimensions();
  const headerHeight = screenHeight / 3;

  return (
    <View style={styles.screen}>
      {/* 1/3 Layar Atas: Header dengan props greeting & name dinamis */}
      <View style={[styles.headerContainer, { height: headerHeight }]}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/logo-samasi.png')}
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={styles.logoText}>Sales Diary</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{greeting}</Text>
          <Text style={styles.subtitle}>{name}</Text>
        </View>
      </View>

      {/* 2/3 Layar Bawah: Area Dinamis untuk Children */}
      <View style={styles.childrenContainer}>
        {children}
      </View>
    </View>
  );
};

// 2. Contoh Penerapan di Halaman lain (Bisa memasukkan props greeting & name dari luar)
const SandboxScreen: React.FC = () => {
  return (
    <PageLayout greeting="Selamat Datang," name="Andreas Bagasgoro">
      <ScrollView contentContainerStyle={styles.demoContent}>
        <View style={styles.demoCard}>
          <Text style={styles.cardTitle}>Komponen Child #1</Text>
          <Text style={styles.cardDesc}>Header di atas sekarang menggunakan props `greeting` dan `name` dinamis.</Text>
        </View>

        <View style={styles.demoCard}>
          <Text style={styles.cardTitle}>Komponen Child #2</Text>
          <Text style={styles.cardDesc}>Anda bisa melewatkan nama user dari Auth Store atau string apapun dari luar.</Text>
        </View>
      </ScrollView>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  headerContainer: {
    backgroundColor: Colors.primary,
    justifyContent: 'flex-start',
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: 48,
    paddingBottom: 24,
    alignItems: 'flex-start',
    gap: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logo: {
    width: 50,
    height: 50,
  },
  logoText: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 4,
    fontWeight: '700',
  },
  textContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  title: {
    fontSize: 28,
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
  },
  childrenContainer: {
    flex: 1,
  },
  demoContent: {
    padding: Layout.screenPaddingHorizontal,
    gap: 16,
  },
  demoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#64748B',
  },
});

export default SandboxScreen;
