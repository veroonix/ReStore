import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import { RootStackParamList } from '../types';
import MainScreen from '../screens/MainScreen';
import DetailsScreen from '../screens/DetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useTranslation } from 'react-i18next';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator 
      initialRouteName="Main"
      screenOptions={{
        // Белый чистый фон для хедера (как в современных iOS приложениях)
        headerStyle: { 
          backgroundColor: '#FFFFFF',
          elevation: 0,            // Убираем тень на Android
          shadowOpacity: 0,        // Убираем тень на iOS
          borderBottomWidth: 1,    // Добавляем тонкую линию вместо жирной тени
          borderBottomColor: '#F2F2F2',
        },
        headerTintColor: '#1A1A1A', // Цвет стрелки "Назад" и текста
        headerTitleStyle: { 
          fontWeight: '700', 
          fontSize: 18,
          color: '#1A1A1A',
        },
        //headerBackTitleVisible: false, // Скрываем текст "Back" на iOS для минимализма
        cardStyle: { backgroundColor: '#F8F9FA' }, // Общий фон для всех экранов
        headerTitleAlign: 'center', // Центрируем заголовок для единообразия
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={MainScreen} 
        options={{ 
          title: t('mainTitle'),
          headerShown: false, // Мы нарисовали красивый кастомный хедер в самом MainScreen
        }} 
      />
      
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen} 
        options={{ 
          title: t('details'), 
          headerShown: false, // Мы сделали кастомный прозрачный хедер внутри DetailsScreen
        }} 
      />
      
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          title: t('settings'),
          headerShown: true, // Здесь оставляем стандартный, он отлично впишется
          headerTitleAlign: Platform.OS === 'android' ? 'left' : 'center',
        }} 
      />
    </Stack.Navigator>
  );
};