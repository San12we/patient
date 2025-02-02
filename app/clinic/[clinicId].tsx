import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import Colors from '../../components/Shared/Colors';
import { MaterialIcons, Ionicons } from '@expo/vector-icons'; // For icons
import { setSelectedDoctor } from '../../app/(redux)/doctorSlice'; // Import the setSelectedDoctor action
import axios from 'axios'; // Import axios for API calls

const ClinicProfile: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const clinic = useSelector((state) => state.clinics.selectedClinic);

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
      dispatch(setSelectedDoctor(fullDoctorData)); // Dispatch the selected doctor with full data
      router.push(`/doctors/${doctor.id}`); // Navigate to the DoctorProfile screen using id
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Clinic Profile Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: clinic.profileImage }} style={styles.profileImage} />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Clinic Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{clinic.name}</Text>
        <Text style={styles.subtitle}>{clinic.address}</Text>
        <Text style={styles.category}>{clinic.category}</Text>

        {/* Working Hours */}
        <View style={styles.infoRow}>
          <MaterialIcons name="access-time" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            {clinic.workingHours?.startTime} - {clinic.workingHours?.endTime}
          </Text>
        </View>

        {/* Working Days */}
        <View style={styles.infoRow}>
          <MaterialIcons name="event" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>{clinic.workingDays.join(', ')}</Text>
        </View>

        {/* Insurance Providers */}
        <Text style={styles.sectionTitle}>Insurance Providers</Text>
        <FlatList
          data={clinic.insuranceProviders}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.insuranceProvider}>
              <Text style={styles.insuranceProviderText}>{item}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* Doctors List */}
        <Text style={styles.sectionTitle}>Doctors</Text>
        <FlatList
          data={clinic.doctors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.doctorCard}
              onPress={() => handleDoctorPress(item)}
              activeOpacity={0.8} // Smooth feedback on press
            >
              {/* Doctor Profile Image */}
              <Image
                source={{ uri: item.profileImage || 'https://via.placeholder.com/150' }} // Fallback image
                style={styles.doctorImage}
              />
              {/* Doctor Details */}
              <View style={styles.doctorDetails}>
                <Text style={styles.doctorName}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
              </View>
              {/* Chevron Icon */}
              <MaterialIcons name="chevron-right" size={24} color={Colors.primary} />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default ClinicProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
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
  insuranceProvider: {
    backgroundColor: Colors.lightBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  insuranceProviderText: {
    fontSize: 14,
    color: Colors.text,
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
    elevation: 3, // For Android
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