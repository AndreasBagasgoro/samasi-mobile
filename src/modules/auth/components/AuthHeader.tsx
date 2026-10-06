import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Colors, Gradients, Layout, Shadows } from '@shared/constants';

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
  const headerHeight = Math.max(screenHeight * 0.42, 300);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      {/* Hero gradient biru dengan ornamen lingkaran dekoratif */}
      <LinearGradient
        colors={Gradients.primary.colors}
        start={Gradients.primary.start}
        end={Gradients.primary.end}
        style={[styles.headerContainer, { height: headerHeight }]}
      >
        <View style={[styles.decorCircle, styles.decorCircleLarge]} />
        <View style={[styles.decorCircle, styles.decorCircleSmall]} />

        <View style={styles.logoContainer}>
          <View style={styles.logoBadge}>
            <Image
              source={require('../../../../assets/logo-samasi.png')}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>
          <View>
            <Text style={styles.logoText}>Sales Diary</Text>
            <Text style={styles.logoCaption}>PT Samasi</Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight - 48 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {children}
        </View>
        <Text style={styles.footer}>© PT Samasi · Secure Sign-in</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: 56,
    borderBottomRightRadius: 36,
    borderBottomLeftRadius: 36,
    overflow: 'hidden',
    gap: 36,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    backgroundColor: 'rgba(96, 165, 250, 0.10)',
  },
  decorCircleLarge: {
    width: 280,
    height: 280,
    top: -90,
    right: -100,
  },
  decorCircleSmall: {
    width: 140,
    height: 140,
    bottom: -40,
    left: -50,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 38,
    height: 38,
  },
  logoText: {
    fontSize: 20,
    color: Colors.text.inverse,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  logoCaption: {
    fontSize: 12,
    color: Colors.text.inverseMuted,
    marginTop: 2,
    letterSpacing: 1,
  },
  textContainer: {
    gap: 8,
  },
  title: {
    fontSize: 30,
    color: Colors.text.inverse,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.text.inverseMuted,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Layout.screenPaddingHorizontal3,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 12,
    color: Colors.text.disabled,
  },
});
