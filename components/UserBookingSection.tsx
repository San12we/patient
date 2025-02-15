import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import socket from '../Services/socket';
import Colors from './Shared/Colors';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/(redux)/authSlice';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import { fetchSubaccountCode, bookAppointment, confirmAppointment } from '../utils/bookingUtils';
import CustomToast from './CustomToast';

const UserBookingSection: React.FC<{ doctorId: string; consultationFee: number; selectedInsurance?: string; selectedTimeSlot?: { id: string; time: string; date: string } | null }> = ({
  doctorId,
  consultationFee,
  selectedInsurance,
  selectedTimeSlot,
}) => {
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const paystackWebViewRef = useRef<paystackProps.PayStackRef>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'info'
  });

  const user = useSelector(selectUser);
  const userId = user.user?._id;
  const userEmail = user.user?.email;
  const patientName = user.user?.username || user.name;

  useEffect(() => {
    socket.on('slotUpdated', (data) => {
      console.log('Slot updated:', data);
      // Update the state of the slots here based on the received data
      // For example, you can fetch the updated schedule or update the specific slot in the state
    }); 

    return () => {
      socket.off('slotUpdated');
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ visible: true, message, type });
  };

  const handleBookWithInsurance = async () => {
    console.log('Proceed with Insurance button pressed');

    setIsSubmitting(true);
    showToast('Booking appointment with insurance...', 'info');

    try {
      const selectedDateTime = moment(`${selectedTimeSlot?.date} ${selectedTimeSlot?.time.split(' - ')[0]}`, 'YYYY-MM-DD HH:mm');
      const newAppointmentId = await bookAppointment(
        doctorId,
        userId,
        patientName,
        selectedDateTime.toDate(), // Use the actual selected date
        selectedTimeSlot?.id ?? null, // Ensure timeSlotId is either a string or null
        selectedInsurance,
        null,
        userEmail,
        consultationFee,
        true, // withInsurance is true
        selectedTimeSlot?.time // Include the time in the payload
      );

      setAppointmentId(newAppointmentId);
      showToast('Appointment booked successfully with insurance.', 'success');
      setIsSubmitting(false);
    } catch (error) {
      console.error('Failed to book appointment:', error);
      showToast('Failed to book appointment. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  const handleBookWithoutInsurance = async () => {
    console.log('Proceed to Payment button pressed');

    if (!selectedTimeSlot) {
      showToast('Please select a time slot.', 'error');
      return;
    }

    // Ensure the date and time are correctly formatted and combined
    const selectedDateTime = moment(`${selectedTimeSlot.date} ${selectedTimeSlot.time.split(' - ')[0]}`, 'YYYY-MM-DD HH:mm');
    if (selectedDateTime.isBefore(moment())) {
      showToast('Cannot book an appointment in the past.', 'error');
      return;
    }

    if (isSubmitting) {
      return;
    }

    console.log('Selected Time Slot:', selectedTimeSlot);
    console.log('User Email:', userEmail);
    console.log('Patient Name:', patientName);

    setIsSubmitting(true);
    showToast('', 'info');

    try {
      const subaccountCode = await fetchSubaccountCode(doctorId); // Changed userId to doctorId
      if (!subaccountCode) {
        throw new Error('Missing subaccount code.');
      }
      if (!userEmail) {
        throw new Error('Missing user email.');
      }
      if (!patientName) {
        throw new Error('Missing patient name.');
      }

      const newAppointmentId = await bookAppointment(
        doctorId,
        userId,
        patientName,
        selectedDateTime.toDate(), // Use the actual selected date
        selectedTimeSlot?.id ?? null, // Ensure timeSlotId is either a string or null
        selectedInsurance,
        subaccountCode,
        userEmail,
        consultationFee,
        false, // withInsurance is false
        selectedTimeSlot?.time // Include the time in the payload
      );

      setAppointmentId(newAppointmentId);
      console.log('State after setting appointmentId:', { appointmentId: newAppointmentId });

      if (paystackWebViewRef.current) {
        paystackWebViewRef.current.startTransaction();
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error('Failed to book appointment:', error);
      showToast('Failed to book appointment. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  const appointmentIdRef = useRef<string | null>(null);

  useEffect(() => {
    appointmentIdRef.current = appointmentId;
  }, [appointmentId]);

  const handlePaymentSuccess = async (response: any) => {
    setIsSubmitting(false);
    showToast('Payment successful and appointment confirmed!', 'success');
    console.log('Payment successful:', response);

    try {
      const currentAppointmentId = appointmentIdRef.current;
      console.log('State before confirming appointment:', { appointmentId: currentAppointmentId });

      if (!currentAppointmentId) {
        throw new Error('No appointment ID available for status update.');
      }
      console.log('Confirming appointment with ID:', currentAppointmentId);

      await confirmAppointment(currentAppointmentId); // Confirm the appointment

      // No need to fetch the schedule again, as it should be updated already
    } catch (error) {
      console.error('Error updating appointment status:', error);
      showToast('Failed to update appointment status.', 'error');
    }
  };

  const handlePaymentCancel = () => {
    setIsSubmitting(false);
    showToast('Payment was canceled.', 'error');
  };

  return (
    <View style={styles.container}>
      {selectedInsurance ? (
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookWithInsurance}
          disabled={isSubmitting}
        >
          <Text style={styles.bookButtonText}>
            Proceed with Insurance
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookWithoutInsurance}
          disabled={isSubmitting}
        >
          <Text style={styles.bookButtonText}>
            Proceed to Payment
          </Text>
        </TouchableOpacity>
      )}

      <Paystack
        paystackKey="pk_test_81ffccf3c88b1a2586f456c73718cfd715ff02b0"
        billingEmail={userEmail}
        amount={consultationFee}
        currency='KES'
        onCancel={handlePaymentCancel}
        onSuccess={handlePaymentSuccess}
        ref={paystackWebViewRef}
      />

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
