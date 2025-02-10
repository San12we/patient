import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {requestUserPermission } from '../utils/firebaseMessaging';

export default function Index() {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const router = useRouter();
  
  useEffect(()=>{
    requestUserPermission()
  },[]
  )

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

  return null; // No UI to render
}