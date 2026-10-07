import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '@shared/constants';
import { formatShortRelativeTime } from '@modules/deals/utils';

interface RecentActivityItemProps {
  title: string;
  customerName: string;
  interactionTypeName?: string;
  entryAt: string;
  onPress?: () => void;
}

export const RecentActivityItem: React.FC<RecentActivityItemProps> = ({
  title,
  customerName,
  interactionTypeName,
  entryAt,
  onPress,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons name="document-text-outline" size={18} color={Colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {customerName}{interactionTypeName ? ` · ${interactionTypeName}` : ''}
        </Text>
      </View>
      <Text style={styles.time}>{formatShortRelativeTime(entryAt)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    width: '100%',
    ...Shadows.sm,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  time: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
});
