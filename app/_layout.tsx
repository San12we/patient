import { Stack } from "expo-router";
import queryClient from "./(services)/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import store from "./(redux)/store";
import { Provider as ReduxProvider } from "react-redux";
import AppWrapper from "./(redux)/AppWrapper";
import { Provider as PaperProvider } from 'react-native-paper';
import { ToastProvider } from 'react-native-paper-toast'; // Import ToastProvider
import {NotificationProvider} from '../context/NotificationsContext'
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert:true,
    shouldPlaySound:false,
    shouldSetBadge:false
  })
})
export default function RootLayout() {
  return (
    <NotificationProvider>
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <ToastProvider>
            <AppWrapper />
          </ToastProvider>
        </PaperProvider>
      </QueryClientProvider>
    </ReduxProvider>
    </NotificationProvider>
  );
}
