import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileImage, updateProfile } from '../app/(redux)/authSlice';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dws2bgxg4/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'medplus';

const usePatientProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [patientProfile, setPatientProfile] = useState({
    fullName: `${user?.firstName || ""} ${user?.lastName || ""}`,
    dateOfBirth: user?.dateOfBirth || "",
    gender: user?.gender || "",
    phoneNumber: user?.phoneNumber || "",
    insuranceProvider: user?.insuranceProvider || "",
    picture: '',
  });

  const [preferences, setPreferences] = useState({
    emergencyContact: '',
    preferredClinic: '',
    ambulanceContact: '',
    emailNotifications: true,
    pushNotifications: false,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchPatientProfile = async () => {
      if (!user || !user.token) {
        console.error('User or user token is null');
        return;
      }
      try {
        const response = await fetch('https://project03-rj91.onrender.com/api/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const profile = data.user;

          if (isMounted && profile) {
            setPatientProfile({
              fullName: `${profile.firstName} ${profile.lastName}`,
              dateOfBirth: profile.dateOfBirth || "",
              gender: profile.gender || "",
              phoneNumber: profile.phoneNumber || "",
              insuranceProvider: profile.insuranceProvider || "",
              picture: profile.picture || '',
            });

            setPreferences({
              emergencyContact: profile.preferences.emergencyContact || '',
              preferredClinic: profile.preferences.preferredClinic || '',
              ambulanceContact: profile.preferences.ambulanceContact || '',
              emailNotifications: profile.preferences.emailNotifications !== undefined ? profile.preferences.emailNotifications : true,
              pushNotifications: profile.preferences.pushNotifications !== undefined ? profile.preferences.pushNotifications : false,
            });

            dispatch(updateProfile(profile));
          } else {
            console.error('Profile is null');
          }
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (user && user.token) {
      fetchPatientProfile();
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [user?.token, dispatch]);

  const handleProfileChange = (key, value) => {
    const updatedProfile = { ...patientProfile, [key]: value };
    setPatientProfile(updatedProfile);
    saveProfile(updatedProfile, preferences);
  };

  const handlePreferenceChange = (key, value) => {
    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);
    AsyncStorage.setItem('preferences', JSON.stringify(updatedPreferences));
    saveProfile(patientProfile, updatedPreferences);
  };

  const saveProfile = async (profile, preferences) => {
    const payload = {
      userId: user.userId,
      fullName: profile.fullName,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      phoneNumber: profile.phoneNumber,
      insuranceProvider: profile.insuranceProvider,
      preferences: {
        emergencyContact: preferences.emergencyContact,
        preferredClinic: preferences.preferredClinic,
        ambulanceContact: preferences.ambulanceContact,
        emailNotifications: preferences.emailNotifications,
        pushNotifications: preferences.pushNotifications,
      },
    };

    try {
      const response = await fetch('https://project03-rj91.onrender.com/api/users/updatePatientProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Profile updated successfully:', data.message);
      } else {
        const errorData = await response.json();
        console.error('Failed to update profile:', errorData.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const resizeImage = async (uri) => {
    const result = await ImageManipulator.manipulateAsync(uri, [
      { resize: { width: 800 } },
    ]);
    return result.uri;
  };

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const resizedUri = await resizeImage(result.assets[0].uri);
      try {
        const imageUrl = await uploadImageToCloudinary(resizedUri);
        await AsyncStorage.setItem('profileImage', imageUrl);
        dispatch(setProfileImage(imageUrl));
        setPatientProfile((prevProfile) => ({
          ...prevProfile,
          picture: imageUrl,
        }));
        alert('Image uploaded successfully!');
      } catch (error) {
        console.error('Error uploading images:', error);
        alert('An error occurred while uploading images');
      }
    }
  }, [dispatch]);

  const uploadImageToCloudinary = async (imageUri) => {
    const data = new FormData();
    const response = await fetch(imageUri);
    const blob = await response.blob();

    data.append('file', blob);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    data.append('quality', 'auto');
    data.append('fetch_format', 'auto');

    try {
      const uploadResponse = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: data,
      });
      const result = await uploadResponse.json();
      return result.secure_url;
    } catch (uploadError) {
      console.error('Error uploading image to Cloudinary:', uploadError);
      throw uploadError;
    }
  };

  return {
    patientProfile,
    preferences,
    handleProfileChange,
    handlePreferenceChange,
    pickImage,
  };
};

export default usePatientProfile;
