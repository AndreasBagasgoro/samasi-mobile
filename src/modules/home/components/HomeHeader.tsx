import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MainCard } from '@shared/components/MainCard';
import { LinearGradient } from 'expo-linear-gradient';

interface HomeHeaderProps {
    greet?: string;
    user?: string;
    title?: string;
    onPressNotification?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
    greet = 'Good Morning👋',
    user = 'syach',
    title = 'asdasdasd',
    onPressNotification,
}) => {
    return (
        <LinearGradient 
            colors={['#0A1628', '#0D2244', '#1565C0']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.container}>
            <View style={styles.head}>
                <Text style={styles.greet}>{greet}</Text>
                <TouchableOpacity
                    onPress={onPressNotification}
                    style={styles.iconButton}
                    activeOpacity={0.8}
                    >
                <Feather name="bell" size={22} color="#FFF" />
                </TouchableOpacity>
            </View>
            <Text style={styles.user}>{user}</Text>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.cardsRow}>
                <MainCard value="142" label="Customers" />
                <MainCard value="28" label="Active Deals" />
                <MainCard value="19" label="This Month" />
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create ({
    container: {
        padding: 20,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    head: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    greet: {
        fontSize: 18,
        color: '#7c7979'
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
        fontSize: 32,
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: 'Inter'
    },
    title: { 
        fontSize: 18,
        color: '#7c7979',
        marginBottom: 20
    },
    cardsRow: {
        flexDirection: 'row',
        gap: 12,
    }
})