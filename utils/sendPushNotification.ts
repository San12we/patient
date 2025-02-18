import axios from 'axios';

export const sendPushNotification = async (expoPushToken: string, title: string, message: string, data: any = {}) => {
  try {
    if (!expoPushToken) {
      throw new Error('Expo Push Token not found');
    }

    const messagePayload = {
      token: expoPushToken,
      title,
      body: message,
    };

    await axios.post('https://project03-rj91.onrender.com/send-notification', messagePayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};
