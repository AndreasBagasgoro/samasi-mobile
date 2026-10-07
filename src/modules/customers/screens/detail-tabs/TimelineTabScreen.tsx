import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlueGradientSet, Colors, Shadows } from '@shared/constants';
import { getInteractionBadgeStyle } from '@modules/diary/utils/diary.utils';
import { CustomerItem, CustomerTimelineEvent } from '../../types';
import { useCustomerTimeline } from '../../hooks/useCustomerTimeline';

interface TimelineTabProps {
  customer?: CustomerItem;
  enabled?: boolean;
}

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatTime = (date: Date) => {
  const h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${String(h % 12 || 12).padStart(2, '0')}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
};

const formatTimelineTime = (value: string): string => {
  const date = new Date(value);
  if (isNaN(date.getTime())) return '-';
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);
  if (dayDiff === 0) return `Today, ${formatTime(date)}`;
  if (dayDiff === 1) return `Yesterday, ${formatTime(date)}`;
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const getEventVisual = (event: CustomerTimelineEvent): { icon: IconName; gradient: [string, string] } => {
  switch (event.event_type) {
    case 'DEAL_CREATED':
      return { icon: 'briefcase-outline', gradient: [BlueGradientSet[2][0], BlueGradientSet[2][1]] };
    case 'DEAL_WON':
      return { icon: 'trophy-outline', gradient: ['#34D399', '#059669'] };
    case 'DEAL_LOST':
      return { icon: 'close-circle-outline', gradient: ['#F87171', '#DC2626'] };
    default: {
      const badge = getInteractionBadgeStyle(event.interaction_type_name || event.interaction_type_code || '');
      return { icon: badge.icon, gradient: badge.gradient };
    }
  }
};

const TimelineItem = React.memo(
  ({
    event,
    isLast,
    onPress,
  }: {
    event: CustomerTimelineEvent;
    isLast: boolean;
    onPress: (e: CustomerTimelineEvent) => void;
  }) => {
    const { icon, gradient } = getEventVisual(event);
    const meta = [event.contact_name, event.actor_name].filter(Boolean).join(' • ');

    return (
      <View style={styles.timelineItem}>
        <View style={styles.leftColumn}>
          <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.iconCircle}>
            <Ionicons name={icon} size={15} color="#FFFFFF" />
          </LinearGradient>
          {!isLast && <View style={styles.verticalLine} />}
        </View>

        <TouchableOpacity style={styles.rightContent} activeOpacity={0.75} onPress={() => onPress(event)}>
          <Text style={styles.itemTitle}>{event.title}</Text>
          {!!event.description && (
            <Text style={styles.itemDesc} numberOfLines={3}>
              {event.description}
            </Text>
          )}
          {!!meta && (
            <Text style={styles.itemMeta} numberOfLines={1}>
              {meta}
            </Text>
          )}
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={11} color={Colors.text.disabled} />
            <Text style={styles.itemTime}>{formatTimelineTime(event.occurred_at)}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
);

export const TimelineTabScreen: React.FC<TimelineTabProps> = ({ customer, enabled = true }) => {
  const router = useRouter();
  const { events, isLoading, isRefreshing, isLoadingMore, error, refresh, loadMore } = useCustomerTimeline(
    customer?.id,
    { enabled }
  );

  const handlePress = useCallback(
    (event: CustomerTimelineEvent) => {
      router.push(event.ref_type === 'DIARY' ? `/home/diary/${event.ref_id}` : `/home/deals/${event.ref_id}`);
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: CustomerTimelineEvent; index: number }) => (
      <TimelineItem event={item} isLast={index === events.length - 1} onPress={handlePress} />
    ),
    [events.length, handlePress]
  );

  const keyExtractor = useCallback((item: CustomerTimelineEvent) => item.event_id, []);

  return (
    <FlatList
      style={styles.container}
      data={events}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      onEndReached={loadMore}
      onEndReachedThreshold={0.4}
      initialNumToRender={8}
      windowSize={7}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
      ListEmptyComponent={
        isLoading && events.length === 0 ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.mutedText}>Memuat timeline...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.centerBox}>
            <Text style={styles.mutedText}>Belum ada aktivitas untuk pelanggan ini.</Text>
          </View>
        )
      }
      ListFooterComponent={
        isLoadingMore ? <ActivityIndicator style={styles.footer} color={Colors.primary} /> : null
      }
    />
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
    flexGrow: 1,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'stretch',
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
  itemMeta: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
  itemTime: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
  centerBox: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 8,
  },
  mutedText: {
    fontSize: 13,
    color: '#64748B',
  },
  errorBox: {
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    fontSize: 13,
    color: '#991B1B',
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 16,
  },
});
