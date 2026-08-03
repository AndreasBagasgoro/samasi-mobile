import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useAuthStore } from '@modules/auth';

interface UserGreetProps {
    date?: Date;
    greet?: string;
    name?: string;
}

const user = useAuthStore((state) => state.user);
const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
})

export const UserGreet: React.FC<UserGreetProps> = ({ 
  greet = 'Hello',
  name = 'user',
}) => {
  return (
    <View style={styles.container}>
        <Text style={styles.date}>{today}</Text>
        <Text style={styles.greet}>{greet}, {name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    date: {
        fontSize: 12,
        paddingBottom: 10,
        color: '#7a7979',
        marginBottom: -10,
    },
    greet: {
        fontSize: 24,
        fontWeight: 'bold',
    }
})