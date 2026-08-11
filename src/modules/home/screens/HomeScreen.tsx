import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@modules/auth';
import { HomeHeader } from '../components/HomeHeader';
import { QuickAction } from '../components/QuickAction';
import { FontAwesome, Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Footer, { FooterMenuItem } from '@shared/components/Footer';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';

export const HomeScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState('1');

  const [fontsLoaded, fontError] = useFonts({
    'inter-Regular': Inter_400Regular,
    'inter-semiBold': Inter_600SemiBold,
    'inter-Bold': Inter_700Bold,
    'DMSans-Regular': DMSans_400Regular,
    'DMSans-Medium': DMSans_500Medium,
    'DMSans-Bold': DMSans_700Bold,
  });

  const footerMenus: FooterMenuItem[] = [
    {
      id: '1',
      title: 'Home',
      icon: (
        <Ionicons
          name={activeTab === '1' ? 'home' : 'home-outline'}
          size={22}
          color={activeTab === '1' ? '#0F172A' : '#64748B'}
        />
      ),
      isActive: activeTab === '1',
      onPress: () => setActiveTab('1')
    },
    {
      id: '2',
      title: 'Customers',
      icon: (
        <FontAwesome
          name={activeTab === '2' ? 'users' : 'user-o'}
          size={22}
          color={activeTab === '2' ? '#0F172A' : '#64748B'}
        />
      ),
      isActive: activeTab === '2',
      onPress: () => setActiveTab('2')
    },
    {
      id: '3',
      title: 'Diary',
      icon: (
        <Ionicons
          name={activeTab === '3' ? 'book' : 'book-outline'}
          size={22}
          color={activeTab === '3' ? '#0F172A' : '#64748B'}
        />
      ),
      isActive: activeTab === '3',
      onPress: () => setActiveTab('3')
    },
    {
      id: '4',
      title: 'Deals',
      icon: (
        <FontAwesome5
          name={activeTab === '4' ? 'dollar-sign' : 'dollar-sign'}
          size={22}
          color={activeTab === '4' ? '#0F172A' : '#64748B'}
        />
      ),
      isActive: activeTab === '4',
      onPress: () => setActiveTab('4')
    },
    {
      id: '5',
      title: 'Profile',
      icon: (
        <Ionicons
          name={activeTab === '5' ? 'home' : 'home-outline'}
          size={22}
          color={activeTab === '5' ? '#0F172A' : '#64748B'}
        />
      ),
      isActive: activeTab === '5',
      onPress: () => setActiveTab('5')
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#031730" 
        translucent={true}
      />
      <HomeHeader/>
      <View style={styles.content}>
        <Text style={styles.title}>QUICK ACTIONS</Text>
        <View style={styles.quickAction}>
          <QuickAction 
            icon={<FontAwesome name='book' size={22} color='#FFF'/>}
            label="New Diary"
            onPress={() => {}}
          />
          <QuickAction 
            icon={<Feather name='user-plus' size={22} color='#FFF'/>}
            label="New Customer"
            onPress={() => {}}
          />
          <QuickAction 
            icon={<Feather name='search' size={22} color='#FFF'/>}
            label="Search contact"
            onPress={() => {}}
          />
          <QuickAction 
            icon={<Feather name='plus' size={22} color='#FFF'/>}
            label="Create Deal"
            onPress={() => {}}
          />
        </View>
        <Text style={styles.title}>REMINDERS</Text>
      </View>
      <Footer items={footerMenus}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    marginTop: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
    fontFamily: 'inter-Bold'
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 32,
  },
  logoutContainer: {
    width: '100%',
    maxWidth: 300,
  },
  quickAction: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
});
