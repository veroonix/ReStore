import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo'; // для Expo можно использовать expo-network

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  return isConnected;
};