import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '@shared/constants';
import { CustomerItem } from '../types';
import { Feather } from '@expo/vector-icons';
import { getAvatarBackgroundColor } from '../constants/customer.constants';

export const CustomerCard: React.FC<CustomerItem> = ({
    profileInitial,
    name,
    customerType,
    totalContacts,
    lastActive,
    avatarBackgroundColor,
    onPress,
}) => {
    // Menghasilkan warna background tegas (tidak pudar) secara acak-deterministik
    const bg = avatarBackgroundColor || getAvatarBackgroundColor(name || profileInitial);

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.profileContainer, { backgroundColor: bg }]}>
                <Text style={styles.profileText}>
                    {profileInitial}
                </Text>
            </View>

            <View style={styles.contactInfoContainer}>
                <Text style={styles.name}>{name}</Text>
                <View style={styles.detailsRow}>
                    <Text style={styles.customerType}>{customerType}</Text>
                    <Text style={styles.dot}>·</Text>
                    <Text style={styles.totalContacts}>{totalContacts} Contacts</Text>
                </View>
                <Text style={styles.lastActive}>{lastActive}</Text>
            </View>

            <View style={styles.arrowContainer}>
                <Feather name="chevron-right" size={18} color={Colors.text.disabled} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: Colors.border,
        borderWidth: 1,
        gap: 12,
        flexDirection: 'row',
    },
    profileContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileText: {
        fontWeight: '700',
        fontSize: 15,
        color: '#FFFFFF', // 👈 Selalu berwarna putih pekat
    },
    contactInfoContainer: {
        flex: 1,
        gap: 4,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    name: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    customerType: {
        fontSize: 12,
        fontWeight: '400',
        color: Colors.text.secondary,
    },
    dot: {
        color: Colors.text.secondary,
        fontSize: 12,
    },
    totalContacts: {
        fontSize: 12,
        fontWeight: '400',
        color: Colors.text.secondary,
    },
    lastActive: {
        fontSize: 10,
        fontWeight: '400',
        color: Colors.text.secondary,
    },
    arrowContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
    },
});
