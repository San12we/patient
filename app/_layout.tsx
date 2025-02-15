import { Stack } from "expo-router";
import queryClient from "./(services)/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import store from "./(redux)/store";
import { Provider as ReduxProvider } from "react-redux";
import AppWrapper from "./(redux)/AppWrapper";
import { Provider as PaperProvider } from 'react-native-paper';
import { NotificationProvider } from '../context/NotificationsContext';

export default function RootLayout() {
  return (
    <NotificationProvider>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <PaperProvider>
            <AppWrapper />
          </PaperProvider>
        </QueryClientProvider>
      </ReduxProvider>
    </NotificationProvider>
  );
}