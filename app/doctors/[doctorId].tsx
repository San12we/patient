import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Colors from '../../components/Shared/Colors';
import BookingSection from '../../components/BookingSection';
import ClinicSubHeading from '@/components/clinics/ClinicSubHeading';
import Doctors from '../../components/client/Doctors';
import useSchedule from '../../hooks/useSchedule';
import useInsurance from '../../hooks/useInsurance';
import axios from 'axios';

type Slot = {
  _id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
};

const DoctorProfile: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const doctor = useSelector((state) => state.doctors.selectedDoctor);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ id: string; time: string; isBooked: boolean } | null>(null);
  const userId = useSelector((state) => state.auth.user.user._id);
  const { schedule, fetchSchedule, updateSlot, loading, error } = useSchedule(doctor._id, userId);
  const { insuranceProviders } = useInsurance();
  const [availableInsurances, setAvailableInsurances] = useState<any[]>([]);
  const [selectedInsurance, setSelectedInsurance] = useState<string | null>('');
  const [userInsurance, setUserInsurance] = useState<string | null>(null);
  const dateOptions = Array.from({ length: 7 }, (_, i) => moment().add(i, 'days').toDate());
  const [selectedDay, setSelectedDay] = useState<string>(moment().format('dddd')); // Add state for selected day

  useEffect(() => {
    const fetchUserInsurance = async () => {
      try {
        const response = await axios.get(`https://project03-rj91.onrender.com/insurance/user/${userId}`);
        if (response.status === 200) {
          const data = response.data;
          setUserInsurance(data.insuranceProvider);
          console.log('User Insurance from server:', data);
        }
      } catch (error) {
        console.error('Error fetching user insurance data from server:', error);
      }
    };

    fetchUserInsurance();
  }, [userId]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!doctor) {
        router.back();
      } else {
        console.log('Selected Doctor:', doctor);
        fetchSchedule();
      }
    }
  }, [doctor, router, isMounted]);

  useEffect(() => {
    const mappedInsurances = doctor.insuranceProviders
      .map((providerId) => insuranceProviders.find((provider) => provider._id === providerId))
      .filter((provider) => provider);

    setAvailableInsurances(mappedInsurances);
    console.log('Mapped Insurances in DoctorProfile:', mappedInsurances);
    console.log('Accepted Insurances:', mappedInsurances.map((insurance) => insurance.name));
  }, [doctor.insuranceProviders, insuranceProviders]);

  useEffect(() => {
    const isAccepted = availableInsurances.some((insurance) => insurance.name === userInsurance);
    if (isAccepted) {
      setSelectedInsurance(userInsurance);
    }
  }, [userInsurance, availableInsurances]);

  if (!doctor) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  const profileImageUri =
    doctor.profileImage ||
    'https://res.cloudinary.com/dws2bgxg4/image/upload/v1726073012/nurse_portrait_hospital_2d1bc0a5fc.jpg';

  const specialties = doctor.professionalDetails?.customSpecializedTreatment || 'N/A';
  const specialization = doctor.professionalDetails?.specialization || 'N/A';
  const specializedTreatment = doctor.professionalDetails?.specializedTreatment || 'N/A';
  const yearsOfExperience = doctor.professionalDetails?.yearsOfExperience || 'N/A';
  const clinicName = doctor.practiceName || 'Unknown Clinic';

  const getSlotsForSelectedDate = () => {
    const dayOfWeek = moment(selectedDate).format('dddd');
    return schedule[dayOfWeek] || [];
  };

  const getSlotsForSelectedDay = () => {
    return schedule[selectedDay] || [];
  };

  const slotsForSelectedDate = getSlotsForSelectedDate();
  const slotsForSelectedDay = getSlotsForSelectedDay();

  const isToday = (day: string) => moment().format('dddd') === day;

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
        <View style={styles.section}>
          <ClinicSubHeading subHeadingTitle={`${doctor.firstName} ${doctor.lastName}`} />
          <Text style={styles.descriptionText}>
            {doctor.bio || 'No description available'}
          </Text>
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
          <View style={styles.infoCard}>
            <Ionicons name="medkit" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{specialization}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="medkit" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{specializedTreatment}</Text>
          </View>
        </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.title}>Select a Day</Text>
          <FlatList
            horizontal
            data={Object.keys(schedule)}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedDay(item)}
                style={[
                  styles.dayButton,
                  selectedDay === item ? styles.selectedDayButton : null,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDay === item ? styles.selectedDayText : null,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Available Slots</Text>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
          ) : error ? (
            <Text>Error loading schedule: {error}</Text>
          ) : (
            <FlatList
              horizontal
              data={slotsForSelectedDay}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => {
                const slotTime = moment(`${moment(selectedDate).format('YYYY-MM-DD')} ${item.startTime}`, 'YYYY-MM-DD HH:mm');
                const isPast = isToday(selectedDay) && slotTime.isBefore(moment());

                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (item.isBooked || isPast) {
                        Alert.alert(item.isBooked ? 'Slot already booked' : 'Invalid slot', item.isBooked ? 'Please choose another time slot.' : 'Cannot select a past time slot.');
                      } else {
                        setSelectedTimeSlot({ id: item._id, time: `${item.startTime} - ${item.endTime}`, isBooked: item.isBooked });
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
                          ? { color: Colors.PRIMARY}
                          : {},
                      ]}
                    >
                      {`${item.startTime} - ${item.endTime}`}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>

        {userInsurance && availableInsurances.some((insurance) => insurance.name === userInsurance) && (
          <View style={styles.section}>
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
                    item.name === userInsurance ? styles.userInsuranceCard : null
                  ]}
                  disabled={item.name !== userInsurance}
                >
                  <Image source={{ uri: item.icon }} style={styles.insuranceIcon} />
                  <Text style={[
                    styles.insuranceText,
                    item._id === selectedInsurance ? styles.selectedInsuranceText : null,
                    item.name === userInsurance ? styles.userInsuranceText : null
                  ]}>{item.name}</Text>
                </TouchableOpacity>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        <BookingSection
          doctorId={doctor._id}
          consultationFee={doctor.consultationFee || 'N/A'}
          selectedTimeSlot={selectedTimeSlot}
          selectedInsurance={selectedInsurance}
        />


        <Doctors excludeDoctorId={doctor.id} />
       
      </ScrollView>
    </View>
  );
};

export default DoctorProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f6f5', // Set the background color
  },
  scrollContainer: {
    flex: 1,
  },
  heroContainer: { position: 'relative', height: 250 },
  heroImage: { width: '100%', height: '100%' },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
    zIndex: 10,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  section: { marginVertical: 15, paddingHorizontal: 15 },
  horizontalSection: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  descriptionText: { fontSize: 16, color: '#333' },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '45%',
  },
  infoText: { marginLeft: 8, fontSize: 14, color: Colors.textPrimary },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slotButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  slotText: {
    fontSize: 14,
  },
  acceptedInsurancesTitle: {
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
  userInsuranceCard: {
    borderColor: Colors.SECONDARY,
    borderWidth: 2,
  },
  userInsuranceText: {
    color: Colors.SECONDARY,
    fontWeight: 'bold',
  },
  insuranceIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  dayButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: Colors.primary,
  },
  selectedDayButton: {
    backgroundColor: Colors.secondary,
  },
  dayText: {
    fontSize: 14,
    color: '#fff',
  },
  selectedDayText: {
    fontWeight: 'bold',
  },
});
