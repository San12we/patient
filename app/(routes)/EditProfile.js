import { StyleSheet, Text, TouchableOpacity, View, Image, Modal } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-web';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextInput from '../../components/TextInput';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AntDesign from '@expo/vector-icons/AntDesign';
const EditProfile = () => {
    const navigation = useNavigation();
    const user = useSelector((state) => state.auth.user);
    const profileImage = user?.user?.profileImage || ''; // Handle undefined profileImage
    const [selectedImage, setSelectedImage] = useState(profileImage);
    const [name, setName] = useState(`${user?.user?.firstName || ''} ${user?.user?.lastName || ''}`);
    const [email, setEmail] = useState(user?.user?.email || '');
    const [phone, setPhone] = useState(user?.user?.phoneNumber || '');
    const [addressLine, setAddressLine] = useState('');
    const [streetAndBuilding, setStreetAndBuilding] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('KEN');
    const [dob, setDob] = useState('dob');

    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const today = new Date();
    const startDate = getFormatedDate(
        today.setDate(today.getDate() + 1),
        'yyyy-MM-dd'
    );

    const [selectedStartDate, setSelectedStartDate] = useState('01/01/1990');
    const [startedDate, setStartedDate] = useState('12/12/2025');

    const handleChangeStartDate = (propDate) => {
        setStartedDate(propDate);
    };

    const handleOnPressStartDate = () => {
        setOpenStartDatePicker(!openStartDatePicker);
    };

    const handleImageSelection = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    function renderDatePicker() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={openStartDatePicker}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            margin: 20,
                            backgroundColor: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '90%',
                            borderRadius: 20,
                            padding: 35,
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}
                    >
                        <DatePicker
                            mode="calendar"
                            minimumDate={startDate}
                            selected={startedDate}
                            onDateChanged={handleChangeStartDate}
                            onSelectedChange={(date) => setSelectedStartDate(date)}
                            options={{
                                backgroundColor: '#6200ea',
                                textHeaderColor: '#fff',
                                textDefaultColor: '#f0f0f0',
                                selectedTextColor: '#fff',
                                mainColor: '#6200ea',
                                textSecondaryColor: '#f0f0f0',
                                borderColor: '#6200ea',
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => setOpenStartDatePicker(false)}
                            style={{
                                marginTop: 20,
                                backgroundColor: '#6200ea',
                                padding: 10,
                                borderRadius: 5,
                            }}
                        >
                            <Text style={{ color: 'white' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <AntDesign name="left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={handleImageSelection}>
                        <Image source={{ uri: selectedImage }} style={styles.profileImage} />
                    </TouchableOpacity>
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Enter your full name" />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="Enter your email" />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Phone</Text>
                    <TextInput value={phone} onChangeText={setPhone} style={styles.input} placeholder="Enter your phone number" />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Address Line</Text>
                    <TextInput value={addressLine} onChangeText={setAddressLine} style={styles.input} placeholder="Enter addressee line" />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Street and Building Number</Text>
                    <TextInput value={streetAndBuilding} onChangeText={setStreetAndBuilding} style={styles.input} placeholder="Enter street and building number" />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>City</Text>
                    <TextInput value={city} onChangeText={setCity} style={styles.input} placeholder="Enter city" />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Postal Code</Text>
                    <TextInput value={postalCode} onChangeText={setPostalCode} style={styles.input} placeholder="Enter postal code" />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Country</Text>
                    <TextInput value={country} onChangeText={setCountry} style={styles.input} editable={false} placeholder="KEN" />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Date of Birth</Text>
                    <TouchableOpacity onPress={handleOnPressStartDate} style={styles.datePicker}>
                        <Text>{selectedStartDate}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                {renderDatePicker()}
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
});

export default EditProfile;


