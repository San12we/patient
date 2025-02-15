import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import NotificationBanner from "@/components/NotificationBanner"; // Adjust the import path as necessary
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-modules-core";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";

interface NotificationData {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  data?: any;
}

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  showNotification: (data: NotificationData) => void;
  hideNotification: () => void;
  currentNotification: NotificationData | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);

  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  const showNotification = (data: NotificationData) => {
    setCurrentNotification(data);
  };

  const hideNotification = () => {
    setCurrentNotification(null);
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => setExpoPushToken(token),
      (error) => setError(error)
    );

    // Configure foreground notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true, // Show alert in the foreground
        shouldPlaySound: true, // Play sound
        shouldSetBadge: true, // Set badge count
      }),
    });

    // Listen for notifications received in the foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("🔔 Notification Received in Foreground: ", notification);
        setNotification(notification);
        
        // Convert push notification to in-app notification
        showNotification({
          title: notification.request.content.title ?? "No Title",
          message: notification.request.content.body ?? "No Message",
          type: 'info',
          data: notification.request.content.data
        });
      });

    // Listen for notification responses (user taps on notification)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("🔔 Notification Tapped: ", data);
        // Handle notification tap here (e.g., navigate to a specific screen)
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ 
        expoPushToken, 
        notification, 
        error,
        showNotification,
        hideNotification,
        currentNotification
      }}
    >
      {children}
      {currentNotification && (
        <NotificationBanner
          title={currentNotification.title}
          message={currentNotification.message}
          type={currentNotification.type}
          onHide={hideNotification}
        />
      )}
    </NotificationContext.Provider>
  );
};