import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground'; // Ensure this is correctly imported
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import ClientHeader from '@/components/ClientHeader'; // Import ClientHeader

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true, // Enable header globally
        header: ({ route, options }) => <ClientHeader title={options.title} />, // Use title from options
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background, // Set header background color
        },
        headerTintColor: Colors[colorScheme ?? 'light'].text, // Set header text color
        headerTitleStyle: {
          fontWeight: 'bold', // Customize header title style
        },
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <LinearGradient
            colors={['rgba(55, 98, 122, 0.46)', 'rgba(211, 9, 177, 0.4)']} // Use the same gradient colors
            style={{ flex: 1 }}
          />
        ),
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            backgroundColor: 'transparent', // Set background color to transparent
            borderTopWidth: 0, // Remove border for a cleaner look
          },
          default: {
            backgroundColor: 'transparent', // Set background color to transparent
            borderTopWidth: 0,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={Colors.primary} />
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: 'Health',
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart-outline" size={24} color={Colors.primary} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Appointment',
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={24} color={Colors.primary} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={Colors.primary} />
          ),
        }}
      />
    </Tabs>
  );
}
