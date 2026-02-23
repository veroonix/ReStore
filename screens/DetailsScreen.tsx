import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';
import { ArrowLeft, Edit } from 'lucide-react-native';

type DetailsRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailsNavigationProp = StackNavigationProp<RootStackParamList, 'Details'>;

export default function DetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<DetailsNavigationProp>();
  const route = useRoute<DetailsRouteProp>();
  const { ad } = route.params;
  const { theme, isDark } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: Colors[theme].card,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: Colors[theme].text,
    },
    editButton: {
      padding: 8,
    },
    content: {
      padding: 20,
    },
    label: {
      fontSize: 14,
      color: Colors[theme].primary,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors[theme].text,
      marginBottom: 10,
    },
    price: {
      fontSize: 20,
      color: Colors[theme].primary,
      marginBottom: 15,
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      color: Colors[theme].secondaryText,
      marginBottom: 20,
    },
    date: {
      fontSize: 14,
      color: Colors[theme].secondaryText,
    }
  }), [theme]);

  const handleEdit = () => {
    navigation.navigate('AdForm', { adId: ad.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Кастомный хедер */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors[theme].text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('details')}</Text>
        </View>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Edit size={22} color={Colors[theme].primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>{t('details')}</Text>
        <Text style={styles.title}>{ad.title}</Text>
        <Text style={styles.price}>{ad.price}</Text>
        <Text style={styles.description}>{ad.description}</Text>
        <Text style={styles.date}>{t('date')}: {ad.date}</Text>
      </View>
    </SafeAreaView>
  );
}