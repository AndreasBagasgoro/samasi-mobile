import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlueGradientSet, Colors, Shadows } from '@shared/constants';
import { CustomerItem } from '../../types';

interface TimelineTabProps {
  customer?: CustomerItem;
}

const MOCK_TIMELINE = [
  { id: 't1', title: 'Call Meeting Completed', desc: 'Discussed rate quotation for Q3 shipping lines', time: 'Today, 02:30 PM', icon: 'call-outline', gradient: BlueGradientSet[0] },
  { id: 't2', title: 'Contract Draft Sent', desc: 'Sent updated NVOCC agreement via email', time: 'Yesterday, 10:15 AM', icon: 'document-text-outline', gradient: BlueGradientSet[2] },
  { id: 't3', title: 'Initial Inquiry Created', desc: 'Customer requested quotation for 5x40ft containers', time: '10 Aug 2026', icon: 'sparkles-outline', gradient: BlueGradientSet[1] },
];

export const TimelineTabScreen: React.FC<TimelineTabProps> = () => {
  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.timelineContainer}>
        {MOCK_TIMELINE.map((item, index) => (
          <View key={item.id} style={styles.timelineItem}>
            {/* Timeline Line & Node */}
            <View style={styles.leftColumn}>
              <LinearGradient
                colors={item.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconCircle}
              >
                <Ionicons name={item.icon as any} size={15} color="#FFFFFF" />
              </LinearGradient>
              {index < MOCK_TIMELINE.length - 1 && <View style={styles.verticalLine} />}
            </View>

            {/* Timeline Content */}
            <View style={styles.rightContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDesc}>{item.desc}</Text>
              <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={11} color={Colors.text.disabled} />
                <Text style={styles.itemTime}>{item.time}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  timelineContainer: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 20,
  },
  leftColumn: {
    alignItems: 'center',
    width: 34,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.background2,
    marginTop: 6,
    marginBottom: -14,
  },
  rightContent: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 16,
    borderColor: Colors.border,
    borderWidth: 1,
    gap: 4,
    ...Shadows.sm,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  itemDesc: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
  itemTime: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
});
