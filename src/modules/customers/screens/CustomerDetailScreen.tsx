import React, { useState, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, useWindowDimensions, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@shared/constants';
import { CUSTOMER_ITEMS, getAvatarBackgroundColor } from '../constants/customer.constants';
import { DetailHeader, Navigation } from '../components';
import { 
  OverviewTabScreen, 
  ContactsTabScreen, 
  DealsTabScreen, 
  TimelineTabScreen 
} from './detail-tabs';

export const CustomerDetailScreen: React.FC = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { width: screenWidth } = useWindowDimensions();

    const [activeTab, setActiveTab] = useState(0);
    const scrollViewRef = useRef<any>(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    // Cari data customer berdasarkan ID yang dikirim dari URL
    const customer = CUSTOMER_ITEMS.find((item) => item.id === id) || {
        id: id || 'unknown',
        profileInitial: 'CU',
        name: 'Customer Detail',
        customerType: 'NVOCC',
        totalContacts: 5,
        lastActive: 'Active recently',
        status: 'active',
    };

    const avatarBg = getAvatarBackgroundColor(customer.name || customer.profileInitial);

    const handleTabPress = (index: number) => {
        setActiveTab(index);
        scrollViewRef.current?.scrollTo({ x: index * screenWidth, animated: true });
    };

    const handleScrollRef = useRef<any>(null);
    if (!handleScrollRef.current) {
        handleScrollRef.current = Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
                useNativeDriver: false,
                listener: (e: any) => {
                    const offsetX = e.nativeEvent.contentOffset.x;
                    const index = Math.round(offsetX / screenWidth);
                    if (index >= 0 && index < 4) {
                        setActiveTab(index);
                    }
                },
            }
        );
    }
    const handleScroll = handleScrollRef.current;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* 1. Header Kembali & Ringkasan Customer */}
            <DetailHeader
                {...customer}
                avatarBackgroundColor={avatarBg}
                onPress={() => router.back()}
            />

            {/* 2. Navigation Tab Bar dengan Animasi Garis Underline Bergeser */}
            <Navigation
                activeTab={activeTab}
                onTabPress={handleTabPress}
                scrollX={scrollX}
            />

            {/* 3. Horizontal Swipable Tab Screens (Animated ScrollView) */}
            <Animated.ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={handleScroll}
                style={styles.pager}
            >
                <View style={{ width: screenWidth }}>
                    <OverviewTabScreen customer={customer} />
                </View>
                <View style={{ width: screenWidth }}>
                    <ContactsTabScreen customer={customer} />
                </View>
                <View style={{ width: screenWidth }}>
                    <DealsTabScreen customer={customer} />
                </View>
                <View style={{ width: screenWidth }}>
                    <TimelineTabScreen customer={customer} />
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    pager: {
        flex: 1,
    },
});