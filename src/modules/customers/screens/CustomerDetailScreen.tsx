import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@shared/constants';
import { getAvatarBackgroundColor } from '../constants/customer.constants';
import { DetailHeader, Navigation } from '../components';
import { 
  OverviewTabScreen, 
  ContactsTabScreen, 
  DealsTabScreen, 
  TimelineTabScreen 
} from './detail-tabs';
import { useCustomers } from '../hooks';

export const CustomerDetailScreen: React.FC = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { getCustomerById, fetchCustomerDetail } = useCustomers({ autoFetch: false });
    const { width: screenWidth } = useWindowDimensions();

    const [activeTab, setActiveTab] = useState(0);
    const scrollViewRef = useRef<any>(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (id) {
            fetchCustomerDetail(id);
        }
    }, [id, fetchCustomerDetail]);

    const customer = getCustomerById(id);
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

            <DetailHeader
                {...customer}
                avatarBackgroundColor={avatarBg}
                onPress={() => router.back()}
            />

            <Navigation
                activeTab={activeTab}
                onTabPress={handleTabPress}
                scrollX={scrollX}
            />

            <Animated.ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={handleScroll}
                style={styles.pager}
                contentContainerStyle={styles.pagerContent}
            >
                <View style={[styles.pageWrapper, { width: screenWidth }]}>
                    <OverviewTabScreen customer={customer} />
                </View>
                <View style={[styles.pageWrapper, { width: screenWidth }]}>
                    <ContactsTabScreen customer={customer} />
                </View>
                <View style={[styles.pageWrapper, { width: screenWidth }]}>
                    <DealsTabScreen customer={customer} />
                </View>
                <View style={[styles.pageWrapper, { width: screenWidth }]}>
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
    pagerContent: {
        flexGrow: 1,
    },
    pageWrapper: {
        flex: 1,
        height: '100%',
        // @ts-ignore - Izinkan gesture scroll vertikal di dalam swipe pager horizontal pada Web & Mobile
        touchAction: 'pan-y',
    },
});