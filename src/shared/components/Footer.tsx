import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

export type FooterMenuItem = {
    id: string | number;
    title: string;
    onPress: () => void;
    icon?: React.ReactNode;
    isActive?: boolean;
};

type FooterProps = {
  items: FooterMenuItem[]; // Menerima array dari menu item
};

export default function Footer({ items }: FooterProps) {
    return (
    <View style={styles.container}>
        {items.map((item) => (
        <TouchableOpacity 
            key={item.id} 
            style={styles.button} 
            onPress={item.onPress}
            activeOpacity={0.7}
        >
            {item.icon && <View style={styles.iconWrapper}>{item.icon}</View>}
            <Text style={[styles.text, item.isActive && styles.activeText]}>
                {item.title}
            </Text>
        </TouchableOpacity>
        ))}
    </View>
    );
}

const styles = StyleSheet.create ({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    iconWrapper: {
        marginBottom: 4,
    },
    activeText: {
        color: '#0F172A',
        fontWeight: '700',
    },
})