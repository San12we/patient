import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import NotificationBanner from "@/components/NotificationBanner";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-modules-core";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import { addNotification } from '@/app/(redux)/notificationSlice';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';

interface NotificationData {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  data?: any;
}

interface NotificationContextType {
  showNotification: (data: NotificationData) => void;
  hideNotification: () => void;
  currentNotification: NotificationData | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  // Debounced notification dispatcher
  const debouncedDispatch = useCallback(
    debounce((notificationData: NotificationData) => {
      dispatch(addNotification({
        id: Date.now().toString(),
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type === 'success' ? 'appointment' : 'general',
        read: false,
        createdAt: new Date().toISOString(),
        data: notificationData.data
      }));
    }, 300),
    [dispatch]
  );

  const showNotification = useCallback((data: NotificationData) => {
    setCurrentNotification(data);
    debouncedDispatch(data);
  }, [debouncedDispatch]);

  const hideNotification = useCallback(() => {
    setCurrentNotification(null);
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(() => {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
        });

        notificationListener.current = Notifications.addNotificationReceivedListener(
          (notification) => {
            const { title, body, data } = notification.request.content;
            showNotification({
              title: title ?? "New Notification",
              message: body ?? "",
              type: 'info',
              data
            });
          }
        );

        responseListener.current = Notifications.addNotificationResponseReceivedListener(
          (response) => {
            console.log("Notification tapped:", response.notification.request.content.data);
          }
        );
      })
      .catch(console.error);

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [showNotification]);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification, currentNotification }}>
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