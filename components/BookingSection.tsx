import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import moment from 'moment';
import axios from 'axios';

import Colors from './Shared/Colors';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/(redux)/authSlice';
import { useToast } from 'react-native-paper-toast';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import { fetchSubaccountCode, bookAppointment, confirmAppointment } from '../utils/bookingUtils';

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
    if (!selectedTimeSlot) {
      toaster.show({ message: 'Please select a time slot.', type: 'error' });
      return;
    }

    const selectedDateTime = moment(`${moment().format('YYYY-MM-DD')} ${selectedTimeSlot?.time.split(' - ')[0]}`, 'YYYY-MM-DD HH:mm');
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
        new Date(),
        selectedTimeSlot,
        selectedInsurance,
        subaccountCode,
        userEmail,
        consultationFee,
        withInsurance
      );

      setAppointmentId(newAppointmentId);
      console.log('State after setting appointmentId:', { appointmentId: newAppointmentId });

      if (withInsurance) {
        toaster.show({ message: 'Appointment booked successfully with insurance.', type: 'success' });
        setIsSubmitting(false);
        return;
      }

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

    try {
      const currentAppointmentId = appointmentIdRef.current;
      console.log('State before confirming appointment:', { appointmentId: currentAppointmentId });

      if (!currentAppointmentId) {
        throw new Error('No appointment ID available for status update.');
      }
      console.log('Confirming appointment with ID:', currentAppointmentId);

      await confirmAppointment(currentAppointmentId);

      fetchSchedule(doctorId);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toaster.show({ message: 'Failed to update appointment status.', type: 'error' });
    }
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

      {!isInsuranceAccepted ? (
        <Paystack
          paystackKey="pk_test_81ffccf3c88b1a2586f456c73718cfd715ff02b0"
          billingEmail={userEmail}
          amount={consultationFee}
          currency='KES'
          onCancel={handlePaymentCancel}
          onSuccess={handlePaymentSuccess}
          ref={paystackWebViewRef}
        />
      ) : null}
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

