import { Stack } from "expo-router";
import queryClient from "./(services)/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import store from "./(redux)/store";
import { Provider as ReduxProvider } from "react-redux";
import AppWrapper from "./(redux)/AppWrapper";
import { Provider as PaperProvider } from 'react-native-paper';
import { ToastProvider } from 'react-native-paper-toast'; // Import ToastProvider
import { NotificationProvider } from '../context/NotificationsContext';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,     // This makes the notification appear as an alert when app is open
    shouldPlaySound: true,     // Enable sound
    shouldSetBadge: true,      // Enable badge counting
    priority: Notifications.AndroidNotificationPriority.HIGH, // High priority for Android
  }),
});

export default function RootLayout() {
  return (
    <NotificationProvider>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <PaperProvider>
            <ToastProvider>
              {/* AppWrapper contains the main navigation and app logic */}
              <AppWrapper />
            </ToastProvider>
          </PaperProvider>
        </QueryClientProvider>
      </ReduxProvider>
    </NotificationProvider>
  );
}