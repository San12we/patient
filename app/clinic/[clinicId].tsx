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
      {/* Fixed Profile Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: clinic.profileImage }} style={styles.profileImage} />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 20, // Offset to account for the fixed profile image
  },
  scrollContent: {
    paddingBottom: 20, // Add padding to avoid content being cut off
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: Colors.SECONDARY,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.gray,
    marginLeft: 8,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
  },
  insuranceCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  insuranceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  placeholderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  insuranceText: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 8,
  },
  serviceCard: {
    borderColor: '#ffe9e3',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
  },
  serviceText: {
    fontSize: 14,
    color: Colors.primary,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
  
    padding: 16,
    marginBottom: 12,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: Colors.gray,
  },
});

export default ClinicProfile;