import React, { useState, useEffect, useRef } from 'react';

import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, ActivityIndicator, Image } from 'react-native';
import moment from 'moment';
import  { Paystack , paystackProps}  from 'react-native-paystack-webview';
import axios from 'axios';
import Colors from './Shared/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../app/(redux)/authSlice';
import useSchedule from '../hooks/useSchedule'; // Import the useSchedule hook
import io from 'socket.io-client';
import { useToast } from 'react-native-paper-toast'; // Import useToast
import useInsurance from '../hooks/useInsurance'; // Import the useInsurance hook
import {theme} from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BookingSection: React.FC<{ doctorId: string; userId: string; consultationFee: number; insurances?: string[]; selectedInsurance?: string }> = ({
  doctorId,
  userId, // Accept userId
  consultationFee,
  insurances = [], // Default to an empty array if insurances is not provided
  selectedInsurance: initialSelectedInsurance = '', // Default to an empty string if selectedInsurance is not provided
}) => {
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ id: string; time: string } | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const paystackWebViewRef = useRef<paystackProps.PayStackRef>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedInsurance, setSelectedInsurance] = useState<string>(initialSelectedInsurance);
  const [userInsurance, setUserInsurance] = useState<string | null>(null);

  const user = useSelector(selectUser);
  const userEmail = user.user?.email; // Extract userEmail from the user object
  const patientName = user.user?.username || user.name; // Extract patientName from the user object
  const dispatch = useDispatch();
  const { schedule, fetchSchedule,  updateSlot, loading, error } = useSchedule(userId); // Use userId to fetch the schedule
 console.log(userEmail); // Log the userEmail
 


 
 
  const [dateOptions, setDateOptions] = useState<Array<Date>>(
    Array.from({ length: 7 }).map((_, i) => moment().add(i, 'days').toDate())
  );

  useEffect(() => {
    fetchSchedule(userId); // Use userId to fetch the schedule
    
 
    const today = new Date();
    const availableDates = dateOptions.filter(date => moment(date).isSameOrAfter(today, 'day'));
    setDateOptions(availableDates);
  }, [userId]);

 
  useEffect(() => {
    console.log('Fetched schedule:', schedule);
  }, [schedule]);

  console.log('BookingSection userId:', userId); // Log the userId

  const toaster = useToast(); // Initialize useToast

  const { insuranceProviders } = useInsurance(); // Use the useInsurance hook
  const [availableInsurances, setAvailableInsurances] = useState<any[]>([]); // Initialize as an empty array

  useEffect(() => {
    const fetchUserInsurance = async () => {
      try {
        const storedData = await AsyncStorage.getItem('insuranceData');
        if (storedData) {
          const insuranceData = JSON.parse(storedData);
          setUserInsurance(insuranceData.insuranceProvider);
        }
      } catch (error) {
        console.error('Error loading user insurance data:', error);
      }
    };

    fetchUserInsurance();
  }, []);

  useEffect(() => {
    console.log('User Insurance:', userInsurance); // Log the user's insurance
  }, [userInsurance]);

  const userInsuranceName = userInsurance; // Direct name absence of ID check

  useEffect(() => {
    // Map insurance provider IDs to corresponding details
    const mappedInsurances = insurances
      .map((providerId) =>
        insuranceProviders.find((provider) => provider._id === providerId)
      )
      .filter((provider) => provider); // Filter out any undefined entries

    setAvailableInsurances(mappedInsurances);
    console.log('Mapped Insurances in BookingSection:', mappedInsurances); // Log mapped insurances
    console.log('Accepted Insurances:', mappedInsurances.map((insurance) => insurance.name)); // Log accepted insurances
  }, [insurances, insuranceProviders]);

  useEffect(() => {
    console.log('User Insurance:', userInsuranceName); // Log the user's insurance name
    const isAccepted = availableInsurances.some((insurance) => insurance.name === userInsuranceName);
    console.log('Is User Insurance Accepted:', isAccepted); // Log if the user's insurance is accepted
  }, [userInsuranceName, availableInsurances]);

  const userInsuranceMatches = userInsuranceName && availableInsurances.some((insurance) => insurance.name === userInsuranceName);

  const handleBookPress = async (withInsurance: boolean) => {
    console.log(withInsurance ? 'Proceed with Insurance button pressed' : 'Proceed to Payment button pressed'); // Log button press
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
  
    console.log('Selected Time Slot:', selectedTimeSlot); // Log selectedTimeSlot
    console.log('User Email:', userEmail); // Log userEmail
    console.log('Patient Name:', patientName); // Log patientName
  
    setIsSubmitting(true);
    setShowAlert(false);
    setAlertMessage('');
    setAlertType('success');
    let subaccountCode: string | null = null;
  
    const fetchSubaccountCode = async (userId: string) => { // Use userId to fetch the subaccount code
      try {
        const response = await axios.get(`https://medplus-health.onrender.com/api/subaccount/${userId}`);
        if (response.data.status === 'Success') {
          const { subaccount_code } = response.data.data;
          subaccountCode = subaccount_code;
        } else {
          console.error('Failed to fetch subaccount code:', response.data.message);
        }
      } catch (error) {
        console.error('Failed to fetch subaccount code:', error);
      }
    };
  
    await fetchSubaccountCode(userId); // Use userId to fetch the subaccount code
  
    try {
      if (!subaccountCode && !withInsurance) {
        throw new Error('Missing subaccount code.');
      }
      if (!userEmail) {
        throw new Error('Missing user email.');
      }
      if (!patientName) {
        throw new Error('Missing patient name.');
      }
  
      const appointmentData = {
        doctorId: doctorId,
        userId: userId,
        patientName: patientName,
        date: moment(selectedDate).format('YYYY-MM-DD'),
        timeSlotId: selectedTimeSlot?.id || null,
        time: selectedTimeSlot?.time || null,
        status: 'pending',
        insurance: selectedInsurance,
      };
  
      // Provide default values if booking with insurance
      if (selectedInsurance) {
        appointmentData.timeSlotId = appointmentData.timeSlotId || 'defaultTimeSlotId';
        appointmentData.time = appointmentData.time || 'defaultTime';
      }
  
      const appointmentResponse = await axios.post('https://medplus-health.onrender.com/api/appointments', appointmentData);
  
      const newAppointmentId = appointmentResponse.data.appointment._id; // Ensure correct path to appointment ID
      if (!newAppointmentId) {
        throw new Error('Failed to retrieve appointmentId from response');
      }
      console.log('New appointment ID:', newAppointmentId); // Log the appointmentId from the response
      setAppointmentId(newAppointmentId);
  
      // Log the state after setting the appointmentId
      console.log('State after setting appointmentId:', { appointmentId: newAppointmentId });
  
      // Update the slot to booked in the local state if time slot is selected
      if (selectedTimeSlot) {
        updateSlot(selectedTimeSlot.id, { isBooked: true });
      }
  
      if (withInsurance) {
        toaster.show({ message: 'Appointment booked successfully with insurance.', type: 'success' });
        setIsSubmitting(false);
        return;
      }
  
      const paymentResponse = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email: userEmail,
          amount: consultationFee * 100,
          subaccount: subaccountCode,
          currency: 'KES',
          metadata: {
            appointmentId: newAppointmentId,
            timeSlotId: selectedTimeSlot?.id || null,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (paymentResponse.data.status) {
        if (paystackWebViewRef.current) {
          paystackWebViewRef.current.startTransaction();
        }
      } else {
        throw new Error('Payment initialization failed');
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

      const confirmResponse = await axios.put(
        `https://medplus-health.onrender.com/api/appointments/confirm/${currentAppointmentId}`,
        { status: 'confirmed' }
      );
      console.log('Confirm response:', confirmResponse.data);

      fetchSchedule(doctorId);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      setAlertMessage('Failed to update appointment status.');
      setAlertType('error');
      setShowAlert(true);
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

  const generateSlots = (startTime: string, endTime: string) => {
    const slots = [];
    const consultationDuration = 60; // 60 minutes
    const waitingTime = 10; // 10 minutes

    let start = moment(startTime, 'h:mm A');
    const end = moment(endTime, 'h:mm A');

    while (start.add(consultationDuration + waitingTime, 'minutes').isBefore(end) || start.isSame(end)) {
      const slotStart = start.clone().subtract(consultationDuration + waitingTime, 'minutes');
      const slotEnd = slotStart.clone().add(consultationDuration, 'minutes');
      slots.push({
        startTime: slotStart.format('h:mm A'),
        endTime: slotEnd.format('h:mm A'),
        isBooked: false,
        _id: `${slotStart.format('HHmm')}-${slotEnd.format('HHmm')}`,
      });
    }

    console.log('Generated slots:', slots); // Log the generated slots
    return slots;
  };

  const groupedSlots = schedule.reduce((acc: Record<string, { date: string; startTime: string; endTime: string; isBooked: boolean; _id: string }[]>, slot) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
    if (slot.recurrence === 'Daily') {
      daysOfWeek.forEach((day, index) => {
        const date = moment().startOf('week').add(index + 1, 'days').format('YYYY-MM-DD');
        if (!acc[date]) acc[date] = [];
        acc[date].push({ ...slot, date, _id: slot._id });
      });
    } else {
      const date = moment().day(slot.date).format('YYYY-MM-DD');
      if (!acc[date]) acc[date] = [];
      acc[date].push({ ...slot, date, _id: slot._id });
    }
  
    return acc;
  }, {});
  
  // Log the groupedSlots to verify the data is grouped correctly
  console.log('Grouped slots:', groupedSlots);
  

  // Log the groupedSlots to verify the data is grouped correctly
  console.log('Grouped slots:', groupedSlots);

  const markedDates = Object.keys(groupedSlots).reduce((acc: Record<string, { marked: boolean }>, date) => {
    acc[date] = { marked: true };
    return acc;
  }, {});

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
            data={groupedSlots[moment(selectedDate).format('YYYY-MM-DD')] || []}
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
          {userInsuranceName && availableInsurances.some((insurance) => insurance.name === userInsuranceName) ? (
            <>
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedInsurance(item._id)}
                    style={[
                      styles.insuranceCard,
                      item._id === selectedInsurance ? styles.selectedInsuranceCard : null,
                      item.name === userInsuranceName ? styles.userInsuranceCard : null
                    ]}
                    disabled={item.name !== userInsuranceName} // Disable selection if it does not match user insurance
                  >
                    <Image source={{ uri: item.icon }} style={styles.insuranceIcon} />
                    <Text style={[
                      styles.insuranceText,
                      item._id === selectedInsurance ? styles.selectedInsuranceText : null,
                      item.name === userInsuranceName ? styles.userInsuranceText : null
                    ]}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
              <TouchableOpacity style={styles.bookButton} onPress={() => handleBookPress(true)} disabled={isSubmitting}>
                <Text style={styles.bookButtonText}>Proceed with Insurance</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.bookButton} onPress={() => handleBookPress(false)} disabled={isSubmitting}>
              <Text style={styles.bookButtonText}>Book Appointment</Text>
            </TouchableOpacity>
          )}

          <Paystack
            paystackKey="pk_test_81ffccf3c88b1a2586f456c73718cfd715ff02b0"
            billingEmail={userEmail}
            amount={consultationFee * 100}
            currency='KES'
            onCancel={handlePaymentCancel}
            onSuccess={handlePaymentSuccess}
            ref={paystackWebViewRef}
          />
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
});

export default BookingSection;

