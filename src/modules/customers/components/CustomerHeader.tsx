import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Gradients, Layout } from '@shared/constants';
import { Input } from '@shared/components';
import { Filter } from './Filter';

interface CustomerHeaderProps {
    searchValue?: string;
    onSearchChange?: (text: string) => void;
    totalCount?: number;
    selectedFilterId?: string;
    onFilterChange?: (filterId: string) => void;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
    searchValue = '',
    onSearchChange,
    totalCount,
    selectedFilterId,
    onFilterChange,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View>
            <LinearGradient
                colors={Gradients.primary.colors}
                start={Gradients.primary.start}
                end={Gradients.primary.end}
                style={[styles.container, { paddingTop: insets.top + 20 }]}
            >
                <View style={styles.decorCircle} />
                <View style={styles.head}>
                    <View>
                        <Text style={styles.caption}>Relationship</Text>
                        <Text style={styles.customerText}>Customers</Text>
                    </View>
                    <View style={styles.customerAmountContainer}>
                        <Ionicons name="business-outline" size={13} color={Colors.text.inverse} />
                        <Text style={styles.customerAmount}>
                            {totalCount !== undefined ? `${totalCount} Total` : 'Amount'}
                        </Text>
                    </View>
                </View>
                <Input
                    value={searchValue}
                    onChangeText={onSearchChange}
                    leftIcon={
                        <Ionicons name="search-outline" size={18} color={Colors.primary} />
                    }
                    placeholder="Search customers..."
                    placeholderTextColor={Colors.text.disabled}
                    containerStyle={styles.searchContainer}
                    inputContainerStyle={styles.searchBarContainerStyle}
                />
            </LinearGradient>
            <View style={styles.filterContainer}>
                <Filter
                    selectedFilterId={selectedFilterId}
                    onFilterChange={onFilterChange}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Layout.screenPaddingHorizontal3,
        paddingBottom: 22,
        gap: 18,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        overflow: 'hidden',
    },
    decorCircle: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        top: -90,
        right: -60,
        backgroundColor: 'rgba(96, 165, 250, 0.12)',
    },
    head: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    caption: {
        fontSize: 12,
        color: Colors.text.inverseMuted,
        letterSpacing: 0.6,
        marginBottom: 2,
    },
    customerText: {
        fontSize: 26,
        fontWeight: '700',
        color: Colors.text.inverse,
    },
    customerAmountContainer: {
        flexDirection: 'row',
        gap: 6,
        backgroundColor: Colors.glass.background,
        borderWidth: 1,
        borderColor: Colors.glass.border,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    customerAmount: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text.inverse,
    },
    searchContainer: {
        marginBottom: 0,
    },
    searchBarContainerStyle: {
        backgroundColor: Colors.surface,
        borderColor: 'transparent',
        borderWidth: 1,
        borderRadius: 16,
    },
    filterContainer: {
        paddingHorizontal: Layout.screenPaddingHorizontal2,
        paddingTop: 16,
    },
});
