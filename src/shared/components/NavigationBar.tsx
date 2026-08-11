import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { FontAwesome, Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons';

export interface NavigationMenuItem {
  id: string;
  title: string;
  route: string;
  icon: (isActive: boolean) => React.ReactNode;
}

export interface NavigationBarProps {
  items?: NavigationMenuItem[];
}

export const defaultNavigationItems: NavigationMenuItem[] = [
  {
    id: 'home',
    title: 'Home',
    route: '/home',
    icon: (isActive) => (
      <Ionicons
        name={isActive ? 'home' : 'home-outline'}
        size={22}
        color={isActive ? '#0F172A' : '#64748B'}
      />
    ),
  },
  {
    id: 'customers',
    title: 'Customers',
    route: '/home/customers',
    icon: (isActive) => (
      <FontAwesome
        name={isActive ? 'users' : 'user-o'}
        size={22}
        color={isActive ? '#0F172A' : '#64748B'}
      />
    ),
  },
  {
    id: 'diary',
    title: 'Diary',
    route: '/home/diary',
    icon: (isActive) => (
      <Ionicons
        name={isActive ? 'book' : 'book-outline'}
        size={22}
        color={isActive ? '#0F172A' : '#64748B'}
      />
    ),
  },
  {
    id: 'deals',
    title: 'Deals',
    route: '/home/deals',
    icon: (isActive) => (
      <FontAwesome5
        name="dollar-sign"
        size={22}
        color={isActive ? '#0F172A' : '#64748B'}
      />
    ),
  },
  {
    id: 'profile',
    title: 'Profile',
    route: '/home/profile',
    icon: (isActive) => (
      <Ionicons
        name={isActive ? 'person' : 'person-outline'}
        size={22}
        color={isActive ? '#0F172A' : '#64748B'}
      />
    ),
  },
];

export const NavigationBar: React.FC<NavigationBarProps> = ({
  items = defaultNavigationItems,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive = pathname === item.route || (item.route === '/home' && (pathname === '/home' || pathname === '/home/'));
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.button}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>{item.icon(isActive)}</View>
            <Text style={[styles.text, isActive && styles.activeText]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default NavigationBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  iconWrapper: {
    marginBottom: 4,
  },
  activeText: {
    color: '#0F172A',
    fontWeight: '700',
  },
});
