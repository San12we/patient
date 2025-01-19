import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import { useSelector } from 'react-redux';
import * as FileSystem from 'expo-file-system';
import { firebase } from '../../../firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import TextInput from '@/components/TextInput';

const EditProfile = () => {
    const navigation = useNavigation();
    const user = useSelector((state) => state.auth.user.user);
    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>User not found. Please log in again.</Text>
            </View>
        );
    }

    const userId = user._id;
    const [selectedImage, setSelectedImage] = useState('https://res.cloudinary.com/dws2bgxg4/image/upload/v1736613654/medplus/w1s2xd3oae7o1dn5fbxo.png');
    const [fullName, setFullName] = useState('John Doe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [phone, setPhone] = useState('1234567890');
    const [dateOfBirth, setDateOfBirth] = useState(new Date('1990-01-01'));
    const [gender, setGender] = useState('Male');
    const [address, setAddress] = useState({
        street: '123 Main St',
        city: 'Nairobi',
        state: 'Nairobi',
        postalCode: '00100',
        country: 'KEN'
    });
    const [emergencyContact, setEmergencyContact] = useState({
        name: 'Jane Doe',
        relationship: 'Sister',
        phone: '0987654321'
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [activeSection, setActiveSection] = useState('profile');
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const uploadImage = async () => {
        setUploading(true);
        try {
            const { uri } = await FileSystem.getInfoAsync(selectedImage);
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => resolve(xhr.response);
                xhr.onerror = (e) => reject(new TypeError('Network request failed'));
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });

            const filename = selectedImage.substring(selectedImage.lastIndexOf('/') + 1);
            const ref = firebase.storage().ref().child(filename);
            await ref.put(blob);
            blob.close();

            const url = await ref.getDownloadURL();
            setSelectedImage(url);
            await AsyncStorage.setItem('profileImage', url);

            Alert.alert('Profile image uploaded successfully');
            return url;
        } catch (error) {
            Alert.alert('Image upload failed');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
      
        const imageUrl = await uploadImage();
        if (!imageUrl) return;

        const data = {
            fullName,
            email,
            phone,
            dateOfBirth: dateOfBirth.toISOString().split('T')[0],
            gender,
            address,
            emergencyContact,
            profilePicture: imageUrl,
        };

        try {
            const response = await axios.put(`https://medplus-health.onrender.com/api/patients/${userId}`, data);
            Alert.alert('Success', 'Profile updated successfully');
            console.log(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(false);
        setDateOfBirth(currentDate);
    };

    const handleAddressChange = (field, value) => {
        setAddress({ ...address, [field]: value });
    };

    const handleEmergencyContactChange = (field, value) => {
        setEmergencyContact({ ...emergencyContact, [field]: value });
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput value={fullName} onChangeText={setFullName} style={styles.input} placeholder="Enter your full name" errorText={null} description={null} />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="Enter your email" errorText={null} description={null} />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Phone</Text>
                            <TextInput value={phone} onChangeText={setPhone} style={styles.input} placeholder="Enter your phone number" errorText={null} description={null} />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Date of Birth</Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
                                <Text>{dateOfBirth.toDateString()}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={dateOfBirth}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                />
                            )}
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Gender</Text>
                            <TextInput value={gender} onChangeText={setGender} style={styles.input} placeholder="Enter your gender" errorText={null} description={null} />
                        </View>
                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </>
                );
            case 'address':
                return (
                    <>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Street</Text>
                            <TextInput value={address.street} onChangeText={(value) => handleAddressChange('street', value)} style={styles.input} placeholder="Enter street" errorText={null} description={null} />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>City</Text>
                            <TextInput value={address.city} onChangeText={(value) => handleAddressChange('city', value)} style={styles.input} placeholder="Enter city" errorText={null} description={null} />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>State</Text>
                            <TextInput value={address.state} onChangeText={(value) => handleAddressChange('state', value)} style={styles.input} placeholder="Enter state" errorText={null} description={null} />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Postal Code</Text>
                            <TextInput value={address.postalCode} onChangeText={(value) => handleAddressChange('postalCode', value)} style={styles.input} placeholder="Enter postal code" errorText={null} description={null} />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Country</Text>
                            <TextInput value={address.country} onChangeText={(value) => handleAddressChange('country', value)} style={styles.input} editable={false} placeholder="KEN" errorText={null} description={null} />
                        </View>
                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </>
                );
            case 'contact':
                return (
                    <>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Emergency Contact Name</Text>
                            <TextInput value={emergencyContact.name} onChangeText={(value) => handleEmergencyContactChange('name', value)} style={styles.input} placeholder="Enter emergency contact name" errorText={null} description={null} />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Emergency Contact Relationship</Text>
                            <TextInput value={emergencyContact.relationship} onChangeText={(value) => handleEmergencyContactChange('relationship', value)} style={styles.input} placeholder="Enter relationship" errorText={null} description={null} />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Emergency Contact Phone</Text>
                            <TextInput value={emergencyContact.phone} onChangeText={(value) => handleEmergencyContactChange('phone', value)} style={styles.input} placeholder="Enter phone number" errorText={null} description={null} />
                        </View>
                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#6200ea" barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AntDesign name="left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={pickImage}>
                        <Image source={{ uri: selectedImage }} style={styles.profileImage} />
                    </TouchableOpacity>
                </View>
                <View style={styles.sectionTabs}>
                    <TouchableOpacity
                        onPress={() => setActiveSection('profile')}
                        style={styles.sectionTab}
                    >
                        <Text style={styles.sectionTabText}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveSection('address')}
                        style={styles.sectionTab}
                    >
                        <Text style={styles.sectionTabText}>Address</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveSection('contact')}
                        style={styles.sectionTab}
                    >
                        <Text style={styles.sectionTabText}>Contact</Text>
                    </TouchableOpacity>
                </View>
                {renderSection()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 22,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
        marginVertical: 10,
    },
    backButton: {
        padding: 10,
        borderRadius: 5,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollView: {
        paddingBottom: 20,
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 22,
    },
    profileImage: {
        width: 170,
        height: 170,
        borderRadius: 85,
        borderWidth: 2,
        borderColor: '#6200ea',
    },
    sectionTabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    sectionTab: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#6200ea',
    },
    sectionTabText: {
        color: 'white',
        fontWeight: 'bold',
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: '#6200ea',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 8,
    },
    datePicker: {
        height: 50,
        borderColor: '#6200ea',
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        paddingLeft: 8,
    },
    saveButton: {
        backgroundColor: '#6200ea',
        height: 50,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    saveButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
    },
});

export default EditProfile;


