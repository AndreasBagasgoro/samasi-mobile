import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@modules/auth';
import { HomeHeader, QuickAction, Reminder } from '../components';
import { Colors } from '@shared/constants';
import { QUICK_ACTION_ITEMS, REMINDER_ITEMS } from '../constants/home.constants';

export const HomeScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const displayName = user?.name || user?.full_name || undefined;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HomeHeader user={displayName} />
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.title}>Quick Actions</Text>
          </View>
          <View style={styles.quickAction}>
            {QUICK_ACTION_ITEMS.map((item) => (
              <QuickAction
                key={item.id}
                icon={item.icon}
                label={item.label}
                description={item.description}
                gradient={item.gradient}
                cardBackgroundColor={item.cardBackgroundColor}
                onPress={item.onPress}
              />
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.title}>Today's Reminders</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reminder}>
            {REMINDER_ITEMS.map((item) => (
              <Reminder
                key={item.id}
                title={item.title}
                label={item.label}
                time={item.time}
                icon={item.icon}
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
    backgroundColor: Colors.background,
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
    marginTop: 22,
  },
  sectionHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  quickAction: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  reminder: {
    flexDirection: "column",
    justifyContent: 'flex-start',
    alignItems: "stretch",
    width: '100%',
    gap: 10,
  }
});
