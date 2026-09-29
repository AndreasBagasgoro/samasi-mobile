import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DiaryItem } from '../types';
import {
  formatDiaryDateTime,
  getInitials,
  getAvatarColor,
  getInteractionBadgeStyle,
} from '../utils/diary.utils';
import { Colors } from '@shared/constants';

export interface DiaryOverviewCardProps {
  diary: DiaryItem;
}

export const DiaryOverviewCard: React.FC<DiaryOverviewCardProps> = ({ diary }) => {
  const displayCustomer = diary.customerName || diary.title || 'Orient Star Shipping';
  const customerInitials = getInitials(displayCustomer, 'OS');
  const avatarBg = getAvatarColor(displayCustomer);

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
          <Text style={[styles.badgeText, { color: badgeStyle.text }]}>
            {displayType}
          </Text>
        </View>
        <Text style={styles.dateText}>{formattedDateTime}</Text>
      </View>

      <View style={styles.customerRow}>
        <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
          <Text style={styles.avatarText}>{customerInitials}</Text>
        </View>
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
        <Text style={styles.notesText}>{notes}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  contactSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '400',
  },
  notesContainer: {
    marginTop: 2,
  },
  notesText: {
    fontSize: 13.5,
    lineHeight: 22,
    color: '#334155',
  },
});
