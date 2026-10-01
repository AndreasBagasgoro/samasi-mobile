import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Layout } from '@shared/constants';
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
    return (
        <View style={styles.container}>
            <View style={styles.head}>
                <Text style={styles.customerText}>Customer</Text>
                <View style={styles.customerAmountContainer}>
                    <Text style={styles.customerAmount}>
                        {totalCount !== undefined ? `${totalCount} Customers` : 'Amount'}
                    </Text>
                </View>
            </View>
            <View style={styles.searchBarContainer}>
                <Input
                    value={searchValue}
                    onChangeText={onSearchChange}
                    leftIcon={
                        <Feather name="search" size={20} color={Colors.text.secondary} />
                    }
                    placeholder="Search customers..."
                    placeholderTextColor={Colors.text.secondary}
                    inputContainerStyle={styles.searchBarContainerStyle}
                />
            </View>
            <Filter
                selectedFilterId={selectedFilterId}
                onFilterChange={onFilterChange}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        paddingHorizontal: Layout.screenPaddingHorizontal2,
        paddingTop: 28,
        paddingBottom: 20,
        gap: 16,
        borderBottomWidth: 2,
        borderBottomColor: Colors.border,
    },
    head: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    customerText: {
        fontSize: 22,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    customerAmountContainer: {
        backgroundColor: Colors.background2,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    customerAmount: {
        fontSize: 12,
        color: Colors.text.secondary,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    searchBarContainerStyle: {
        backgroundColor: Colors.background2,
        borderColor: Colors.border,
        borderWidth: 1,
        borderRadius: 12,
    },
});