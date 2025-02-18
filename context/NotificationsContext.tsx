import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import NotificationBanner from "@/components/NotificationBanner"; // Adjust the import path as necessary

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

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);
  const [lastNotificationId, setLastNotificationId] = useState<string>("");

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const showNotification = (data: NotificationData) => {
    const notificationId = `${data.title}-${data.message}-${Date.now()}`;
    if (notificationId !== lastNotificationId) {
      setLastNotificationId(notificationId);
      setCurrentNotification(data);
    }
  };

  const hideNotification = () => {
    setCurrentNotification(null);
  };

  const handleRegistrationError = (errorMessage: string) => {
    alert(errorMessage);
    throw new Error(errorMessage);
  };

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        handleRegistrationError('Permission not granted to get push token for push notification!');
        return;
      }
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError('Project ID not found');
      }
      try {
        const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log(pushTokenString);
        return pushTokenString;
      } catch (e: unknown) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError('Must use physical device for push notifications');
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
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
        currentNotification,
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