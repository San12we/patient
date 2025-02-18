import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const sendPushNotification = async (title: string, message: string, data: any = {}) => {
  try {
    const expoPushToken = await AsyncStorage.getItem('expoPushToken');
    
    if (!expoPushToken) {
      throw new Error('Expo Push Token not found');
    }

    if (!title || !message) {
      throw new Error('Title and message are required for push notification');
    }

    const messagePayload = {
      token: expoPushToken, // Ensure this is correctly set
      title,
      body: message,
      data,
    };

    // Log the token to ensure it is valid
    console.log('Expo Push Token:', expoPushToken);

    console.log('Sending push notification with payload:', messagePayload);

    await axios.post('https://project03-rj91.onrender.com/send-notification', messagePayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};
