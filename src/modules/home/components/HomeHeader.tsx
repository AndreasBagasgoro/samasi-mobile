import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MainCard } from '@shared/components/MainCard';
import { Colors, Layout } from '@shared/constants';

interface HomeHeaderProps {
    greet?: string;
    user?: string;
    title?: string;
    onPressNotification?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
    greet = 'Good Morning👋',
    user = 'Andreas',
    title = 'NCS Freight · Singapore',
    onPressNotification,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.head}>
                <View style={styles.headInfo}>
                    <Text style={styles.greet}>{greet}</Text>
                    <Text style={styles.user}>{user}</Text>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View style={styles.headAction}>
                    <TouchableOpacity
                        onPress={onPressNotification}
                        style={styles.iconButton}
                        activeOpacity={0.8}
                    >
                        <Feather name="bell" size={22} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.cardsRow}>
                <MainCard value="142" label="Customers" />
                <MainCard value="28" label="Active Deals" />
                <MainCard value="19" label="This Month" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 18,
        paddingTop: 28,
        paddingBottom: 28,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    head: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'flex-start', // Mentok atas untuk baris head
    },
    headInfo: {
        justifyContent: 'center',
        gap: 4,
    },
    headAction: {
        justifyContent: 'flex-start', // Mentok atas
        alignItems: 'flex-end',     // Mentok kanan
        alignSelf: 'flex-start',    // Memastikan kontainer mentok atas secara independen
    },
    greet: {
        fontSize: 12,
        color: '#7c7979',
    },
    iconButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
    },
    user: {
        fontSize: 22,
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: 'Inter',
    },
    title: {
        fontSize: 12,
        color: '#7c7979',
        marginBottom: 20,
    },
    cardsRow: {
        flexDirection: 'row',
        gap: 12,
    },
});