import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Input, Button } from '@shared/components';
import { Colors } from '@shared/constants';
import { useLoginForm } from '../hooks';
import { useAuth } from '../hooks';
import { Feather } from '@expo/vector-icons';

export const LoginForm = () => {
  const { 
    username, 
    password, 
    errors, 
    isLoading, 
    setUsername, 
    setPassword, 
    handleSubmit 
  } = useLoginForm();
  
  const { error: storeError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  return (
    
    <View style={styles.container}>
      {storeError && (
        <Text style={styles.errorText}>{storeError}</Text>
      )}

      <Input
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username"
        keyboardType="default"
        autoCapitalize="none"
        error={errors.username}
        leftIcon={
          <Feather name="user" size={20} color="#333"/>
        }
      />
      
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        error={errors.password}
        leftIcon={
          <Feather name="lock" size={20} color="#333"/>
        }
        rightIcon={
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Feather 
            name={showPassword ? "eye" : "eye-off"} // Otomatis ganti ikon
            size={20} 
            color="#333" 
          />
        </TouchableOpacity>
        }
      />

      <Button
        title="Login"
        onPress={handleSubmit}
        loading={isLoading}
        style={styles.submitButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 40,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 99,
  },
  toggleText: {
    color: Colors.primary,
    fontSize: 12,
  },
  errorText: {
    color: Colors.semantic.error,
    marginBottom: 16,
    textAlign: 'center',
  },
});
