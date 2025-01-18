import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useNotification } from '@/context/NotificationsContext';

export default function Index() {
  const { expoPushToken, notification, error } = useNotification(); // Import and use the hook
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      const onboarded = await AsyncStorage.getItem('onboarded');
      setIsOnboarded(onboarded === 'true');
    };

    checkOnboarding();
  }, []);

  useEffect(() => {
    if (isOnboarded !== null) {
      if (isOnboarded) {
        router.replace('/auth/login');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [isOnboarded, router]);

  useEffect(() => {
    if (error) {
      console.error('Notification error:', error);
    } else if (notification) {
      console.log('Notification received:', JSON.stringify(notification, null, 2));
      const { title, body } = notification.request.content;
      Alert.alert(title, body); // Display the notification as an alert
    }
  }, [notification, error]);

  useEffect(() => {
    if (expoPushToken) {
      console.log('Expo Push Token:', expoPushToken); // Log the Expo Push Token
      AsyncStorage.setItem('expoPushToken', expoPushToken); // Store the token in AsyncStorage
    }
  }, [expoPushToken]);

  return null; // Do not render any view
}
