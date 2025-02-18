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
import { useNotification } from '../context/NotificationsContext';
import { sendPushNotification } from '../utils/sendPushNotification';

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
  const { expoPushToken } = useNotification();

  useEffect(() => {
    socket.on('slotUpdated', (data) => {
      console.log('Slot updated:', data);
    });

    return () => {
      socket.off('slotUpdated');
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ visible: true, message, type });
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
        null,
        userEmail,
        consultationFee,
        true,
        selectedTimeSlot.time
      );

      setAppointmentId(newAppointmentId);
      showToast('Appointment booked successfully with insurance.', 'success');

      const appointmentData = {
        appointment: {
          doctorId,
          userId,
          patientId: userId, // Assuming patientId is the same as userId
          status: 'confirmed',
          timeSlotId: selectedTimeSlot.id,
          time: selectedTimeSlot.time,
          date: selectedTimeSlot.date,
          _id: newAppointmentId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __v: 0,
        },
        patient: {
          _id: userId,
          gender: user.user?.gender || 'unknown',
          medicalHistory: user.user?.medicalHistory || [],
          userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __v: 0,
        },
      };

      await sendPushNotification(
        'Upcoming Appointment',
        `Your appointment with Dr. ${doctorId} is scheduled for ${moment(selectedTimeSlot.date).format('MMMM Do YYYY')} at ${selectedTimeSlot.time}.`,
        appointmentData
      );

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
    backgroundColor: '#f6e2f8',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bookButton: {
    backgroundColor: '#ffebbb',
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