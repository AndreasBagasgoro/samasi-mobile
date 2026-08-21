import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, useWindowDimensions } from 'react-native';
import { Colors } from '@shared/constants';

interface NavigationProps {
  tabs?: string[];
  activeTab: number;
  onTabPress: (index: number) => void;
  scrollX?: Animated.Value;
}

const DEFAULT_TABS = ['Overview', 'Contacts', 'Deals', 'Timeline'];

export const Navigation: React.FC<NavigationProps> = ({
  tabs = DEFAULT_TABS,
  activeTab,
  onTabPress,
  scrollX,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const tabWidth = screenWidth / tabs.length;
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!scrollX) {
      Animated.spring(animatedValue, {
        toValue: activeTab * tabWidth,
        useNativeDriver: true,
        bounciness: 4,
      }).start();
    }
  }, [activeTab, tabWidth, scrollX]);

  const indicatorTranslateX = scrollX
    ? scrollX.interpolate({
        inputRange: tabs.map((_, i) => i * screenWidth),
        outputRange: tabs.map((_, i) => i * tabWidth),
        extrapolate: 'clamp',
      })
    : animatedValue;

  return (
    <View style={styles.container}>
      <View style={styles.tabsRow}>
        {tabs.map((tabLabel, index) => {
          const isActive = activeTab === index;
          return (
            <TouchableOpacity
              key={tabLabel}
              style={styles.tabItem}
              onPress={() => onTabPress(index)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tabLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Indikator Animasi Garis Bawah Biru (Gliding Slide Indicator) */}
      <Animated.View
        style={[
          styles.animatedIndicator,
          {
            width: tabWidth,
            transform: [{ translateX: indicatorTranslateX }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: 'relative',
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: '#3B82F6', // 👈 Teks Biru saat Aktif
    fontWeight: '700',
  },
  animatedIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2.5,
    backgroundColor: '#3B82F6', // 👈 Garis Biru Menggeser (Gliding Underline)
    borderRadius: 2,
  },
});
