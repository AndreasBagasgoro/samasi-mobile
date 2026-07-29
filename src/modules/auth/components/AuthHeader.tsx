import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@shared/constants';

interface AuthHeaderProps {
  title?: string;
  subtitle?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ 
  title = 'Samasi', 
  subtitle 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
