import axios from 'axios';
import { useNotification } from '@/context/NotificationsContext'; // Adjust the import path as necessary

export const sendPushNotification = async (title: string, message: string, data: any = {}) => {
  try {
    const { expoPushToken } = useNotification();
    if (!expoPushToken) {
      throw new Error('Expo Push Token not found');
    }

    const messagePayload = {
      token: expoPushToken,
      title,
      body: message,
    };

    await axios.post('https://project03-rj91.onrender.com/send-notification', messagePayload);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};
