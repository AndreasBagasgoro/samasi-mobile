import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '@shared/constants';
import { CustomerItem } from '../types';
import { getAvatarGradient } from '../constants/customer.constants';

export const CustomerCard: React.FC<CustomerItem> = ({
    profileInitial,
    name,
    customerType,
    lastActive,
    onPress,
}) => {
    // Gradient avatar biru yang deterministik berdasarkan nama
    const avatarGradient = getAvatarGradient(name || profileInitial);

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={onPress}
            activeOpacity={0.75}
        >
            <LinearGradient
                colors={avatarGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.profileContainer}
            >
                <Text style={styles.profileText}>
                    {profileInitial}
                </Text>
            </LinearGradient>

            <View style={styles.contactInfoContainer}>
                <Text style={styles.name} numberOfLines={1}>{name}</Text>
                <View style={styles.detailsRow}>
                    {customerType ? (
                        <View style={styles.typeBadge}>
                            <Text style={styles.customerType}>{customerType}</Text>
                        </View>
                    ) : null}
                    {lastActive ? (
                        <View style={styles.lastActiveRow}>
                            <Ionicons name="time-outline" size={12} color={Colors.text.disabled} />
                            <Text style={styles.lastActive}>{lastActive}</Text>
                        </View>
                    ) : null}
                </View>
            </View>

            <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: Colors.border,
        borderWidth: 1,
        gap: 14,
        flexDirection: 'row',
        ...Shadows.sm,
    },
    profileContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileText: {
        fontWeight: '700',
        fontSize: 16,
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    contactInfoContainer: {
        flex: 1,
        gap: 6,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
    },
    name: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    typeBadge: {
        backgroundColor: Colors.primarySoft,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    customerType: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.primary,
    },
    lastActiveRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    lastActive: {
        fontSize: 11,
        fontWeight: '400',
        color: Colors.text.secondary,
    },
    arrowContainer: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: Colors.primarySoft,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
