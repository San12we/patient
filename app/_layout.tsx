import { Stack } from "expo-router";
import queryClient from "./(services)/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import store from "./(redux)/store";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as PaperProvider } from 'react-native-paper';
import { NotificationProvider } from '../context/NotificationsContext';
import AppWrapper from './(redux)/AppWrapper';

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <NotificationProvider>
            <AppWrapper />
          </NotificationProvider>
        </PaperProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}