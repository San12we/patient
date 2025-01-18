import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    const sendTokenToBackend = async (token: string) => {
        try {
            const response = await fetch('https://medplus-health.onrender.com/api/push-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            if (!response.ok) {
                throw new Error('Failed to send push token to backend');
            }

            console.log('Push token sent to backend successfully');
        } catch (error) {
            console.error('Error sending push token to backend:', error);
        }
    };

    const storeTokenLocally = async (token: string) => {
        try {
            await AsyncStorage.setItem('expoPushToken', token);
        } catch (error) {
            console.error('Error storing push token locally:', error);
        }
    };

    useEffect(() => {
        registerForPushNotificationsAsync().then(
            (token) => {
                setExpoPushToken(token);
                storeTokenLocally(token); // Store the token locally
            },
            (error) => setError(error)
        );

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                console.log("🔔 Notification Received: ", notification);
                setNotification(notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log(
                    "🔔 Notification Response: ",
                    JSON.stringify(response, null, 2),
                    JSON.stringify(response.notification.request.content.data, null, 2)
                );
                // Handle the notification response here
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