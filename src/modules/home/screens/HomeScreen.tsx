import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@modules/auth';
import { HomeHeader, QuickAction, Reminder } from '../components';
import { Colors } from '@shared/constants';
import { QUICK_ACTION_ITEMS, REMINDER_ITEMS } from '../constants/home.constants';

export const HomeScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#031730" 
        translucent={true}
      />
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HomeHeader />
        <View style={styles.content}>
          <Text style={styles.title}>QUICK ACTIONS</Text>
          <View style={styles.quickAction}>
            {QUICK_ACTION_ITEMS.map((item) => (
              <QuickAction
                key={item.id}
                icon={item.icon}
                label={item.label}
                backgroundColor={item.backgroundColor}
                cardBackgroundColor={item.cardBackgroundColor}
                onPress={item.onPress}
              />
            ))}
          </View>

          <Text style={styles.title}>REMINDERS</Text>
          <View style={styles.reminder}>
            {REMINDER_ITEMS.map((item) => (
              <Reminder 
                key={item.id}
                title={item.title}
                label={item.label}
                time={item.time}
                iconColor={item.iconColor}
                iconBackgroundColor={item.iconBackgroundColor}
                cardBackgroundColor={item.cardBackgroundColor}
                onPress={item.onPress}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    marginTop: 15,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
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
  reminder: {
    flexDirection: "column",
    justifyContent: 'flex-start',
    alignItems: "stretch",
    width: '100%',
    gap: 6,
  }
});
