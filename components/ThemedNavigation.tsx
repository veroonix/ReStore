// components/ThemedNavigation.tsx
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { AppNavigator } from '../navigation/AppNavigator';
import { View } from 'react-native';
import { Colors } from '../constants/Colors';

export const ThemedNavigation = () => {
  const { theme } = useTheme();
  const navTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  
  return (
    <View style={{ flex: 1, backgroundColor: Colors[theme].background }}>
    <NavigationContainer theme={navTheme}>
      <AppNavigator />
    </NavigationContainer>
    </View>
  );
};