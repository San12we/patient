import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export const useNotificationToken = () => {
  const { expoPushToken } = useContext(NotificationContext);
  return expoPushToken;
};
