import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ClinicSubHeading from '../../../components/clinics/ClinicSubHeading';
import { theme } from '@/constants/theme';
import Colors from '../../../components/Shared/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedDoctor } from '../../../app/(redux)/doctorSlice'; // Import the action
import useSchedule from '../../../hooks/useSchedule'; // Import the useSchedule hook
import moment from 'moment';

const ClinicProfileScreen = () => {
  const { id } = useLocalSearchParams();
  const clinicId = Array.isArray(id) ? id[0] : id;
  const clinicData = useSelector((state) => state.clinics.clinics.find(clinic => clinic._id === clinicId));
  const doctorsData = clinicData ? clinicData.doctors : [];
  const router = useRouter();
  const insuranceProviders = useSelector((state) => state.insurance.insuranceProviders); // Get insurance providers from Redux store
  const dispatch = useDispatch();

  const clinicImages = clinicData?.clinicImages || [];
  const [currentImage, setCurrentImage] = useState(clinicImages[0] || null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ id: string; time: string } | null>(null);
  const { schedule, fetchSchedule, loading, error } = useSchedule(clinicId, 'userId'); // Replace 'userId' with actual user ID
  const dateOptions = Array.from({ length: 7 }, (_, i) => moment().add(i, 'days').toDate());

  useEffect(() => {
    console.log('Clinic Data:', clinicData);
    console.log('Doctors Data:', doctorsData);
    console.log('Clinic Insurance Providers:', clinicData?.insuranceProviders);
    console.log('All Insurance Providers:', insuranceProviders);
    fetchSchedule();
  }, [clinicData, doctorsData, insuranceProviders]);

  if (!clinicData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No clinic data found</Text>
      </View>
    );
  }

  const insuranceDetails = clinicData.insuranceProviders.map(name => {
    const provider = insuranceProviders.find(provider => provider.name === name);
    return provider ? { name: provider.name, icon: provider.icon } : { name: 'Unknown', icon: null };
  });

  const bookAppointment = (_id) => {
    // Logic to book an appointment with the given _id
    console.log(`Booking appointment with _id: ${_id}`);
    // ...existing booking logic...
  };

  const handleConsult = (doctor) => {
    console.log('Consulting doctor:', doctor);
    dispatch(setSelectedDoctor(doctor));
    router.push(`/doctors/${doctor.id}`); 
  };

  const renderDoctor = (doctor) => (
    <View key={doctor.id} style={styles.doctorItem}>
      <TouchableOpacity onPress={() => handleConsult(doctor)}>
        <Image source={{ uri: doctor.profileImage }} style={styles.doctorImage} />
      </TouchableOpacity>
      <View style={styles.nameCategoryContainer}>
        <Text style={styles.doctorName}>{`${doctor.firstName} ${doctor.lastName}`}</Text>
        <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
      </View>
    </View>
  );

  const getSlotsForSelectedDate = () => {
    const dayOfWeek = moment(selectedDate).format('dddd');
    return schedule[dayOfWeek] || [];
  };

  const slotsForSelectedDate = getSlotsForSelectedDate();

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.heroContainer}>
        {currentImage ? (
          <Image
            source={{ uri: currentImage }}
            style={styles.heroImage}
          />
        ) : (
          <Image
            source={clinicData.profileImage ? { uri: clinicData.profileImage } : 'https://res.cloudinary.com/dws2bgxg4/image/upload/v1734385887/loginp_ovgecg.png'}
            style={styles.heroImage}
          />
        )}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroText}>{clinicData.practiceName}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <ClinicSubHeading subHeadingTitle="About Us" />
        <Text style={styles.descriptionText}>
          {showFullDesc ? clinicData.bio : clinicData.bio?.slice(0, 100) || 'No description available'}
        </Text>
        {clinicData.bio && (
          <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)}>
            <Text style={styles.showMoreText}>{showFullDesc ? 'Show Less' : 'Show More'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <ClinicSubHeading subHeadingTitle="Specialties" />
        <FlatList
          data={clinicData.category ? [clinicData.category] : []}
          renderItem={({ item }) => (
            <View style={styles.specialtyCard}>
              <Text style={styles.specialtyText}>{item}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.section}>
        <ClinicSubHeading subHeadingTitle="Insurance Providers" />
        <FlatList
          data={insuranceDetails}
          renderItem={({ item }) => (
            <View style={styles.insuranceCard}>
              {item.icon && <Image source={{ uri: item.icon }} style={styles.insuranceIcon} />}
              <Text style={styles.insuranceText}>{item.name}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.section}>
        <ClinicSubHeading subHeadingTitle="Available Slots" />
        {loading ? (
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
        ) : error ? (
          <Text>Error loading schedule: {error}</Text>
        ) : (
          <FlatList
            horizontal
            data={slotsForSelectedDate}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              const slotTime = moment(`${moment(selectedDate).format('YYYY-MM-DD')} ${item.startTime}`, 'YYYY-MM-DD HH:mm');
              const isPast = slotTime.isBefore(moment());

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
        )}
      </View>

      <View style={styles.section}>
        <ClinicSubHeading subHeadingTitle="Medical Professionals" />
        {doctorsData.length > 0 ? (
          <FlatList
            data={doctorsData}
            horizontal
            renderItem={({ item }) => renderDoctor(item)}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <Text>No doctors available</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default ClinicProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1,  backgroundColor: '#e3f6f5', padding: 10 },
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
  descriptionText: { fontSize: 16, color: '#333' },
  showMoreText: { color: Colors.PRIMARY, marginTop: 10 },
  specialtyCard: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  specialtyText: { fontSize: 14, color: '#555' },
  insuranceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  insuranceIcon: { width: 30, height: 30, marginRight: 10 },
  insuranceText: { fontSize: 14, color: '#555' },
  workingHoursText: { fontSize: 16, color: '#333' },
  slotButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  slotText: {
    fontSize: 14,
  },
  doctorItem: {
    marginRight: 10,
    borderRadius: 10,
    padding: 10,
    width: 200,
  },
  doctorImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  nameCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  doctorName: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  doctorSpecialty: {
    color: Colors.primary,
  },
  doctorsList: { paddingBottom: 15 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: 'red' },
  daySection: { marginBottom: 15 },
  dayText: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  slotCard: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
});
