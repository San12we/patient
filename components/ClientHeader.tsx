import React, { useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction, selectUser } from '../app/(redux)/authSlice';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Badge } from 'react-native-elements';
import { theme } from '@/constants/theme'; // Import theme
import Colors from './Shared/Colors';
import socket from '../Services/socket'; // Import socket instance
import { addNotification } from '@/app/(redux)/notificationSlice';

const ClientHeader: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const profileImage = user?.user?.profileImage; // Add optional chaining
  const name = user ? `${user?.user?.firstName} ${user?.user?.lastName}` : ''; // Add optional chaining and fallback
  const lastNotificationRef = useRef<string>('');

  const handleNewAppointment = useCallback((data: any) => {
    const notificationId = `appointment-${data.appointmentId}-${Date.now()}`;
    
    // Prevent duplicate notifications
    if (lastNotificationRef.current !== notificationId) {
      lastNotificationRef.current = notificationId;
      dispatch(addNotification({
        id: notificationId,
        title: 'New Appointment',
        message: `New appointment scheduled for ${data.date}`,
        type: 'appointment',
        read: false,
        createdAt: new Date().toISOString(),
        appointmentId: data.appointmentId,
        data: data
      }));
    }
  }, [dispatch]);

  const handleSlotUpdate = useCallback((data: any) => {
    const notificationId = `slot-${data.appointmentId}-${Date.now()}`;
    
    // Prevent duplicate notifications
    if (lastNotificationRef.current !== notificationId) {
      lastNotificationRef.current = notificationId;
      dispatch(addNotification({
        id: notificationId,
        title: 'Appointment Update',
        message: `Your appointment time has been updated to ${data.newTime}`,
        type: 'slot',
        read: false,
        createdAt: new Date().toISOString(),
        appointmentId: data.appointmentId,
        data: data
      }));
    }
  }, [dispatch]);

  useEffect(() => {
    // Set up socket listeners
    socket.on('newAppointment', handleNewAppointment);
    socket.on('slotUpdated', handleSlotUpdate);

    // Cleanup socket listeners
    return () => {
      socket.off('newAppointment', handleNewAppointment);
      socket.off('slotUpdated', handleSlotUpdate);
    };
  }, [handleNewAppointment, handleSlotUpdate]);

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  return (
    <View style={[styles.container, { backgroundColor: '#e3f6f5'}]}>
      <View style={styles.leftSection}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImageFallback}>
            <Text style={styles.profileInitial}>{name?.[0]}</Text>
          </View>
        )}
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={handleNotificationPress}
        >
          <AntDesign name="bells" size={24} color="black" />
          {unreadCount > 0 && (
            <Badge
              value={unreadCount}
              status="error"
              containerStyle={styles.badgeContainer}
            />
          )}
        </TouchableOpacity>
       
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    paddingTop: 20, // Increased padding to create space from the status bar
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    display: 'none', // Hide the title
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileImageFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginLeft: 10,
  },
});

export default ClientHeader;
