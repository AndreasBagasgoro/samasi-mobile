import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@shared/constants';
import { DiaryItem } from '../types';

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

const getInteractionBadgeStyle = (type?: string) => {
    const normalized = (type || '').toLowerCase();

    if (normalized.includes('call') || normalized.includes('telepon')) {
        return {
            bg: Colors.semanticBg.success, // #D1FAE5
            text: '#15803D',
        };
    }
    if (normalized.includes('meeting') || normalized.includes('visit') || normalized.includes('kunjungan')) {
        return {
            bg: Colors.semanticBg.info, // #DBEAFE
            text: '#1D4ED8',
        };
    }
    if (normalized.includes('email') || normalized.includes('surat')) {
        return {
            bg: '#F3E8FF', // Soft purple
            text: '#7E22CE',
        };
    }

    return {
        bg: '#F1F5F9',
        text: '#475569',
    };
};

export const DiaryCard: React.FC<DiaryItem> = ({
    title,
    customerName,
    interactionType,
    entryAt,
    contactName,
    notes,
    photos,
    onPress,
}) => {
    const displayTitle= title || 'No Title';
    const displayContact = contactName || '';
    const displayType = interactionType || 'Call';
    const displayTime = formatEntryTime(entryAt) || '10:15 AM';
    const badgeStyle = getInteractionBadgeStyle(displayType);

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.headerRow}>
                <View style={styles.badgeAndTime}>
                    <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
                        <Text style={[styles.badgeText, { color: badgeStyle.text }]}>
                            {displayType}
                        </Text>
                    </View>
                    <Text style={styles.timeText}>{displayTime}</Text>
                </View>

                {photos && photos.length > 0 && (
                    <View style={styles.photoCountContainer}>
                        <Feather name="image" size={14} color="#94A3B8" />
                        <Text style={styles.photoCountText}>{photos.length}</Text>
                    </View>
                )}
            </View>

            <View style={styles.titleSection}>
                <Text style={styles.title} numberOfLines={1}>
                    {displayTitle}
                </Text>
            </View>

            {displayContact ? (
                <View style={styles.customerNameSection}>
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
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderColor: Colors.border,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
        gap: 8,
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
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    timeText: {
        fontSize: 13,
        fontWeight: '400',
        color: '#94A3B8',
    },
    photoCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    photoCountText: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
    },
    titleSection: {
        gap: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    customerNameSection: {
        gap: 2,
    },
    customerName: {
        fontSize: 13,
        fontWeight: '400',
        color: Colors.text.secondary,
    },
    notes: {
        fontSize: 14,
        fontWeight: '400',
        color: '#334155',
        lineHeight: 20,
        marginTop: 4,
    },
});