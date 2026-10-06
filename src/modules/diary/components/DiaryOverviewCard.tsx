import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { DiaryItem } from '../types';
import {
  formatDiaryDateTime,
  getInitials,
  getAvatarGradient,
  getInteractionBadgeStyle,
} from '../utils/diary.utils';
import { Colors, Shadows } from '@shared/constants';

export interface DiaryOverviewCardProps {
  diary: DiaryItem;
}

export const DiaryOverviewCard: React.FC<DiaryOverviewCardProps> = ({ diary }) => {
  const displayCustomer = diary.customerName || diary.title || 'Orient Star Shipping';
  const customerInitials = getInitials(displayCustomer, 'OS');
  const avatarGradient = getAvatarGradient(displayCustomer);

  const displayType = diary.interactionType || 'Visit';
  const badgeStyle = getInteractionBadgeStyle(displayType);
  const formattedDateTime = formatDiaryDateTime(diary.entryAt || diary.createdAt);

  const contactName = diary.contactName || 'James Tan';
  const jobTitle = diary.contactJobTitle || 'Sales Director';
  const contactSubtitle = `${contactName} · ${jobTitle}`;

  const notes =
    diary.notes ||
    "Discussed FCL rates for Shanghai route. Client is highly interested in the monthly contract renewal. James indicated that if we can offer a 5% discount on current rates, they'll commit to 12 months. Follow up required with pricing team.";

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
          <Ionicons name={badgeStyle.icon} size={13} color={badgeStyle.text} />
          <Text style={[styles.badgeText, { color: badgeStyle.text }]}>
            {displayType}
          </Text>
        </View>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={12} color={Colors.text.secondary} />
          <Text style={styles.dateText}>{formattedDateTime}</Text>
        </View>
      </View>

      <View style={styles.customerRow}>
        <LinearGradient
          colors={avatarGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>{customerInitials}</Text>
        </LinearGradient>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName} numberOfLines={1}>
            {displayCustomer}
          </Text>
          <Text style={styles.contactSubtitle} numberOfLines={1}>
            {contactSubtitle}
          </Text>
        </View>
      </View>

      <View style={styles.notesContainer}>
        <View style={styles.notesHeader}>
          <Ionicons name="document-text-outline" size={14} color={Colors.primary} />
          <Text style={styles.notesLabel}>Notes</Text>
        </View>
        <Text style={styles.notesText}>{notes}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  customerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 3,
  },
  contactSubtitle: {
    fontSize: 13,
    color: Colors.text.secondary,
    fontWeight: '400',
  },
  notesContainer: {
    marginTop: 2,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.4,
  },
  notesText: {
    fontSize: 13.5,
    lineHeight: 22,
    color: Colors.text.label,
  },
});
