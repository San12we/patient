import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const sendPushNotification = async (title: string, message: string, data: any = {}) => {
  try {
    const expoPushToken = await AsyncStorage.getItem('expoPushToken');
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
