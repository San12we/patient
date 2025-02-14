import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    ReactNode,
  } from "react";
  import * as Notifications from "expo-notifications";
  import { Subscription } from "expo-modules-core";
  import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
  
  interface NotificationContextType {
    expoPushToken: string | null;
    notification: Notifications.Notification | null;
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
    children: ReactNode;
  }
  
  export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
  }) => {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] =
      useState<Notifications.Notification | null>(null);
    const [error, setError] = useState<Error | null>(null);
  
    const notificationListener = useRef<Subscription>();
    const responseListener = useRef<Subscription>();
  
    useEffect(() => {
      registerForPushNotificationsAsync().then(
        (token) => setExpoPushToken(token),
        (error) => setError(error)
      );
  
      // Configure foreground notification behavior
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("🔔 Notification Received in Foreground: ", notification);
          setNotification(notification);
          
          // Optionally trigger the notification display even in foreground
          Notifications.presentNotificationAsync({
            title: notification.request.content.title,
            body: notification.request.content.body,
            data: notification.request.content.data,
            sound: true,
          });
        });
  
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          const data = response.notification.request.content.data;
          console.log("🔔 Notification Tapped: ", data);
          // Handle notification tap here
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
        value={{ expoPushToken, notification, error }}
      >
        {children}
      </NotificationContext.Provider>
    );
  };
