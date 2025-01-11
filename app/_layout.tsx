import { Stack } from "expo-router";
import queryClient from "./(services)/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import store from "./(redux)/store";
import { Provider as ReduxProvider } from "react-redux";
import AppWrapper from "./(redux)/AppWrapper";
import { Provider as PaperProvider } from 'react-native-paper';
import { ToastProvider } from 'react-native-paper-toast'; // Import ToastProvider

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <ToastProvider>
            <AppWrapper />
          </ToastProvider>
        </PaperProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
