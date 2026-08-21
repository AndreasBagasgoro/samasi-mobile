import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from "@shared/constants";

export const CustomerNotFound: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <MaterialIcons name="search-off" color={Colors.semantic.info} size={36} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Customer Not Found</Text>
                <Text style={styles.description}>Try a different spelling, or search by industry, contact name, or phone number.</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 96,
        backgroundColor: '#F5F7FF',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Colors.semanticBg.info,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 48,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.primary,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        fontWeight: '400',
        color: Colors.text.secondary,
        textAlign: 'center',
    }

})
