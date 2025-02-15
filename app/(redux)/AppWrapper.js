import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Stack } from "expo-router";
import { loadUser } from "./authSlice";
import { StatusBar } from "react-native"; // Import StatusBar
import { theme } from "@/constants/theme"; // Import theme
import Colors from "@/components/Shared/Colors";
import Toast from "react-native-toast-message"; // Import Toast
import { useNotification } from "../../context/NotificationsContext"; // Import useNotification

function AppWrapper() {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);
  const { notification } = useNotification(); // Get notification from context

  // Load user on mount
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("Error loading user:", error);
      // Show error toast
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "An error occurred while loading user data.",
      });
    }
  }, [error]);

  // Handle notifications
  useEffect(() => {
    if (notification) {
      // Show notification toast
      Toast.show({
        type: "success", // You can use 'success', 'error', 'info', etc.
        text1: notification.request.content.title || "Notification",
        text2: notification.request.content.body || "",
        visibilityTime: 3000, // Auto-dismiss after 3 seconds
      });
    }
  }, [notification]);

  return (
    <>
      <StatusBar backgroundColor={Colors.goody} barStyle="light-content" />
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
            headerStyle: { backgroundColor: "#f4511e" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
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
            headerStyle: { backgroundColor: "#f4511e" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
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

      {/* Render Toast component at the root level */}
      <Toast />
    </>
  );
}

export default AppWrapper;