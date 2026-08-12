import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@shared/constants';
import { CustomerItem } from '../../types';

interface TimelineTabProps {
  customer?: CustomerItem;
}

const MOCK_TIMELINE = [
  { id: 't1', title: 'Call Meeting Completed', desc: 'Discussed rate quotation for Q3 shipping lines', time: 'Today, 02:30 PM', icon: 'phone-call', color: '#3B82F6' },
  { id: 't2', title: 'Contract Draft Sent', desc: 'Sent updated NVOCC agreement via email', time: 'Yesterday, 10:15 AM', icon: 'file-text', color: '#8B5CF6' },
  { id: 't3', title: 'Initial Inquiry Created', desc: 'Customer requested quotation for 5x40ft containers', time: '10 Aug 2026', icon: 'plus-circle', color: '#10B981' },
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
              <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
                <Feather name={item.icon as any} size={14} color="#FFFFFF" />
              </View>
              {index < MOCK_TIMELINE.length - 1 && <View style={styles.verticalLine} />}
            </View>

            {/* Timeline Content */}
            <View style={styles.rightContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDesc}>{item.desc}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
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
    width: 28,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  rightContent: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 12,
    borderColor: Colors.border,
    borderWidth: 1,
    gap: 4,
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
    fontSize: 10,
    color: Colors.text.disabled,
    marginTop: 2,
  },
});
