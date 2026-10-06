import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainCard } from '@shared/components/MainCard';
import { Colors, Gradients } from '@shared/constants';
import { getInitials } from '@shared/utils';

interface HomeHeaderProps {
    greet?: string;
    user?: string;
    title?: string;
    onPressNotification?: () => void;
    onPressProfile?: () => void;
}

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Good Morning';
    if (hour < 15) return 'Good Afternoon';
    if (hour < 19) return 'Good Evening';
    return 'Good Night';
};

export const HomeHeader: React.FC<HomeHeaderProps> = ({
    greet = getGreeting(),
    user = 'Andreas',
    title = 'NCS Freight · Singapore',
    onPressNotification,
    onPressProfile,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient
            colors={Gradients.primary.colors}
            start={Gradients.primary.start}
            end={Gradients.primary.end}
            style={[styles.container, { paddingTop: insets.top + 20 }]}
        >
            <View style={[styles.decorCircle, styles.decorCircleLarge]} />
            <View style={[styles.decorCircle, styles.decorCircleSmall]} />

            <View style={styles.head}>
                <View style={styles.profileRow}>
                    <TouchableOpacity
                        style={styles.avatar}
                        onPress={onPressProfile}
                        activeOpacity={0.8}
                        disabled={!onPressProfile}
                    >
                        <Text style={styles.avatarText}>{getInitials(user)}</Text>
                    </TouchableOpacity>
                    <View style={styles.headInfo}>
                        <Text style={styles.greet}>{greet}</Text>
                        <Text style={styles.user} numberOfLines={1}>{user}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={onPressNotification}
                    style={styles.iconButton}
                    activeOpacity={0.8}
                >
                    <Ionicons name="notifications-outline" size={20} color={Colors.text.inverse} />
                    <View style={styles.notificationDot} />
                </TouchableOpacity>
            </View>

            <View style={styles.locationPill}>
                <Ionicons name="business-outline" size={12} color={Colors.text.inverseMuted} />
                <Text style={styles.title}>{title}</Text>
            </View>

            <View style={styles.cardsRow}>
                <MainCard
                    value="142"
                    label="Customers"
                    icon={<Ionicons name="people-outline" size={16} color={Colors.text.inverse} />}
                />
                <MainCard
                    value="28"
                    label="Active Deals"
                    icon={<Ionicons name="briefcase-outline" size={16} color={Colors.text.inverse} />}
                />
                <MainCard
                    value="19"
                    label="This Month"
                    icon={<Ionicons name="trending-up-outline" size={16} color={Colors.text.inverse} />}
                />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 28,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: 'hidden',
    },
    decorCircle: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(96, 165, 250, 0.10)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    decorCircleLarge: {
        width: 240,
        height: 240,
        top: -110,
        right: -70,
    },
    decorCircleSmall: {
        width: 120,
        height: 120,
        bottom: -50,
        left: -30,
    },
    head: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.glass.strong,
        borderWidth: 1,
        borderColor: Colors.glass.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: Colors.text.inverse,
        fontSize: 17,
        fontWeight: '700',
    },
    headInfo: {
        flex: 1,
        gap: 2,
    },
    greet: {
        fontSize: 13,
        color: Colors.text.inverseMuted,
    },
    user: {
        fontSize: 22,
        color: Colors.text.inverse,
        fontWeight: '700',
    },
    iconButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.glass.background,
        borderWidth: 1,
        borderColor: Colors.glass.border,
        borderRadius: 14,
    },
    notificationDot: {
        position: 'absolute',
        top: 11,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.secondary,
        borderWidth: 1.5,
        borderColor: Colors.primaryDark,
    },
    locationPill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 6,
        marginTop: 16,
        marginBottom: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: Colors.glass.background,
    },
    title: {
        fontSize: 12,
        color: Colors.text.inverseMuted,
        fontWeight: '500',
    },
    cardsRow: {
        flexDirection: 'row',
        gap: 10,
    },
});
