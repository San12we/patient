import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import io from 'socket.io-client';

import Colors from './Shared/Colors';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/(redux)/authSlice';
import { useToast } from 'react-native-paper-toast';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import { fetchSubaccountCode, bookAppointment } from '../utils/bookingUtils';
import socket from '../Services/socket';

const BookingSection: React.FC<{ doctorId: string; consultationFee: number; selectedInsurance?: string; selectedTimeSlot?: { id: string; time: string } | null }> = ({
  doctorId,
  consultationFee,
  selectedInsurance,
  selectedTimeSlot,
}) => {
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const paystackWebViewRef = useRef<paystackProps.PayStackRef>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [userInsurance, setUserInsurance] = useState<string | null>(null);
  const [isInsuranceAccepted, setIsInsuranceAccepted] = useState<boolean>(false);
  const [acceptedInsurances, setAcceptedInsurances] = useState<string[]>(['Tausi Assurance Company Limited', 'Other Insurance Company']);

  const user = useSelector(selectUser);
  const userId = user.user?._id;
  const userEmail = user.user?.email;
  const patientName = user.user?.username || user.name;
  const toaster = useToast();

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

  useEffect(() => {
    const fetchUserInsurance = async () => {
      try {
        const response = await axios.get(`https://project03-rj91.onrender.com/insurance/user/${userId}`);
        if (response.status === 200) {
          const data = response.data;
          setUserInsurance(data.insuranceProvider);
          setIsInsuranceAccepted(acceptedInsurances.includes(data.insuranceProvider));
        }
      } catch (error) {
        console.error('Error fetching user insurance data:', error);
      }
    };

    fetchUserInsurance();
  }, [userId, selectedInsurance]);

  const handleBookPress = async (withInsurance: boolean) => {
    console.log(withInsurance ? 'Proceed with Insurance button pressed' : 'Proceed to Payment button pressed');

    if (isInsuranceAccepted) {
      // If insurance is accepted, proceed without selecting a time slot
      setIsSubmitting(true);
      toaster.show({ message: 'Booking appointment with insurance...', type: 'success' });

      try {
        const newAppointmentId = await bookAppointment(
          doctorId,
          userId,
          patientName,
          new Date(),
          selectedTimeSlot?.id ?? null, // Ensure timeSlotId is either a string or null
          selectedInsurance,
          null,
          userEmail,
          consultationFee,
          withInsurance,
          selectedTimeSlot?.time, // Include the time in the payload
          true // Pass true for skipPayment to skip the payment process
        );

        setAppointmentId(newAppointmentId);
        toaster.show({ message: 'Appointment booked successfully with insurance.', type: 'success' });
        setIsSubmitting(false);
        return;
      } catch (error) {
        console.error('Failed to book appointment:', error);
        toaster.show({ message: 'Failed to book appointment. Please try again.', type: 'error' });
        setIsSubmitting(false);
        return;
      }
    }

    if (!selectedTimeSlot) {
      toaster.show({ message: 'Please select a time slot.', type: 'error' });
      return;
    }

    const selectedDateTime = moment(`${selectedTimeSlot.date} ${selectedTimeSlot.time.split(' - ')[0]}`, 'YYYY-MM-DD HH:mm');
    if (selectedTimeSlot && selectedDateTime.isBefore(moment())) {
      toaster.show({ message: 'Cannot book an appointment in the past.', type: 'error' });
      return;
    }

    if (isSubmitting) {
      return;
    }

    console.log('Selected Time Slot:', selectedTimeSlot);
    console.log('User Email:', userEmail);
    console.log('Patient Name:', patientName);

    setIsSubmitting(true);
    toaster.show({ message: '', type: 'success' });

    try {
      const subaccountCode = await fetchSubaccountCode(doctorId); // Changed userId to doctorId
      if (!subaccountCode && !withInsurance) {
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
        withInsurance,
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
      toaster.show({ message: 'Failed to book appointment. Please try again.', type: 'error' });
      setIsSubmitting(false);
    }
  };

  const appointmentIdRef = useRef<string | null>(null);

  useEffect(() => {
    appointmentIdRef.current = appointmentId;
  }, [appointmentId]);

  const handlePaymentSuccess = async (response: any) => {
    setIsSubmitting(false);
    toaster.show({ message: 'Payment successful and appointment confirmed!', type: 'success' });
    console.log('Payment successful:', response);

    const currentAppointmentId = appointmentIdRef.current;
    console.log('State before confirming appointment:', { appointmentId: currentAppointmentId });

    if (!currentAppointmentId) {
      console.error('No appointment ID available for status update.');
      return;
    }
    console.log('Appointment confirmed successfully with ID:', currentAppointmentId);

    fetchSchedule(doctorId);
  };

  const handlePaymentCancel = () => {
    setIsSubmitting(false);
    toaster.show({ message: 'Payment was canceled.', type: 'error' });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bookButton} onPress={() => handleBookPress(isInsuranceAccepted)} disabled={isSubmitting}>
        <Text style={styles.bookButtonText}>
          {isInsuranceAccepted ? 'Proceed with Insurance' : 'Book Appointment'}
        </Text>
      </TouchableOpacity>

      {!isInsuranceAccepted && (
        <Paystack
          paystackKey="pk_test_81ffccf3c88b1a2586f456c73718cfd715ff02b0"
          billingEmail={userEmail}
          amount={consultationFee}
          currency='KES'
          onCancel={handlePaymentCancel}
          onSuccess={handlePaymentSuccess}
          ref={paystackWebViewRef}
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

export default BookingSection;

