import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useTranslation } from 'react-i18next';

export const NetworkStatusBar = () => {
  const isConnected = useNetworkStatus();
  const { t } = useTranslation();
  if (isConnected) return null;

  return (
    <View style={styles.offlineBar}>
      <Text style={styles.offlineText}>{t('connection')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  offlineBar: {
    backgroundColor: '#FF3B30',
    padding: 8,
    alignItems: 'center',
  },
  offlineText: {
    color: '#FFF',
    fontWeight: '600',
  },
});