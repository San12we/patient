import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import socket from '../Services/socket';
import Colors from './Shared/Colors';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/(redux)/authSlice';
import { bookAppointment } from '../utils/bookingUtils';
import CustomToast from './CustomToast';
import { useNotification } from '../context/NotificationsContext'; // Import useNotification

const UserBookingSection: React.FC<{
  doctorId: string;
  consultationFee: number;
  selectedInsurance?: string;
  selectedTimeSlot?: { id: string; time: string; date: string } | null;
}> = ({ doctorId, consultationFee, selectedInsurance, selectedTimeSlot }) => {
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'info',
  });

  const user = useSelector(selectUser);
  const userId = user.user?._id;
  const userEmail = user.user?.email;
  const patientName = user.user?.username || user.name;
  const { expoPushToken } = useNotification(); // Get the Expo push token

  useEffect(() => {
    socket.on('slotUpdated', (data) => {
      console.log('Slot updated:', data);
      // Update the state of the slots here based on the received data
    });

    return () => {
      socket.off('slotUpdated');
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ visible: true, message, type });
  };

  const sendNotification = async () => {
    try {
      console.log('expoPushToken:', expoPushToken);
      console.log('userId:', userId);
      console.log('appointmentId:', appointmentId);

      if (!expoPushToken || !userId || !appointmentId) {
        throw new Error('Missing required data for notification.');
      }

      const notificationData = {
        token: expoPushToken,
        title: 'Appointment Confirmed',
        body: `Appointment scheduled for ${selectedTimeSlot?.time}`,
        userId: userId,
      };

      await axios.post('https://project03-rj91.onrender.com/send-notification', notificationData);
      console.log('Notification sent successfully');
      showToast('Appointment confirmed! You will receive a notification shortly.', 'success');
    } catch (error) {
      console.error('Error sending notification:', error);
      showToast('Appointment booked, but failed to send confirmation notification.', 'error');
    }
  };

  const handleBookWithInsurance = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    showToast('Booking appointment with insurance...', 'info');

    try {
      if (!selectedTimeSlot) {
        showToast('Please select a time slot.', 'error');
        return;
      }

      const selectedDateTime = moment(`${selectedTimeSlot.date} ${selectedTimeSlot.time.split(' - ')[0]}`, 'YYYY-MM-DD HH:mm');
      if (selectedDateTime.isBefore(moment())) {
        showToast('Cannot book an appointment in the past.', 'error');
        return;
      }

      const newAppointmentId = await bookAppointment(
        doctorId,
        userId,
        patientName,
        selectedDateTime.toDate(),
        selectedTimeSlot.id,
        selectedInsurance,
        null, // No subaccount code for insurance bookings
        userEmail,
        consultationFee,
        true, // withInsurance is true
        selectedTimeSlot.time
      );

      setAppointmentId(newAppointmentId);
      showToast('Appointment booked successfully with insurance.', 'success');

      // Send notification after successful booking
      await sendNotification();
    } catch (error) {
      console.error('Failed to book appointment:', error);
      showToast('Failed to book appointment. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleBookWithInsurance}
        disabled={isSubmitting}
      >
        <Text style={styles.bookButtonText}>Proceed with Insurance</Text>
      </TouchableOpacity>

      {toast.visible && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast({ ...toast, visible: false })}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 30,
    backgroundColor: '#bae8e8',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bookButton: {
    backgroundColor: Colors.SECONDARY,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  bookButtonText: {
    color: Colors.primary,
    fontSize: 18,
  },
});

export default UserBookingSection;