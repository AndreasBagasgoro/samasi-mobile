import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Gradients } from '../constants';

export interface NavigationMenuItem {
  id: string;
  title: string;
  route: string;
  icon: (isActive: boolean) => React.ReactNode;
}

export interface NavigationBarProps {
  items?: NavigationMenuItem[];
}

const ACTIVE_ICON_COLOR = Colors.text.inverse;
const INACTIVE_ICON_COLOR = Colors.text.disabled;

const renderIonicon = (
  activeName: keyof typeof Ionicons.glyphMap,
  inactiveName: keyof typeof Ionicons.glyphMap,
) => (isActive: boolean) => (
  <Ionicons
    name={isActive ? activeName : inactiveName}
    size={20}
    color={isActive ? ACTIVE_ICON_COLOR : INACTIVE_ICON_COLOR}
  />
);

export const defaultNavigationItems: NavigationMenuItem[] = [
  {
    id: 'home',
    title: 'Home',
    route: '/home',
    icon: renderIonicon('grid', 'grid-outline'),
  },
  {
    id: 'customers',
    title: 'Customers',
    route: '/home/customers',
    icon: renderIonicon('people', 'people-outline'),
  },
  {
    id: 'diary',
    title: 'Diary',
    route: '/home/diary',
    icon: renderIonicon('journal', 'journal-outline'),
  },
  {
    id: 'deals',
    title: 'Deals',
    route: '/home/deals',
    icon: renderIonicon('briefcase', 'briefcase-outline'),
  },
  {
    id: 'contacts',
    title: 'Contacts',
    route: '/home/customer-contacts',
    icon: renderIonicon('call', 'call-outline'),
  },
];

export const NavigationBar: React.FC<NavigationBarProps> = ({
  items = defaultNavigationItems,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: 12 + insets.bottom }]}>
      {items.map((item) => {
        const isActive = pathname === item.route || (item.route === '/home' && (pathname === '/home' || pathname === '/home/'));
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.button}
            onPress={() => router.replace(item.route as any)}
            activeOpacity={0.7}
          >
            {isActive ? (
              <LinearGradient
                colors={Gradients.button.colors}
                start={Gradients.button.start}
                end={Gradients.button.end}
                style={[styles.iconWrapper, styles.iconWrapperActive]}
              >
                {item.icon(isActive)}
              </LinearGradient>
            ) : (
              <View style={styles.iconWrapper}>{item.icon(isActive)}</View>
            )}
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
    backgroundColor: Colors.surface,
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    justifyContent: 'space-around',
    alignItems: 'center',
    boxShadow: '0px -4px 16px rgba(29, 78, 216, 0.06)',
  },
  button: {
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  iconWrapper: {
    width: 44,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconWrapperActive: {
    boxShadow: '0px 4px 10px rgba(29, 78, 216, 0.3)',
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.text.disabled,
  },
  activeText: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
