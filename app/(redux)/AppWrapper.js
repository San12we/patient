import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Stack } from "expo-router";
import { loadUser } from "./authSlice";
import { StatusBar } from 'react-native'; // Import StatusBar
import { theme } from '@/constants/theme'; // Import theme
import Colors from "@/components/Shared/Colors";

function AppWrapper() {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Error loading user:", error);
      // Handle the error appropriately, e.g., show a notification or redirect to login
    }
  }, [error]);

  return (
    <>
      <StatusBar backgroundColor={Colors.goofy} barStyle="light-content" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{ title: "Home", headerShown: false }}
        />
        <Stack.Screen 
          name="auth/register" 
          options={{ title: "Register", headerShown: false }} 
        />
        <Stack.Screen 
          name="auth/login" 
          options={{ title: "Login", headerShown: false }} 
        />
        <Stack.Screen 
          name="(routes)/onboarding/index" 
          options={{ 
            title: "Welcome", 
            headerShown: false,
            headerStyle: { backgroundColor: '#f4511e' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }} 
        />
        <Stack.Screen 
          name="(routes)/EditProfile" 
          options={{ title: "Edit Profile", headerShown: false }} 
        />
        <Stack.Screen 
          name="(routes)/insurance/[insuranceId]" 
          options={{ 
            title: "Insurance Details", 
            headerShown: false,
            headerStyle: { backgroundColor: '#f4511e' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }} 
        />
        <Stack.Screen 
          name="(routes)/[slug]" 
          options={{ title: "Post Details", headerShown: false }} 
        />
        <Stack.Screen 
          name="(routes)/consultation"
          options={{ title: "", headerShown: false }} 
        />
        <Stack.Screen 
          name="(routes)/diagnosis"
          options={{ title: "Diagnosis", headerShown: false }} 
        />
        <Stack.Screen 
          name="(routes)/labs"
          options={{ title: "Labs", headerShown: false }} 
        />
        <Stack.Screen 
          name="(routes)/monitor"
          options={{ title: "Monitor", headerShown: false }} 
        />
      </Stack>
    </>
  );
}

export default AppWrapper;
