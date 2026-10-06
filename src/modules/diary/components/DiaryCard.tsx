import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '@shared/constants';
import { DiaryItem } from '../types';
import { getInteractionBadgeStyle } from '../utils/diary.utils';

const formatEntryTime = (dateString?: string): string => {
    if (!dateString) return '';
    if (/^\d{1,2}:\d{2}\s?(AM|PM|am|pm)?$/i.test(dateString.trim())) {
        return dateString.trim();
    }
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
        return dateString;
    }
};

export const DiaryCard: React.FC<DiaryItem> = ({
    title,
    interactionType,
    entryAt,
    contactName,
    notes,
    photos,
    onPress,
}) => {
    const displayTitle = title || 'No Title';
    const displayContact = contactName || '';
    const displayType = interactionType || 'Call';
    const displayTime = formatEntryTime(entryAt) || '10:15 AM';
    const badgeStyle = getInteractionBadgeStyle(displayType);

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={onPress}
            activeOpacity={0.75}
        >
            <LinearGradient
                colors={badgeStyle.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.accentBar}
            />

            <View style={styles.headerRow}>
                <View style={styles.badgeAndTime}>
                    <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
                        <Ionicons name={badgeStyle.icon} size={12} color={badgeStyle.text} />
                        <Text style={[styles.badgeText, { color: badgeStyle.text }]}>
                            {displayType}
                        </Text>
                    </View>
                    <View style={styles.timeRow}>
                        <Ionicons name="time-outline" size={12} color={Colors.text.disabled} />
                        <Text style={styles.timeText}>{displayTime}</Text>
                    </View>
                </View>

                {photos && photos.length > 0 && (
                    <View style={styles.photoCountContainer}>
                        <Ionicons name="images-outline" size={13} color={Colors.primary} />
                        <Text style={styles.photoCountText}>{photos.length}</Text>
                    </View>
                )}
            </View>

            <Text style={styles.title} numberOfLines={1}>
                {displayTitle}
            </Text>

            {displayContact ? (
                <View style={styles.contactRow}>
                    <Ionicons name="person-circle-outline" size={14} color={Colors.text.secondary} />
                    <Text style={styles.customerName} numberOfLines={1}>
                        {displayContact}
                    </Text>
                </View>
            ) : null}

            {notes ? (
                <Text style={styles.notes} numberOfLines={3}>
                    {notes}
                </Text>
            ) : null}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        paddingVertical: 16,
        paddingRight: 16,
        paddingLeft: 20,
        borderColor: Colors.border,
        borderWidth: 1,
        overflow: 'hidden',
        gap: 8,
        ...Shadows.sm,
    },
    accentBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    badgeAndTime: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.text.secondary,
    },
    photoCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.primarySoft,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    photoCountText: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: '600',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    customerName: {
        flex: 1,
        fontSize: 13,
        fontWeight: '400',
        color: Colors.text.secondary,
    },
    notes: {
        fontSize: 13.5,
        fontWeight: '400',
        color: Colors.text.label,
        lineHeight: 20,
        marginTop: 2,
    },
});
