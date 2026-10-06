import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Gradients, Layout } from '@shared/constants';
import { CustomerItem } from '../types';
import { getAvatarGradient } from '../constants/customer.constants';

export const DetailHeader: React.FC<CustomerItem> = ({
    profileInitial,
    name,
    customerType,
    city,
    status = 'inactive',
    onPress,
}) => {
    const insets = useSafeAreaInsets();
    const avatarGradient = getAvatarGradient(name || profileInitial);

    // Badge status bergaya glass (hijau = aktif, merah = tidak aktif)
    const isActive = status?.toLowerCase() === 'active';
    const statusColor = isActive ? '#34D399' : '#FCA5A5';

    return (
        <LinearGradient
            colors={Gradients.primary.colors}
            start={Gradients.primary.start}
            end={Gradients.primary.end}
            style={[styles.container, { paddingTop: insets.top + 12 }]}
        >
            <View style={[styles.decorCircle, styles.decorCircleLarge]} />
            <View style={[styles.decorCircle, styles.decorCircleSmall]} />

            <View style={styles.topBar}>
                <TouchableOpacity style={styles.glassButton} onPress={onPress} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={20} color={Colors.text.inverse} />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Customer Detail</Text>
                <TouchableOpacity style={styles.glassButton} activeOpacity={0.7}>
                    <Ionicons name="ellipsis-horizontal" size={18} color={Colors.text.inverse} />
                </TouchableOpacity>
            </View>

            <View style={styles.informationContainer}>
                <View style={styles.avatarRing}>
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
                </View>
                <View style={styles.summaryContainer}>
                    <Text style={styles.customerName} numberOfLines={2}>{name}</Text>
                    <View style={styles.metaRow}>
                        {customerType ? (
                            <View style={styles.metaItem}>
                                <Ionicons name="pricetag-outline" size={12} color={Colors.text.inverseMuted} />
                                <Text style={styles.metaText}>{customerType}</Text>
                            </View>
                        ) : null}
                        {city ? (
                            <View style={styles.metaItem}>
                                <Ionicons name="location-outline" size={12} color={Colors.text.inverseMuted} />
                                <Text style={styles.metaText}>{city}</Text>
                            </View>
                        ) : null}
                    </View>

                    <View style={styles.statusContainer}>
                        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                        <Text style={[styles.statusText, { color: statusColor }]}>
                            {status.toUpperCase()}
                        </Text>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Layout.screenPaddingHorizontal3,
        paddingBottom: 26,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        overflow: 'hidden',
        gap: 22,
    },
    decorCircle: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(96, 165, 250, 0.10)',
    },
    decorCircleLarge: {
        width: 220,
        height: 220,
        top: -80,
        right: -70,
    },
    decorCircleSmall: {
        width: 110,
        height: 110,
        bottom: -40,
        left: -30,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    topBarTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text.inverse,
    },
    glassButton: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: Colors.glass.background,
        borderWidth: 1,
        borderColor: Colors.glass.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    informationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatarRing: {
        padding: 3,
        borderRadius: 24,
        backgroundColor: Colors.glass.strong,
    },
    profileContainer: {
        width: 64,
        height: 64,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileText: {
        fontWeight: '700',
        fontSize: 22,
        color: '#FFFFFF',
    },
    summaryContainer: {
        flex: 1,
        alignItems: 'flex-start',
        gap: 6,
    },
    customerName: {
        fontSize: 19,
        fontWeight: '700',
        color: Colors.text.inverse,
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: Colors.text.inverseMuted,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 4,
        backgroundColor: Colors.glass.background,
        borderWidth: 1,
        borderColor: Colors.glass.border,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.8,
    },
});
