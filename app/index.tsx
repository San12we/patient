import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Index() {
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
        router.replace('/(routes)/onboarding');
      }
    }
  }, [isOnboarded, router]);

  if (isOnboarded === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return null;
}
