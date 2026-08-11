import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { Colors, Layout } from '@shared/constants';

interface AuthHeaderProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
};

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  children
}) => {
  const { height: screenHeight } = useWindowDimensions();
    const headerHeight = screenHeight / 3;

  return (
    <View style={styles.screen}>
          {/* 1/3 Layar Atas: Header dengan props greeting & name dinamis */}
          <View style={[styles.headerContainer, { height: headerHeight }]}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../../../assets/logo-samasi.png')}
                resizeMode="contain"
                style={styles.logo}
              />
              <Text style={styles.logoText}>Sales Diary</Text>
            </View>
    
            <View style={styles.textContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
          </View>
          <View style={styles.childrenContainer}>
            {children}
          </View>
        </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  headerContainer: {
    backgroundColor: Colors.primary,
    justifyContent: 'flex-start',
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: 48,
    paddingBottom: 24,
    borderBottomRightRadius: 32,
    borderBottomLeftRadius: 32,
    alignItems: 'flex-start',
    gap: 36,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logo: {
    width: 50,
    height: 50,
  },
  logoText: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 4,
    fontWeight: '700',
  },
  textContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  title: {
    fontSize: 28,
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
  },
  childrenContainer: {
    flex: 1,
  },

});


