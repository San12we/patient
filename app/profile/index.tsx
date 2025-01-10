import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Alert } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import usePatientProfile from '../../hooks/usePatientProfile';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../(redux)/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { patientProfile, pickImage } = usePatientProfile();
  const profileData = useSelector((state) => state.auth.profileData); // Get profile data from Redux
  const [fullName, setFullName] = useState(profileData?.fullName || '');
  const [dob, setDob] = useState(profileData?.dob ? new Date(profileData.dob) : new Date());
  const [gender, setGender] = useState(profileData?.gender || '');
  const [phoneNumber, setPhoneNumber] = useState(profileData?.phoneNumber || '');
  const [address, setAddress] = useState(profileData?.address || {
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [emergencyContact, setEmergencyContact] = useState(profileData?.emergencyContact || '');
  const [editingField, setEditingField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showEmergencyContact, setShowEmergencyContact] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedProfileData = await AsyncStorage.getItem('profileData');
        if (storedProfileData) {
          const parsedProfileData = JSON.parse(storedProfileData);
          setFullName(parsedProfileData.fullName);
          setDob(new Date(parsedProfileData.dob));
          setGender(parsedProfileData.gender);
          setPhoneNumber(parsedProfileData.phoneNumber);
          setAddress(parsedProfileData.address);
          setEmergencyContact(parsedProfileData.emergencyContact);
        }
      } catch (error) {
        console.error('Failed to load profile data', error);
      }
    };
    loadProfileData();
  }, []);

  const saveProfileData = async (updatedData) => {
    try {
      await AsyncStorage.setItem('profileData', JSON.stringify(updatedData));
      dispatch(updateProfile(updatedData));
    } catch (error) {
      console.error('Failed to save profile data', error);
    }
  };

  const handleEdit = (field) => {
    setEditingField(editingField === field ? null : field);
  };

  const handleSave = (field, value) => {
    setLoading(true);
    const updatedData = {
      fullName,
      dob,
      gender,
      phoneNumber,
      address,
      emergencyContact,
    };
    switch (field) {
      case 'fullName':
        updatedData.fullName = value;
        setFullName(value);
        break;
      case 'dob':
        updatedData.dob = new Date(value);
        setDob(new Date(value));
        break;
      case 'gender':
        updatedData.gender = value;
        setGender(value);
        break;
      case 'phoneNumber':
        updatedData.phoneNumber = value;
        setPhoneNumber(value);
        break;
      case 'emergencyContact':
        updatedData.emergencyContact = value;
        setEmergencyContact(value);
        break;
      case 'street':
        updatedData.address.street = value;
        setAddress({ ...address, street: value });
        break;
      case 'city':
        updatedData.address.city = value;
        setAddress({ ...address, city: value });
        break;
      case 'state':
        updatedData.address.state = value;
        setAddress({ ...address, state: value });
        break;
      case 'zipCode':
        updatedData.address.zipCode = value;
        setAddress({ ...address, zipCode: value });
        break;
      default:
        break;
    }
    saveProfileData(updatedData);
    setLoading(false);
    setEditingField(null);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setDob(currentDate);
    handleSave('dob', currentDate);
  };

  const toggleSection = (section) => {
    if (section === 'personal') {
      setShowPersonalInfo(!showPersonalInfo);
      setShowAddress(false);
      setShowEmergencyContact(false);
    } else if (section === 'address') {
      setShowAddress(!showAddress);
      setShowPersonalInfo(false);
      setShowEmergencyContact(false);
    } else if (section === 'emergency') {
      setShowEmergencyContact(!showEmergencyContact);
      setShowPersonalInfo(false);
      setShowAddress(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: 40 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FeatherIcon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
       
      </View>
      <View style={styles.profileSection}>
        <View style={styles.profileBackground}>
          <TouchableOpacity style={styles.profileImageWrapper} onPress={pickImage}>
            {patientProfile.picture ? (
              <Image source={{ uri: patientProfile.picture }} style={styles.profileImage} />
            ) : (
              <FeatherIcon name="camera" size={50} color="#ccc" />
            )}
            <View style={styles.editIconWrapper}>
              <FeatherIcon name="edit-3" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.sectionContainer}>
          <TouchableOpacity onPress={() => toggleSection('personal')}>
            <View style={styles.sectionHeader}>
              <FeatherIcon name="user" size={20} color="#007bff" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <FeatherIcon name={showPersonalInfo ? "chevron-up" : "chevron-down"} size={20} color="#007bff" />
            </View>
          </TouchableOpacity>
          {showPersonalInfo && (
            <>
              <EditableField
                value={fullName}
                isEditing={editingField === 'fullName'}
                onEdit={() => handleEdit('fullName')}
                onSave={(value) => handleSave('fullName', value)}
                iconColor="#007bff"
                iconName="user"
                label="Full Name"
              />
              <EditableField
                value={dob.toDateString()}
                isEditing={editingField === 'dob'}
                onEdit={() => setShowDatePicker(true)}
                onSave={(value) => handleSave('dob', value)}
                iconColor="#ff6347"
                iconName="calendar"
                label="Date of Birth"
              />
              {showDatePicker && (
                <DateTimePicker
                  value={dob}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.inputWrapper}>
                  <View style={[styles.inputIconWrapper, { backgroundColor: '#32c759' }]}>
                    <FeatherIcon name="user-check" size={20} color="#fff" />
                  </View>
                  <Picker
                    selectedValue={gender}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleSave('gender', itemValue)}
                  >
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View>
              </View>
              <EditableField
                value={phoneNumber}
                isEditing={editingField === 'phoneNumber'}
                onEdit={() => handleEdit('phoneNumber')}
                onSave={(value) => handleSave('phoneNumber', value)}
                iconColor="#007afe"
                iconName="phone"
                label="Phone Number"
              />
            </>
          )}
        </View>
        <View style={styles.sectionContainer}>
          <TouchableOpacity onPress={() => toggleSection('address')}>
            <View style={styles.sectionHeader}>
              <FeatherIcon name="map-pin" size={20} color="#007bff" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Address</Text>
              <FeatherIcon name={showAddress ? "chevron-up" : "chevron-down"} size={20} color="#007bff" />
            </View>
          </TouchableOpacity>
          {showAddress && (
            <>
              <EditableField
                value={address.street}
                isEditing={editingField === 'street'}
                onEdit={() => handleEdit('street')}
                onSave={(value) => handleSave('street', value)}
                iconColor="#007bff"
                iconName="map-pin"
                label="Street"
              />
              <EditableField
                value={address.city}
                isEditing={editingField === 'city'}
                onEdit={() => handleEdit('city')}
                onSave={(value) => handleSave('city', value)}
                iconColor="#fe9400"
                iconName="map"
                label="City"
              />
              <EditableField
                value={address.state}
                isEditing={editingField === 'state'}
                onEdit={() => handleEdit('state')}
                onSave={(value) => handleSave('state', value)}
                iconColor="#32c759"
                iconName="map"
                label="State"
              />
              <EditableField
                value={address.zipCode}
                isEditing={editingField === 'zipCode'}
                onEdit={() => handleEdit('zipCode')}
                onSave={(value) => handleSave('zipCode', value)}
                iconColor="#007afe"
                iconName="map-pin"
                label="Zip Code"
              />
            </>
          )}
        </View>
        <View style={styles.sectionContainer}>
          <TouchableOpacity onPress={() => toggleSection('emergency')}>
            <View style={styles.sectionHeader}>
              <FeatherIcon name="phone-call" size={20} color="#007bff" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Emergency Contact</Text>
              <FeatherIcon name={showEmergencyContact ? "chevron-up" : "chevron-down"} size={20} color="#007bff" />
            </View>
          </TouchableOpacity>
          {showEmergencyContact && (
            <EditableField
              value={emergencyContact}
              isEditing={editingField === 'emergencyContact'}
              onEdit={() => handleEdit('emergencyContact')}
              onSave={(value) => handleSave('emergencyContact', value)}
              iconColor="#ff6347"
              iconName="phone-call"
              label="Emergency Contact"
            />
          )}
        </View>
        <View style={styles.sectionContainer}>
          <TouchableOpacity style={styles.navigationButton} onPress={() => router.push('/insurance')}>
            <Text style={styles.navigationButtonText}>Insurance Provider</Text>
            <FeatherIcon name="chevron-right" size={20} color="#007bff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const EditableField = ({ value, isEditing, onEdit, onSave, iconColor, iconName, label }) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleBlur = () => {
    onSave(inputValue);
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <View style={[styles.inputIconWrapper, { backgroundColor: iconColor }]}>
          <FeatherIcon name={iconName} size={20} color="#fff" />
        </View>
        <Text style={styles.inputLabel}>{label}</Text>
        <Text style={styles.inputValue}>{value || `Enter ${label}`}</Text>
        <TouchableOpacity onPress={onEdit}>
          <FeatherIcon name="edit-3" size={20} color={iconColor} />
        </TouchableOpacity>
      </View>
      {isEditing && (
        <TextInput
          style={styles.input}
          placeholder={`Enter ${label}`}
          value={inputValue}
          onChangeText={setInputValue}
          onBlur={handleBlur}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f39a',
    // paddingTop: 40 is moved to the SafeAreaView inline style
  },
  scrollViewContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'sticky',
    top: 0,
    backgroundColor: '#e0f7fa',
    zIndex: 1,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileBackground: {
    backgroundColor: '#e8f4ff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#007bff',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  editIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007bff',
    borderRadius: 12,
    padding: 4,
  },
  inputContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 12, // Reduced padding
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 10, // Add margin to the sides
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 14, // Reduced font size
    fontWeight: '500', // Reduced font weight
    color: '#333',
    marginBottom: 0, // Remove margin below the label
    flex: 1, // Allow label to take up available space
  },
  inputValue: {
    fontSize: 14, // Reduced font size
    color: '#555',
    flex: 2, // Allow value to take up more space
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8, // Reduced padding
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16, // Reduced font size
    fontWeight: '500', // Reduced font weight
    marginVertical: 8,
    color: '#333',
    marginHorizontal: 10, // Add margin to the sides
  },
  picker: {
    height: 50,
    width: '100%',
  },
  sectionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  sectionLinkText: {
    fontSize: 16,
    color: '#007bff',
  },
  saveIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#7FFFD4',
    marginHorizontal: 8,
  },
  navigationButtonText: {
    fontSize: 16,
    color: '#007bff',
    marginHorizontal: 8,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default ProfileScreen;