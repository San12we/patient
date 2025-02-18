import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const sendPushNotification = async (title: string, message: string, data: any = {}) => {
  try {
    const expoPushToken = await AsyncStorage.getItem('expoPushToken');
    if (!expoPushToken) {
      throw new Error('Expo Push Token not found');
    }

    const messagePayload = {
      to: expoPushToken,
      sound: 'default',
      title,
      body: message,
      data,
    };

    await axios.post('https://exp.host/--/api/v2/push/send', messagePayload);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};
