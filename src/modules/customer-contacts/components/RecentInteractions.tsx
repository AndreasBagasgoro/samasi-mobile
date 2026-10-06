import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Shadows } from '@shared/constants';
import { getInteractionBadgeStyle } from '@modules/diary/utils/diary.utils';
import { ContactInteraction } from '../types';
import { formatShortDate } from '../utils';

export interface RecentInteractionsProps {
  interactions: ContactInteraction[];
  onSeeAll?: () => void;
  onPressItem?: (interaction: ContactInteraction) => void;
}

export const RecentInteractions: React.FC<RecentInteractionsProps> = ({
  interactions,
  onSeeAll,
  onPressItem,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>RECENT INTERACTIONS</Text>
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      {interactions.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No interactions recorded yet.</Text>
        </View>
      ) : (
        interactions.map((item) => {
          const badge = getInteractionBadgeStyle(item.type);
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => onPressItem?.(item)}
              activeOpacity={0.75}
            >
              <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.badgeText, { color: badge.text }]} numberOfLines={1}>
                  {item.type}
                </Text>
              </View>
              <View style={styles.body}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.date}>{formatShortDate(item.entryAt)}</Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    ...Shadows.sm,
  },
  badge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    maxWidth: 90,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  date: {
    fontSize: 12,
    color: Colors.text.disabled,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
});
