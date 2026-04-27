import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';
import { RootStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';
import MainScreen from '../screens/MainScreen';
import DetailsScreen from '../screens/DetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AdFormScreen from '../screens/AdFormScreen';
import AuthScreen from '../screens/AuthScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{
        cardStyle: { backgroundColor: Colors[theme].background },
        headerStyle: {
          backgroundColor: Colors[theme].card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors[theme].border,
        },
        headerTintColor: Colors[theme].text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: Colors[theme].text,
        },
        headerTitleAlign: 'center',
      }}
    >
      {!user ? (
        // Если не авторизован, показываем только экран авторизации
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      ) : (
        // Если авторизован, показываем основной стек
        <>
          <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AdForm" component={AdFormScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};