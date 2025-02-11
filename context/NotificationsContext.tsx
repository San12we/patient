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

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notifications.Notification | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    const storeTokenLocally = async (token: string) => {
        try {
            await AsyncStorage.setItem('expoPushToken', token);
        } catch (error) {
            console.error('Error storing push token locally:', error);
            setError(error);
        }
    };

    const retrieveTokenLocally = async () => {
        try {
            const token = await AsyncStorage.getItem('expoPushToken');
            if (token) {
                setExpoPushToken(token);
            }
        } catch (error) {
            console.error('Error retrieving push token from local storage:', error);
            setError(error);
        }
    };

    useEffect(() => {
        retrieveTokenLocally();

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            console.log("🔔 Notification Received: ", notification);
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("🔔 Notification Response: ", JSON.stringify(response, null, 2));
            // Handle the notification response here
        });

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ expoPushToken, notification, error }}>
            {children}
        </NotificationContext.Provider>
    );
};


