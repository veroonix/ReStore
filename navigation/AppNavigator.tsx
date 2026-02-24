// navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';
import { RootStackParamList } from '../types';
import MainScreen from '../screens/MainScreen';
import DetailsScreen from '../screens/DetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AdFormScreen from '../screens/AdFormScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { t } = useTranslation();
  const { theme } = useTheme(); // получаем текущую тему

  return (
    <Stack.Navigator
      initialRouteName="Main"
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
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdForm"
        component={AdFormScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};