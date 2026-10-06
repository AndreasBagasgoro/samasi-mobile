import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from "@shared/constants";

export const CustomerEmpty: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.iconHalo}>
                <LinearGradient
                    colors={Gradients.button.colors}
                    start={Gradients.button.start}
                    end={Gradients.button.end}
                    style={styles.iconContainer}
                >
                    <MaterialIcons name="person-add-alt-1" color={Colors.text.inverse} size={34} />
                </LinearGradient>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>No Customers Yet</Text>
                <Text style={styles.description}>Add your first customer to get started. You can also import customers from a CSV file.</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 96,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    iconHalo: {
        padding: 10,
        borderRadius: 36,
        backgroundColor: Colors.primarySoft,
    },
    iconContainer: {
        width: 76,
        height: 76,
        borderRadius: 26,
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
        fontWeight: '700',
        color: Colors.text.primary,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        fontWeight: '400',
        color: Colors.text.secondary,
        textAlign: 'center',
    }

})
