import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, ActivityIndicator, Image } from 'react-native';
import moment from 'moment';

import Colors from './Shared/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../app/(redux)/authSlice';
import useSchedule from '../hooks/useSchedule';
import { useToast } from 'react-native-paper-toast';
import useInsurance from '../hooks/useInsurance';
import { theme } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import { fetchSubaccountCode, bookAppointment, confirmAppointment } from '../utils/bookingUtils';
import axios from 'axios';

const BookingSection: React.FC<{ doctorId: string; userId: string; consultationFee: number; insurances?: string[]; selectedInsurance?: string }> = ({
  doctorId,
  userId,
  consultationFee,
  insurances = [],
  selectedInsurance: initialSelectedInsurance = '',
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ id: string; time: string } | null>(null);
  
  
 
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const paystackWebViewRef = useRef<paystackProps.PayStackRef>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedInsurance, setSelectedInsurance] = useState<string>(initialSelectedInsurance);
  const [userInsurance, setUserInsurance] = useState<string | null>(null);

  const user = useSelector(selectUser);
  const userEmail = user.user?.email;
  const patientName = user.user?.username || user.name;
  const dispatch = useDispatch();
  const dateOptions = Array.from({ length: 7 }, (_, i) => moment().add(i, 'days').toDate());
  const { schedule, fetchSchedule, updateSlot, loading, error } = useSchedule(doctorId, userId);
  const toaster = useToast();
  const { insuranceProviders } = useInsurance();
  const [availableInsurances, setAvailableInsurances] = useState<any[]>([]);
  const userInsuranceName = userInsurance; 

  useEffect(() => {
    console.log('BookingSection mounted with userId:', userId);
    fetchSchedule();
  }, [doctorId, userId]);

  useEffect(() => {
    const loadUserInsurance = async () => {
      try {
        const storedData = await AsyncStorage.getItem('insuranceData');
        if (storedData) {
          const insuranceData = JSON.parse(storedData);
          setUserInsurance(insuranceData.insuranceProvider);
          console.log('User Insurance from AsyncStorage:', insuranceData);
        }
      } catch (error) {
        console.error('Error loading user insurance data from AsyncStorage:', error);
      }
    };

    loadUserInsurance();
  }, [userId]);

  useEffect(() => {
    console.log('User Insurance:', userInsurance);
  }, [userInsurance]);

  useEffect(() => {
    const mappedInsurances = insurances
      .map((providerId) => insuranceProviders.find((provider) => provider._id === providerId))
      .filter((provider) => provider);

    setAvailableInsurances(mappedInsurances);
    console.log('Mapped Insurances in BookingSection:', mappedInsurances);
    console.log('Accepted Insurances:', mappedInsurances.map((insurance) => insurance.name));
  }, [insurances, insuranceProviders]);

  useEffect(() => {
    console.log('User Insurance:', userInsuranceName);
    const isAccepted = availableInsurances.some((insurance) => insurance.name === userInsuranceName);
    console.log('Is User Insurance Accepted:', isAccepted);
    if (isAccepted) {
      console.log('User insurance is supported:', userInsuranceName);
      setSelectedInsurance(userInsuranceName); // Highlight the user's insurance provider
    }
    console.log('Accepted Insurances:', availableInsurances.map((insurance) => insurance.name));
  }, [userInsuranceName, availableInsurances]);

  const handleBookPress = async (withInsurance: boolean) => {
    console.log(withInsurance ? 'Proceed with Insurance button pressed' : 'Proceed to Payment button pressed');
    if (!selectedTimeSlot && !selectedInsurance) {
      toaster.show({ message: 'Please select a time slot or insurance.', type: 'error' });
      return;
    }

    const selectedDateTime = moment(`${moment(selectedDate).format('YYYY-MM-DD')} ${selectedTimeSlot?.time.split(' - ')[0]}`, 'YYYY-MM-DD HH:mm');
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
      const subaccountCode = await fetchSubaccountCode(userId);
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
        selectedDate,
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

      if (selectedTimeSlot) {
        updateSlot(selectedTimeSlot.id, { isBooked: true });
      }

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

  const resetForm = () => {
    setSelectedDate(new Date());
    setSelectedTimeSlot(null);
  };

  const getSlotsForSelectedDate = () => {
    const dayOfWeek = moment(selectedDate).format('dddd');
    return schedule[dayOfWeek] || [];
  };

  const slotsForSelectedDate = getSlotsForSelectedDate();

  console.log('Slots for selected date:', slotsForSelectedDate);
  console.log('Doctor ID:', doctorId);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      ) : error ? (
        <Text>Error loading schedule: {error}</Text>
      ) : (
        <>
          <Text style={styles.title}>Book an Appointment</Text>
          <FlatList
            horizontal
            data={dateOptions}
            keyExtractor={(item) => item.toISOString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedDate(item)}
                style={[
                  styles.dateButton,
                  selectedDate.toDateString() === item.toDateString() ? { backgroundColor: Colors.goofy } : null,
                ]}
              >
                <Text style={styles.dateText}>{moment(item).format('ddd, DD')}</Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
          <Text style={styles.dateTitle}>{moment(selectedDate).format('dddd, MMMM Do YYYY')}</Text>
          <FlatList
            horizontal
            data={slotsForSelectedDate}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              const slotTime = moment(`${moment(selectedDate).format('YYYY-MM-DD')} ${item.startTime}`, 'YYYY-MM-DD HH:mm');
              const isPast = slotTime.isBefore(moment());

              console.log('Rendering slot:', item);
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (item.isBooked || isPast) {
                      Alert.alert(item.isBooked ? 'Slot already booked' : 'Invalid slot', item.isBooked ? 'Please choose another time slot.' : 'Cannot select a past time slot.');
                    } else {
                      setSelectedTimeSlot({ id: item._id, time: `${item.startTime} - ${item.endTime}` });
                    }
                  }}
                  style={[
                    styles.slotButton,
                    item.isBooked || isPast ? { backgroundColor: Colors.SECONDARY } : { backgroundColor: Colors.goofy },
                    selectedTimeSlot && selectedTimeSlot.id === item._id
                      ? { borderColor: Colors.SECONDARY, borderWidth: 2, backgroundColor: Colors.selectedBackground }
                      : {},
                  ]}
                  disabled={item.isBooked || isPast}
                >
                  <Text
                    style={[
                      styles.slotText,
                      selectedTimeSlot && selectedTimeSlot.id === item._id
                        ? { color: Colors.selectedText }
                        : {},
                    ]}
                  >
                    {`${item.startTime} - ${item.endTime}`}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          {userInsuranceName && availableInsurances.some((insurance) => insurance.name === userInsuranceName) && (
            <>
              <Text style={styles.acceptedInsurancesTitle}>Accepted Insurances</Text>
              <FlatList
                data={availableInsurances}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedInsurance(item._id)}
                    style={[
                      styles.insuranceCard,
                      item._id === selectedInsurance ? styles.selectedInsuranceCard : null,
                      item.name === userInsuranceName ? styles.userInsuranceCard : null
                    ]}
                    disabled={item.name !== userInsuranceName}
                  >
                    <Image source={{ uri: item.icon }} style={styles.insuranceIcon} />
                    <Text style={[
                      styles.insuranceText,
                      item._id === selectedInsurance ? styles.selectedInsuranceText : null,
                      item.name === userInsuranceName ? styles.userInsuranceText : null
                    ]}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </>
          )}
          <TouchableOpacity style={styles.bookButton} onPress={() => handleBookPress(userInsuranceName && availableInsurances.some((insurance) => insurance.name === userInsuranceName))} disabled={isSubmitting}>
            <Text style={styles.bookButtonText}>
              {userInsuranceName && availableInsurances.some((insurance) => insurance.name === userInsuranceName) ? 'Proceed with Insurance' : 'Book Appointment'}
            </Text>
          </TouchableOpacity>

          {!userInsuranceName || !availableInsurances.some((insurance) => insurance.name === userInsuranceName) ? (
            <Paystack
              paystackKey="pk_test_81ffccf3c88b1a2586f456c73718cfd715ff02b0"
              billingEmail={userEmail}
              amount={consultationFee * 100}
              currency='KES'
              onCancel={handlePaymentCancel}
              onSuccess={handlePaymentSuccess}
              ref={paystackWebViewRef}
            />
          ) : null}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 30,
    backgroundColor: theme.colors.backgroundColor,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dateButton: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  dateText: {
    color: Colors.primary,
  },
  dateTitle: {
    fontSize: 18,
    marginVertical: 20,
  },
  slotButton: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  slotText: {
    color: Colors.primary,
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  bookedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  insuranceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  insuranceCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  insuranceText: {
    fontSize: 16,
    color: Colors.primary,
  },
  selectedInsuranceCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  selectedInsuranceText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  noInsuranceText: {
    fontSize: 16,
    color: Colors.gray,
    marginVertical: 10,
  },
  clearCacheButton: {
    backgroundColor: Colors.SECONDARY,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  clearCacheButtonText: {
    color: Colors.primary,
    fontSize: 16,
  },
  insuranceIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  acceptedInsurancesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  warningText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default BookingSection;

