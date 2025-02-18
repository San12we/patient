import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/(redux)/authSlice';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import { fetchSubaccountCode, bookAppointment } from '../utils/bookingUtils';
import { useNotification } from '../context/NotificationsContext';
import { sendPushNotification } from '../utils/sendPushNotification';
import Colors from './Shared/Colors';

const BookingSection: React.FC<{
  doctorId: string;
  consultationFee: number;
  selectedTimeSlot?: { id: string; time: string; date: string } | null;
}> = ({ doctorId, consultationFee, selectedTimeSlot }) => {
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const paystackWebViewRef = useRef<paystackProps.PayStackRef>(null);
  const appointmentIdRef = useRef<string | null>(null); // Add a ref for appointment ID

  const user = useSelector(selectUser);
  const userId = user.user?._id;
  const userEmail = user.user?.email;
  const patientName = user.user?.username || user.name;

  const handleBookPress = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    Toast.show({
      type: 'info',
      text1: 'Booking Appointment',
      text2: 'Booking appointment...',
    });

    try {
      if (!selectedTimeSlot) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please select a time slot.',
        });
        return;
      }

      const selectedDateTime = moment(`${selectedTimeSlot.date} ${selectedTimeSlot.time.split(' - ')[0]}`, 'YYYY-MM-DD HH:mm');
      if (selectedDateTime.isBefore(moment())) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Cannot book an appointment in the past.',
        });
        return;
      }

      const subaccountCode = await fetchSubaccountCode(doctorId);
      if (!subaccountCode) {
        throw new Error('Missing subaccount code.');
      }

      const newAppointmentId = await bookAppointment(
        doctorId,
        userId,
        patientName,
        selectedDateTime.toDate(),
        selectedTimeSlot.id,
        null, // No insurance
        subaccountCode,
        userEmail,
        consultationFee,
        false, // withInsurance is false
        selectedTimeSlot.time
      );

      // Update both state and ref
      appointmentIdRef.current = newAppointmentId;
      
      if (paystackWebViewRef.current) {
        paystackWebViewRef.current.startTransaction();
      }
    } catch (error) {
      console.error('Failed to book appointment:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to book appointment. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (response: any) => {
    try {
      const currentAppointmentId = appointmentIdRef.current;

      if (!currentAppointmentId) {
        throw new Error('Missing required data for notification.');
      }

      const appointmentData = {
        appointment: {
          doctorId,
          userId,
          patientId: userId, // Assuming patientId is the same as userId
          status: 'confirmed',
          timeSlotId: selectedTimeSlot?.id,
          time: selectedTimeSlot?.time,
          date: selectedTimeSlot?.date,
          _id: currentAppointmentId,
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

      showNotification({
        title: 'Appointment Confirmed',
        message: `Appointment scheduled for ${selectedTimeSlot?.time}`,
        type: 'success',
      });

      await sendPushNotification(
        'Appointment Confirmed',
        `Your appointment scheduled for ${selectedTimeSlot?.time} has been confirmed.`,
        appointmentData
      );

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Appointment confirmed! You will receive a notification shortly.',
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Appointment booked, but failed to send confirmation notification.',
      });
    }
  };

  const handlePaymentCancel = () => {
    Toast.show({
      type: 'error',
      text1: 'Payment Cancelled',
      text2: 'Payment was canceled.',
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleBookPress}
        disabled={isSubmitting}
      >
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>

      <Paystack
        paystackKey="pk_test_81ffccf3c88b1a2586f456c73718cfd715ff02b0"
        billingEmail={userEmail}
        amount={consultationFee}
        currency="KES"
        onCancel={handlePaymentCancel}
        onSuccess={handlePaymentSuccess}
        ref={paystackWebViewRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 30,
    backgroundColor: Colors.goofy,
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

export default BookingSection;