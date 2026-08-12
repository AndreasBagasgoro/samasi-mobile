import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Layout } from '@shared/constants';
import { Feather } from '@expo/vector-icons';
import { CustomerItem } from '../types';
import { getAvatarBackgroundColor } from '../constants/customer.constants';

export const DetailHeader: React.FC<CustomerItem> = ({
    profileInitial,
    name,
    customerType,
    totalContacts,
    lastActive,
    avatarBackgroundColor,
    status = 'inactive',
    onPress,
}) => {
    // Menentukan warna background avatar dari props atau fallback ke generator warna
    const bg = avatarBackgroundColor || getAvatarBackgroundColor(name || profileInitial);

    // Cek status untuk menerapkan Glassmorphism Theme (Green Glass vs Red Glass)
    const isActive = status?.toLowerCase() === 'active';

    // Green Glass style vs Red Glass style
    const glassBg = isActive ? 'rgba(16, 185, 129, 0.20)' : 'rgba(239, 68, 68, 0.20)';
    const glassBorder = isActive ? 'rgba(52, 211, 153, 0.40)' : 'rgba(248, 113, 113, 0.40)';
    const glassTextColor = isActive ? '#34D399' : '#F87171';

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={onPress} activeOpacity={0.7}>
                <Feather name='chevron-left' size={20} color={Colors.text.inverse} />
                <Text style={styles.headerText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.informationContainer}>
                <View style={[styles.profileContainer, { backgroundColor: bg }]}>
                    <Text style={styles.profileText}>
                        {profileInitial}
                    </Text>
                </View>
                <View style={styles.summaryContainer}>
                    <Text style={styles.customerName}>{name}</Text>
                    <Text style={styles.customerType}>{customerType}</Text>

                    {/* Glassmorphism Badge */}
                    <View style={[
                        styles.statusContainer,
                        {
                            backgroundColor: glassBg,
                            borderColor: glassBorder
                        }
                    ]}>
                        <Text style={[styles.statusText, { color: glassTextColor }]}>
                            {status.toUpperCase()}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Layout.screenPaddingHorizontal3,
        paddingTop: 16,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        borderBottomColor: Colors.border,
        backgroundColor: Colors.primary,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    headerText: {
        fontSize: 16,
        fontWeight: '400',
        color: Colors.text.inverse,
    },
    informationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    profileContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 4,
    },
    profileText: {
        fontWeight: '700',
        fontSize: 20,
        color: '#FFFFFF',
    },
    customerName: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.text.inverse,
    },
    customerType: {
        fontSize: 12,
        color: Colors.text.disabled,
    },
    statusContainer: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
        marginTop: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
});