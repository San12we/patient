import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useNotification } from '@/context/NotificationsContext';

export default function Index() {
  const { expoPushToken, notification, error } = useNotification(); // Use the notification context
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const router = useRouter();

  // Check if the user has completed onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const onboarded = await AsyncStorage.getItem('onboarded');
        setIsOnboarded(onboarded === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsOnboarded(false); // Default to false if there's an error
      }
    };

    checkOnboarding();
  }, []);

  // Navigate based on onboarding status
  useEffect(() => {
    if (isOnboarded !== null) {
      if (isOnboarded) {
        router.replace('/auth/login'); // Navigate to login if onboarded
      } else {
        router.replace('/onboarding'); // Navigate to onboarding if not onboarded
      }
    }
  }, [isOnboarded, router]);

  // Handle notification errors and display notifications
  useEffect(() => {
    if (error) {
      console.error('Notification error:', error);
      Alert.alert('Notification Error', error.message); // Display error to the user
    }

    if (notification) {
      console.log('Notification received:', JSON.stringify(notification, null, 2));
      const { title, body } = notification.request.content;

      if (title && body) {
        Alert.alert(title, body); // Display the notification as an alert
      }
    }
  }, [notification, error]);

  // Log and store the Expo Push Token
  useEffect(() => {
    if (expoPushToken) {
      console.log('Expo Push Token:', expoPushToken); // Log the token
      // Note: The token is already stored in the NotificationProvider, so no need to store it here again.
    }
  }, [expoPushToken]);

  return null; // No UI to render
}