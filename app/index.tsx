import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";

export default function Index() {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const router = useRouter();

  const checkOnboarding = async () => {
    try {
      const onboarded = await AsyncStorage.getItem('onboarded');
      setIsOnboarded(onboarded === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsOnboarded(false); // Default to false if there's an error
    }
  };

  const registerForNotifications = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        // Store the token in AsyncStorage
        await AsyncStorage.setItem('expoPushToken', token);
        // Optionally, send the token to your backend to associate it with the current user
        // await api.updateUserPushToken(token);
      }
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  };

  // Clear the token when a user logs out
  const clearPushToken = async () => {
    try {
      await AsyncStorage.removeItem('expoPushToken');
      // Optionally, notify your backend to remove the token for the current user
      // await api.removeUserPushToken();
    } catch (error) {
      console.error('Error clearing push token:', error);
    }
  };

  // Check if the user has completed onboarding
  useEffect(() => {
    checkOnboarding();
  }, []);

  // Register for push notifications
  useEffect(() => {
    registerForNotifications();
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

  return null; // No UI to render
}