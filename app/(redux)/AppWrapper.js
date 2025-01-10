import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Stack } from "expo-router/stack";
import { loadUser } from "./authSlice";

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
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen 
        name="profile" 
        options={{ title: "Profile", headerShown: false }} 
      />
      <Stack.Screen 
        name="auth/login" 
        options={{ title: "Login", headerShown: false }} 
      />
      <Stack.Screen 
        name="(routes)/onboarding" 
        options={{ 
          title: "Welcome", 
          headerShown: false,
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
    </Stack>
  );
}

export default AppWrapper;
