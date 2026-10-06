import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@shared/constants';

interface ContactNotFoundProps {
  isSearchActive?: boolean;
}

export const ContactNotFound: React.FC<ContactNotFoundProps> = ({ isSearchActive = false }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconHalo}>
        <LinearGradient
          colors={Gradients.button.colors}
          start={Gradients.button.start}
          end={Gradients.button.end}
          style={styles.iconContainer}
        >
          <MaterialIcons
            name={isSearchActive ? 'search-off' : 'contacts'}
            color={Colors.text.inverse}
            size={34}
          />
        </LinearGradient>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {isSearchActive ? 'Contact Not Found' : 'No Contacts Yet'}
        </Text>
        <Text style={styles.description}>
          {isSearchActive
            ? 'Try a different spelling, or search by job title, phone number, or email.'
            : 'Tap the (+) button to add your first contact.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 96,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  iconHalo: {
    padding: 10,
    borderRadius: 36,
    backgroundColor: Colors.primarySoft,
  },
  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 48,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ContactNotFound;
