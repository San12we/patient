import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ClinicSubHeading from '../../../components/clinics/ClinicSubHeading';
import { theme } from '@/constants/theme';
import Colors from '../../../components/Shared/Colors';
import Doctors from '../../../components/client/Doctors'; // Ensure this import is correct
import { useSelector } from 'react-redux';

const ClinicProfileScreen = () => {
  const { id } = useLocalSearchParams();
  const clinicId = Array.isArray(id) ? id[0] : id;
  const clinicData = useSelector((state) => state.clinics.clinics.find(clinic => clinic._id === clinicId));
  const doctorsData = clinicData ? clinicData.doctors : [];
  const router = useRouter();
  const insuranceProviders = useSelector((state) => state.insurance.insuranceProviders); // Get insurance providers from Redux store

  const clinicImages = clinicData?.clinicImages || [];
  const [currentImage, setCurrentImage] = useState(clinicImages[0] || null);
  const imageFadeAnim = useRef(new Animated.Value(1)).current;
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    if (clinicImages.length) {
      let index = 0;
      const interval = setInterval(() => {
        index = (index + 1) % clinicImages.length;
        Animated.timing(imageFadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setCurrentImage(clinicImages[index]);
          Animated.timing(imageFadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [clinicImages, imageFadeAnim]);

  useEffect(() => {
    console.log('Clinic Data:', clinicData);
    console.log('Doctors Data:', doctorsData);
  }, [clinicData, doctorsData]);

  if (!clinicData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No clinic data found</Text>
      </View>
    );
  }

  const insuranceDetails = clinicData.insuranceProviders.map(id => {
    const provider = insuranceProviders.find(provider => provider._id === id);
    return provider ? { name: provider.name, icon: provider.icon } : { name: 'Unknown', icon: null };
  });

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        {currentImage ? (
          <Animated.Image
            source={{ uri: currentImage }}
            style={[styles.heroImage, { opacity: imageFadeAnim }]}
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

      {/* Description */}
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

      {/* Specialties */}
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

      {/* Insurance Providers */}
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

      {/* Working Hours */}
      <View style={styles.section}>
        <ClinicSubHeading subHeadingTitle="Working Hours" />
        <Text style={styles.workingHoursText}>
          {clinicData.workingHours.startTime} - {clinicData.workingHours.endTime}
        </Text>
      </View>

      {/* Working Days */}
      <View style={styles.section}>
        <ClinicSubHeading subHeadingTitle="Working Days" />
        <FlatList
          data={clinicData.workingDays}
          renderItem={({ item }) => (
            <View style={styles.workingDayCard}>
              <Text style={styles.workingDayText}>{item}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Medical Professionals */}
      <View style={styles.section}>
        <ClinicSubHeading subHeadingTitle="Medical Professionals" />
        <Doctors searchQuery="" excludeDoctorId={null} />
      </View>
    </ScrollView>
  );
};

export default ClinicProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundColor },
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
  workingDayCard: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  workingDayText: { fontSize: 14, color: '#555' },
  doctorCard: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  doctorImage: { width: 100, height: 100, borderRadius: 50, marginRight: 15 },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  doctorSpecialty: { fontSize: 14, color: '#777', marginBottom: 10 },
  consultButton: { backgroundColor: Colors.PRIMARY, borderRadius: 5, paddingVertical: 8, paddingHorizontal: 15 },
  consultButtonText: { color: '#fff', fontWeight: 'bold' },
  doctorsList: { paddingBottom: 15 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: 'red' },
});
