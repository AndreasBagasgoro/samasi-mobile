import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
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
      <View style={styles.alllogo}>
      <Image
        source={require('../../../../assets/logo-samasi.png')}
        style={styles.logo}
      />
      <Image 
        source={require('../../../../assets/samasi-text.png')}
        style={styles.logotext}
      />
      </View>

      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    marginTop: 40,
  },
  text: {
    flexDirection: 'column',
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  alllogo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 60,
    paddingLeft: 20,
    marginBottom: -50,
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginRight: -30,
  },
  logotext: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  }
});
