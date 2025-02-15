import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Stack } from "expo-router";
import { loadUser } from "./authSlice";
import { StatusBar } from "react-native";
import Colors from "@/components/Shared/Colors";
import { useNotification } from "../../context/NotificationsContext";
import CustomToast from "@/components/CustomToast";

function AppWrapper() {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);
  const { notification } = useNotification();
  const [lastToastId, setLastToastId] = useState(null);
  const [toast, setToast] = useState(null);

  // Load user on mount
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("Error loading user:", error);
      setToast({
        message: error.message || "An error occurred while loading user data.",
        type: "error"
      });
    }
  }, [error]);

  // Handle notifications
  useEffect(() => {
    if (notification) {
      const toastId = `${notification.request.identifier}-${Date.now()}`;
      
      if (toastId !== lastToastId) {
        setLastToastId(toastId);
        setToast({
          message: notification.request.content.body || "",
          type: "success"
        });
      }
    }
  }, [notification, lastToastId]);

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

      {/* Custom Toast */}
      {toast && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast(null)}
        />
      )}
    </>
  );
}

export default AppWrapper;