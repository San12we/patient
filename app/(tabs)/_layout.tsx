import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground'; // Ensure this is correctly imported
import { theme } from '@/constants/theme'; // Import theme
import { useColorScheme } from '@/hooks/useColorScheme';
import ClientHeader from '@/components/ClientHeader'; // Import ClientHeader
import Colors from '@/components/Shared/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = '#bae8e8'; // Use theme color

  return (
    <>
      <StatusBar backgroundColor={backgroundColor} barStyle="light-content" /> {/* Extend color to status bar */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.textColor,
          headerShown: true, // Enable header globally
          header: () => <ClientHeader />, // Remove title from ClientHeader
          headerStyle: {
            backgroundColor: theme.colors.backgroundColor, // Set header background color
          },
          headerTintColor: theme.colors.headerColor, // Set header text color
          headerTitleStyle: {
            fontWeight: 'bold', // Customize header title style
          },
          tabBarButton: HapticTab,
          tabBarBackground: () => (
            <View style={{ flex: 1, backgroundColor }} /> // Use theme background color
          ),
          tabBarStyle: {
            backgroundColor: backgroundColor, // Set background color to theme color
            borderTopWidth: 0, // Remove border for a cleaner look
            position: 'absolute', // Ensure the tab bar is positioned at the bottom
            left: 0,
            right: 0,
            bottom: 0,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" size={24} color={theme.colors.textColor} />
            ),
          }}
        />
        <Tabs.Screen
          name="health"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="heart-outline" size={24} color={theme.colors.textColor} />
            ),
          }}
        />
        <Tabs.Screen
          name="appointments"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="calendar-outline" size={24} color={theme.colors.textColor} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="settings-outline" size={24} color={theme.colors.textColor} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
