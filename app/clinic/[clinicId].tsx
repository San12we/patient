import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import Colors from '../../components/Shared/Colors';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { setSelectedDoctor } from '../../app/(redux)/doctorSlice';
import axios from 'axios';
import moment from 'moment';
import useSchedule from '../../hooks/useSchedule';

const ClinicProfile: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const clinic = useSelector((state) => state.clinics.selectedClinic);
  const selectedDoctor = useSelector((state) => state.doctors.selectedDoctor);
  const insuranceProviders = useSelector((state) => state.insurance.insuranceProviders);

  const [currentImage, setCurrentImage] = useState(clinic?.clinicImages[0] || null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ id: string; time: string } | null>(null);
  const { schedule, fetchSchedule, loading, error } = useSchedule(clinic?._id, 'userId');
  const dateOptions = Array.from({ length: 7 }, (_, i) => moment().add(i, 'days').toDate());

  useEffect(() => {
    if (clinic) {
      fetchSchedule();
    }
  }, [clinic]);

  useEffect(() => {
    if (selectedDoctor) {
      dispatch(setSelectedDoctor(selectedDoctor));
    }
  }, [selectedDoctor, dispatch]);

  if (!clinic) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noDataText}>No clinic data available</Text>
      </View>
    );
  }

  const handleDoctorPress = async (doctor) => {
    try {
      const response = await axios.get(`https://medplus-health.onrender.com/api/professionals/${doctor.id}`);
      const fullDoctorData = response.data;
      dispatch(setSelectedDoctor(fullDoctorData));
      router.push(`/doctors/${doctor.id}`);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };

  const insuranceDetails = clinic.insuranceProviders.map(name => {
    const provider = insuranceProviders.find(provider => provider.name === name);
    return provider ? { name: provider.name, icon: provider.icon } : { name: 'Unknown', icon: null };
  });

  const services = [
    'General Consultation',
    'Pediatrics',
    'Dermatology',
    'Cardiology',
    'Orthopedics',
    'Neurology',
    'Gynecology',
    'ENT Services',
    'Dental Care',
    'Physiotherapy'
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: clinic.profileImage }} style={styles.profileImage} />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{clinic.practiceName}</Text>
          <Text style={styles.subtitle}>{clinic.address}</Text>
          <Text style={styles.category}>{clinic.category}</Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>
              {clinic.workingHours?.startTime} - {clinic.workingHours?.endTime}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="event" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{clinic.workingDays.join(', ')}</Text>
          </View>
            <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insurance Providers</Text>
          <FlatList
            data={insuranceDetails}
            renderItem={({ item }) => (
              <View style={styles.insuranceCard}>
                {item.icon ? (
                  <Image source={{ uri: item.icon }} style={styles.insuranceIcon} />
                ) : (
                  <View style={styles.placeholderIcon}>
                    <Text style={styles.placeholderText}>{item.name.charAt(0)}</Text>
                  </View>
                )}
                <Text style={styles.insuranceText}>{item.name}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

            </View>
         <View style={styles.section}>
         <Text style={styles.sectionTitle}>Services Offered</Text>
          <FlatList
            horizontal
            data={services}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.serviceCard}>
                <Text style={styles.serviceText}>{item}</Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
          />
         </View>
         

          <Text style={styles.sectionTitle}>Doctors</Text>
          <FlatList
            data={clinic.doctors}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.doctorCard}
                onPress={() => handleDoctorPress(item)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: item.profileImage || 'https://via.placeholder.com/150' }}
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
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClinicProfile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fbfc',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fbfc',
  },
  section: {
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
    zIndex: 10,
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    backgroundColor: '#f9fbfc',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.secondary,
    marginBottom: 16,
  },
  category: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 24,
    marginBottom: 16,
  },
  insuranceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginRight: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  insuranceIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  placeholderIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
    backgroundColor: Colors.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  insuranceText: {
    fontSize: 14,
    color: '#555',
  },
  serviceCard: {
    padding: 20,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  serviceText: {
    fontSize: 14,
    color: '#555',
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightBackground,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
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
    fontWeight: '600',
    color: Colors.text,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: Colors.secondary,
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  noDataText: {
    fontSize: 18,
    color: Colors.text,
  },
});