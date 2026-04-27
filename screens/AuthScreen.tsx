import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';
import { useTranslation } from 'react-i18next';

export default function AuthScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { signIn, signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert(t('error'), t('fillAllFields'));
      return;
    }
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error: any) {
      Alert.alert(t('error'), error.message);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: Colors[theme].background,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: Colors[theme].text,
      marginBottom: 30,
      textAlign: 'center',
    },
    input: {
      backgroundColor: Colors[theme].card,
      borderWidth: 1,
      borderColor: Colors[theme].border,
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      fontSize: 16,
      color: Colors[theme].text,
    },
    button: {
      backgroundColor: Colors[theme].primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 8,
    },
    buttonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '700',
    },
    switchButton: {
      marginTop: 16,
      alignItems: 'center',
    },
    switchText: {
      color: Colors[theme].primary,
      fontSize: 14,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors[theme].primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? t('login') : t('register')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('email')}
        placeholderTextColor={Colors[theme].secondaryText}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder={t('password')}
        placeholderTextColor={Colors[theme].secondaryText}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isLogin ? t('login') : t('register')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.switchButton} onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin ? t('noAccount') : t('haveAccount')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}