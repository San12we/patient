import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Colors from '../../components/Shared/Colors';
import BookingSection from '../../components/BookingSection';
import ClinicSubHeading from '@/components/clinics/ClinicSubHeading';
import Doctors from '../../components/client/Doctors';
import useSchedule from '../../hooks/useSchedule';
import useInsurance from '../../hooks/useInsurance';
import axios from 'axios';
import UserBookingSection from '../../components/UserBookingSection';
import { getDoctors, setSelectedDoctor } from '../../app/(redux)/doctorSlice';
import socket from '../../Services/socket';

const DoctorProfile: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const doctor = useSelector((state) => state.doctors.selectedDoctor);
  const userId = useSelector((state) => state.auth.user.user._id);
  const { schedule, fetchSchedule, loading: scheduleLoading, error } = useSchedule(doctor._id, userId);
  const { insuranceProviders } = useInsurance();

  const [selectedDay, setSelectedDay] = useState<string>(moment().format('dddd'));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ id: string; time: string; isBooked: boolean; date: string } | null>(null);
  const [selectedInsurance, setSelectedInsurance] = useState<string | undefined>(undefined);
  const [userInsurance, setUserInsurance] = useState<string | null>(null);
  const [isInsuranceAccepted, setIsInsuranceAccepted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const profileImageUri = doctor.user?.profileImage || doctor.profileImage || 'https://res.cloudinary.com/dws2bgxg4/image/upload/v1726073012/nurse_portrait_hospital_2d1bc0a5fc.jpg';
  const specialties = doctor.professionalDetails?.customSpecializedTreatment || 'N/A';
  const specialization = doctor.professionalDetails?.specialization || 'N/A';
  const yearsOfExperience = doctor.professionalDetails?.yearsOfExperience || 'N/A';
  const clinicName = doctor.practiceName || 'Unknown Clinic';

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Fetch doctor data, schedule, and user insurance
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch<any>(getDoctors());
        if (!doctor) {
          router.back();
        } else {
          dispatch(setSelectedDoctor(doctor));
          await fetchSchedule();
          const response = await axios.get(`https://project03-rj91.onrender.com/insurance/user/${userId}`);
          if (response.status === 200) {
            const data = response.data;
            setUserInsurance(data.insuranceProvider);
            setIsInsuranceAccepted(insuranceProviders.some((insurance) => insurance.name === data.insuranceProvider));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, doctor, router, userId, insuranceProviders]);

  // Listen for slot updates
  useEffect(() => {
    socket.on('slotUpdated', (data) => {
      console.log('Slot updated:', data);
      fetchSchedule();
    });

    return () => {
      socket.off('slotUpdated');
    };
  }, [fetchSchedule]);

  // Filter slots for the selected day
  const getSlotsForSelectedDay = useMemo(() => {
    const today = moment().startOf('day');
    return schedule[selectedDay]?.filter((slot) => moment(`${slot.date} ${slot.startTime}`, 'YYYY-MM-DD HH:mm').isSameOrAfter(today)) || [];
  }, [schedule, selectedDay]);

  // Handle slot selection
  const handleSlotSelection = useCallback((slot) => {
    const slotTime = moment(`${slot.date} ${slot.startTime}`, 'YYYY-MM-DD HH:mm');
    if (slot.isBooked || slotTime.isBefore(moment())) {
      Alert.alert(slot.isBooked ? 'Slot already booked' : 'Invalid slot', slot.isBooked ? 'Please choose another time slot.' : 'Cannot select a past time slot.');
    } else {
      setSelectedTimeSlot({ id: slot._id, time: `${slot.startTime} - ${slot.endTime}`, date: slot.date, isBooked: slot.isBooked });
    }
  }, []);

  // Render a single slot
  const renderSlot = useCallback(({ item }) => {
    const slotTime = moment(`${item.date} ${item.startTime}`, 'YYYY-MM-DD HH:mm');
    const isPast = slotTime.isBefore(moment());

    return (
      <TouchableOpacity
        onPress={() => handleSlotSelection(item)}
        style={[
          styles.slotButton,
          item.isBooked || isPast ? { backgroundColor: Colors.SECONDARY } : { backgroundColor: Colors.goofy },
          selectedTimeSlot?.id === item._id && { borderColor: Colors.SECONDARY, borderWidth: 2, backgroundColor: Colors.selectedBackground },
        ]}
        disabled={item.isBooked || isPast}
      >
        <Text style={[styles.slotText, selectedTimeSlot?.id === item._id && { color: Colors.PRIMARY }]}>
          {`${item.startTime} - ${item.endTime}`}
        </Text>
        {selectedTimeSlot?.id === item._id && (
          <Ionicons name="checkmark-circle" size={20} color={Colors.PRIMARY} style={styles.checkIcon} />
        )}
      </TouchableOpacity>
    );
  }, [selectedTimeSlot]);

  const renderDayButton = (day) => {
    const today = moment().startOf('day');
    const isPastDay = moment(day, 'dddd').isBefore(today, 'day');
    const hasSlots = schedule[day]?.length > 0;
    const isDisabled = isPastDay || !hasSlots;
    const isToday = moment(day, 'dddd').isSame(moment(), 'day');

    return (
      <TouchableOpacity
        key={day}
        onPress={() => setSelectedDay(day)}
        style={[
          styles.dayButton,
          selectedDay === day && styles.selectedDayButton,
          isToday && !isDisabled && styles.todayButton,
          isDisabled && styles.disabledDayButton,
        ]}
        disabled={isDisabled}
        onPress={() => {
          if (isPastDay) {
            Alert.alert('Past Day', 'You cannot select a day that has already passed.');
          } else if (!hasSlots) {
            Alert.alert('No Slots', 'The doctor is not available on this day.');
          } else {
            setSelectedDay(day);
          }
        }}
      >
        <Text
          style={[
            styles.dayText,
            selectedDay === day && styles.selectedDayText,
            isToday && !isDisabled && styles.todayText,
            isDisabled && styles.disabledDayText,
          ]}
        >
          {day}
        </Text>
        {isDisabled && (
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={Colors.GRAY}
            style={styles.infoIcon}
          />
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.heroContainer}>
        <Image source={{ uri: profileImageUri }} style={styles.heroImage} />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroText}>{`${doctor.firstName} ${doctor.lastName}`}</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <ClinicSubHeading subHeadingTitle={`${doctor.firstName} ${doctor.lastName}`} />
          <Text style={styles.descriptionText}>{doctor.bio || 'No description available'}</Text>
        </View>

        <View style={[styles.section, styles.horizontalSection]}>
          <View style={styles.infoCard}>
            <Ionicons name="medkit" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{specialties}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="business" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{clinicName}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="calendar" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{yearsOfExperience} years of experience</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Select a Day</Text>
          <FlatList
            horizontal
            data={daysOfWeek}
            keyExtractor={(item) => item}
            renderItem={({ item }) => renderDayButton(item)}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Available Slots</Text>
          {scheduleLoading ? (
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
          ) : error ? (
            <Text>Error loading schedule: {error}</Text>
          ) : getSlotsForSelectedDay.length > 0 ? (
            <FlatList
              horizontal
              data={getSlotsForSelectedDay}
              keyExtractor={(item) => item._id}
              renderItem={renderSlot}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.noSlotsText}>
              {schedule[selectedDay]?.length === 0
                ? 'The doctor is not available for the selected day.'
                : 'No slots available for the selected day.'}
            </Text>
          )}
        </View>

        {isInsuranceAccepted ? (
          <UserBookingSection
            doctorId={doctor._id}
            consultationFee={doctor.consultationFee || 'N/A'}
            selectedTimeSlot={selectedTimeSlot}
            selectedInsurance={selectedInsurance}
          />
        ) : (
          <BookingSection
            doctorId={doctor._id}
            consultationFee={doctor.consultationFee || 'N/A'}
            selectedTimeSlot={selectedTimeSlot}
            selectedInsurance={selectedInsurance}
          />
        )}

        <Doctors excludeDoctorId={doctor._id} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f6f5',
  },
  heroContainer: {
    height: 200,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(101, 159, 161, 0.5)',
  },
  heroText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  horizontalSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light_gray,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: '48%',
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: Colors.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dayButton: {
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayButton: {
    backgroundColor: '#ffebbb',
  },
  availableDayButton: {
    backgroundColor: '#ffebbb',
  },
  unavailableDayButton: {
    backgroundColor: '#ffebbb',
  },
  dayText: {
    fontSize: 16,
  },
  selectedDayText: {
    color: Colors.primary,
  },
  availableDayText: {
    color: Colors.primary,
  },
  unavailableDayText: {
    color: Colors.primary,
  },
  slotButton: {
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotText: {
    fontSize: 16,
  },
  noSlotsText: {
    fontSize: 16,
    color: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledDayButton: {
    backgroundColor: Colors.light_gray,
  },
  disabledDayText: {
    color: Colors.GRAY,
  },
  todayButton: {
    borderColor: Colors.ligh_gray,
    borderWidth: 1,
  },
  todayText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  infoIcon: {
    marginLeft: 5,
  },
  checkIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

export default DoctorProfile;