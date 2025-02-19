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
  Switch,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Loading from '../../components/Loading';
import Colors from '../../components/Shared/Colors';
import BookingSection from '../../components/BookingSection';
import ClinicSubHeading from '@/components/clinics/ClinicSubHeading';
import useSchedule from '../../hooks/useSchedule';
import useInsurance from '../../hooks/useInsurance';
import axios from 'axios';
import UserBookingSection from '../../components/UserBookingSection';
import { getDoctors, setSelectedDoctor } from '../../app/(redux)/doctorSlice';
import socket from '../../Services/socket';
import { useDoctors } from '../../hooks/useDoctors';

const DoctorProfile: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const doctor = useSelector((state) => state.doctors.selectedDoctor);
  const userId = useSelector((state) => state.auth.user.user._id);
  const { doctors: clinicDoctors } = useDoctors();
  const { schedule, fetchSchedule, loading: scheduleLoading, error } = useSchedule(doctor?._id, userId);
  const { insuranceProviders, userInsurance, isInsuranceAccepted, status, error: insuranceError } = useInsurance();
  const selectedDoctor = useSelector((state) => state.doctors.selectedDoctor);

  const [selectedDay, setSelectedDay] = useState<string>(moment().format('dddd'));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ id: string; time: string; isBooked: boolean; date: string } | null>(null);
  const [selectedInsurance, setSelectedInsurance] = useState<string | undefined>(undefined);
  const [showSchedule, setShowSchedule] = useState(false);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(true);

  const profileImageUri = doctor?.user?.profileImage || doctor?.profileImage || 'https://res.cloudinary.com/dws2bgxg4/image/upload/v1726073012/nurse_portrait_hospital_2d1bc0a5fc.jpg';
  const specialties = doctor?.professionalDetails?.customSpecializedTreatment || 'N/A';
  const specialization = doctor?.professionalDetails?.specialization || 'N/A';
  const yearsOfExperience = doctor?.professionalDetails?.yearsOfExperience || 'N/A';
  const clinicName = doctor?.practiceName || 'Unknown Clinic';

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const hasInsurance = useMemo(() => !!userInsurance, [userInsurance]);

  // Fetch doctor data and schedule
  useEffect(() => {
    const fetchData = async () => {
      try {
        setProcessing(true);
        await dispatch<any>(getDoctors());
        if (!doctor) {
          router.back();
        } else {
          dispatch(setSelectedDoctor(doctor));
          await fetchSchedule();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        setProcessing(false);
      }
    };

    if (doctor && doctor._id !== selectedDoctor?._id) {
      fetchData();
    } else {
      setLoading(false);
      setProcessing(false);
    }
  }, [dispatch, doctor, router, selectedDoctor]);

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

  // Updated renderSlot with item check
  const renderSlot = useCallback(({ item }) => {
    if (!item) return null; // safeguard against undefined item
  
    const slotTime = moment(`${item.date} ${item.startTime}`, 'YYYY-MM-DD HH:mm');
    const isPast = slotTime.isBefore(moment());
  
    return (
      <View key={item._id}>
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
      </View>
    );
  }, [selectedTimeSlot]);

  const renderDayButton = (day) => {
    const today = moment().startOf('day');
    const isPastDay = moment(day, 'dddd').isBefore(today, 'day');
    const hasSlots = schedule[day]?.length > 0;
    const isDisabled = isPastDay || !hasSlots;
    const isToday = moment(day, 'dddd').isSame(moment(), 'day');

    return (
      <View key={day}>
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
      </View>
    );
  };

  const handleDoctorPress = async (doctor) => {
    setProcessing(true);
    dispatch(setSelectedDoctor(doctor));
    await fetchSchedule();
    setProcessing(false);
  };

  // Filter out the selected doctor from the list of other doctors
  const otherDoctors = useMemo(() => {
    return clinicDoctors.filter((doc) => doc._id !== doctor._id);
  }, [clinicDoctors, doctor]);

  // Check if the doctor has any slots at all
  const hasAnySlots = useMemo(() => {
    return Object.values(schedule).some((slots) => slots.length > 0);
  }, [schedule]);

  // Updated renderScheduleSection with checks for undefined values
  const renderScheduleSection = () => {
    if (!schedule || !selectedDay) return null; // ensure valid values
  
    if (!hasAnySlots) {
      return (
        <View style={[styles.section, styles.unavailableSection]}>
          <Text style={styles.unavailableText}>Currently Unavailable</Text>
        </View>
      );
    }
  
    return (
      <>
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
          {error ? (
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
  
        {hasInsurance ? (
          <UserBookingSection
            doctorId={doctor._id}
            consultationFee={doctor.consultationFee || 'N/A'}
            selectedTimeSlot={selectedTimeSlot}
          />
        ) : (
          <BookingSection
            doctorId={doctor._id}
            consultationFee={doctor.consultationFee || 'N/A'}
            selectedTimeSlot={selectedTimeSlot}
          />
        )}
      </>
    );
  };

  if (loading || processing || status === 'loading') {
    return <Loading />;
  }

  const renderInfoItem = ({ item, index }) => (
    <View key={index}>
      <View style={styles.infoItem}>
        <Ionicons name={item.icon} size={20} color={Colors.primary} />
        <Text style={styles.infoText}>{item.text}</Text>
      </View>
    </View>
  );

  const infoItems = [
    { icon: 'medkit', text: specialties },
    { icon: 'business', text: clinicName },
    { icon: 'calendar', text: `${yearsOfExperience} years of experience` },
  ];

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
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ClinicSubHeading subHeadingTitle={`${doctor.firstName} ${doctor.lastName}`} />
          <Text style={styles.descriptionText}>{doctor.bio || 'No description available'}</Text>
        </View>

        <View style={styles.section}>
          <FlatList
            horizontal
            data={infoItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderInfoItem}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.scheduleContainer}>
          <View style={styles.scheduleToggleContainer}>
            <Text style={styles.scheduleText}>Schedule</Text>
            <Switch
              value={showSchedule}
              onValueChange={(value) => setShowSchedule(value)}
              trackColor={{ false: Colors.LIGHT_GRAY, true: Colors.PRIMARY }}
              thumbColor={showSchedule ? Colors.WHITE : Colors.GRAY}
              style={styles.scheduleSwitch}
            />
          </View>
        </View>

        {/* Render schedule section or subtle unavailability message */}
        {showSchedule && renderScheduleSection()}

        {/* Render other doctors */}
        <View style={styles.section}>
          <Text style={styles.title}>Other Doctors</Text>
          <FlatList
            data={otherDoctors}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View key={item._id}>
                <TouchableOpacity
                  style={styles.doctorCard}
                  onPress={() => handleDoctorPress(item)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: item.profileImage || 'https://res.cloudinary.com/dws2bgxg4/image/upload/v1726073012/nurse_portrait_hospital_2d1bc0a5fc.jpg' }}
                    style={styles.doctorImage}
                  />
                  <View style={styles.doctorDetails}>
                    <Text style={styles.doctorName}>
                      {item.firstName} {item.lastName}
                    </Text>
                    <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6e2f8'
  },
  heroContainer: {
    height: 250,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  heroText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  horizontalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 8,
    textAlign: 'center',
  },
  scheduleContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  scheduleToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  scheduleText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  scheduleSwitch: {
    alignSelf: 'flex-end',
  },
  dayButton: {
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDayButton: {
    backgroundColor: Colors.PRIMARY,
  },
  todayButton: {
    backgroundColor: Colors.SECONDARY,
  },
  disabledDayButton: {
    backgroundColor: Colors.LIGHT_GRAY,
  },
  dayText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  selectedDayText: {
    color: '#fff',
  },
  todayText: {
    color: '#fff',
  },
  disabledDayText: {
    color: Colors.GRAY,
  },
  infoIcon: {
    marginLeft: 4,
  },
  slotButton: {
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  slotText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  checkIcon: {
    position: 'absolute',
    right: 4,
    top: 4,
  },
  noSlotsText: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 200,
    height: 200,
  },
  unavailableSection: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 12,
  },
  unavailableText: {
    fontSize: 14,
    color: Colors.GRAY,
    fontStyle: 'italic',
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.DARK_TEXT,
    marginVertical: 8,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:  '#d8d8ec',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%', // Take up the full width of the parent container
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: Colors.gray,
  },
});

export default DoctorProfile;