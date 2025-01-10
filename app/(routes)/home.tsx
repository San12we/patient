import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the Home Screen</Text>
      <Button title="Login" onPress={() => router.push('/auth/login')} />
      <Button title="Sign Up" onPress={() => router.push('/auth/register')} />
    </View>
  );
}
