import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export const getSharedStyles = (theme: 'light' | 'dark') => {
  const colors = Colors[theme];
  return StyleSheet.create({
    // Контейнер для всего экрана с учётом отступов
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    // Хедер (общий для всех экранов, кроме MainScreen)
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    // Кнопка назад (с фоном)
    backButton: {
      padding: 8,
      borderRadius: 12,
      backgroundColor: colors.iconBackground,
      marginRight: 16,
    },
    // Кнопка с иконкой (для настроек, редактирования)
    iconButton: {
      padding: 8,
      borderRadius: 12,
      backgroundColor: colors.iconBackground,
    },
    // Основной контент с отступами
    content: {
      flex: 1,
    },
    // Карточка (для объявлений и секций настроек)
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
    },
    // Ряд с иконкой и текстом
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      backgroundColor: colors.iconBackground,
    },
    rowText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    // Секция с заголовком
    sectionLabel: {
      marginHorizontal: 20,
      marginBottom: 8,
      fontSize: 13,
      color: colors.secondaryText,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    // Кнопки выбора языка
    langButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    langBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: colors.iconBackground,
    },
    activeBadge: {
      backgroundColor: colors.primary,
    },
    langBadgeText: {
      fontWeight: '600',
      color: colors.secondaryText,
    },
    activeBadgeText: {
      color: '#FFF',
    },
    // Плавающая кнопка действия (FAB)
    fab: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      backgroundColor: colors.primary,
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },
  });
};