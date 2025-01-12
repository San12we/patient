import { StyleSheet, Text, TouchableOpacity, View, Image, Modal } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-web';
import * as ImagePicker from 'expo-image-picker';
import { imagesDataURL } from '../../constants/data';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextInput from '../../components/TextInput';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import { useNavigation } from '@react-navigation/native';

const EditProfile = () => {
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState(imagesDataURL[0]);
    const [name, setName] = useState('name');
    const [email, setEmail] = useState('email');
    const [phone, setPhone] = useState('phone');
    const [address, setAddress] = useState('address');
    const [city, setCity] = useState('city');
    const [state, setState] = useState('state');
    const [zip, setZip] = useState('zip');
    const [country, setCountry] = useState('country');
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
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#fff',
                paddingHorizontal: 22,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: 12,
                    marginVertical: 10,
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        backgroundColor: '#6200ea',
                        padding: 10,
                        borderRadius: 5,
                    }}
                >
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}
                    >
                        Edit Profile
                    </Text>
                </View>
            </View>
            <ScrollView>
                <View
                    style={{
                        alignItems: 'center',
                        marginVertical: 22,
                    }}
                >
                    <TouchableOpacity onPress={handleImageSelection}>
                        <Image
                            source={{ uri: selectedImage }}
                            style={{
                                width: 170,
                                height: 170,
                                borderRadius: 85,
                                borderWidth: 2,
                                borderColor: '#6200ea',
                            }}
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flexDirection: 'column',
                        marginBottom: 6,
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Name</Text>
                    <View
                        style={{
                            height: 50,
                            width: '100%',
                            borderColor: '#6200ea',
                            borderWidth: 1,
                            borderRadius: 5,
                            marginVertical: 6,
                            justifyContent: 'center',
                            paddingLeft: 8,
                        }}
                    >
                        <TextInput
                            value={name}
                            onChangeText={(value) => setName(value)}
                            editable={true}
                        />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Email</Text>
                    <View
                        style={{
                            height: 50,
                            width: '100%',
                            borderColor: '#6200ea',
                            borderWidth: 1,
                            borderRadius: 5,
                            marginVertical: 6,
                            justifyContent: 'center',
                            paddingLeft: 8,
                        }}
                    >
                        <TextInput
                            value={email}
                            onChangeText={(value) => setEmail(value)}
                            editable={true}
                        />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Phone</Text>
                    <View
                        style={{
                            height: 50,
                            width: '100%',
                            borderColor: '#6200ea',
                            borderWidth: 1,
                            borderRadius: 5,
                            marginVertical: 6,
                            justifyContent: 'center',
                            paddingLeft: 8,
                        }}
                    >
                        <TextInput
                            value={phone}
                            onChangeText={(value) => setPhone(value)}
                            editable={true}
                        />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Address</Text>
                    <View
                        style={{
                            height: 50,
                            width: '100%',
                            borderColor: '#6200ea',
                            borderWidth: 1,
                            borderRadius: 5,
                            marginVertical: 6,
                            justifyContent: 'center',
                            paddingLeft: 8,
                        }}
                    >
                        <TextInput
                            value={address}
                            onChangeText={(value) => setAddress(value)}
                            editable={true}
                        />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>City</Text>
                    <View
                        style={{
                            height: 50,
                            width: '100%',
                            borderColor: '#6200ea',
                            borderWidth: 1,
                            borderRadius: 5,
                            marginVertical: 6,
                            justifyContent: 'center',
                            paddingLeft: 8,
                        }}
                    >
                        <TextInput
                            value={city}
                            onChangeText={(value) => setCity(value)}
                            editable={true}
                        />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>State</Text>
                    <View
                        style={{
                            height: 50,
                            width: '100%',
                            borderColor: '#6200ea',
                            borderWidth: 1,
                            borderRadius: 5,
                            marginVertical: 6,
                            justifyContent: 'center',
                            paddingLeft: 8,
                        }}
                    >
                        <TextInput
                            value={state}
                            onChangeText={(value) => setState(value)}
                            editable={true}
                        />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Zip</Text>
                    <View
                        style={{
                            height: 50,
                            width: '100%',
                            borderColor: '#6200ea',
                            borderWidth: 1,
                            borderRadius: 5,
                            marginVertical: 6,
                            justifyContent: 'center',
                            paddingLeft: 8,
                        }}
                    >
                        <TextInput
                            value={zip}
                            onChangeText={(value) => setZip(value)}
                            editable={true}
                        />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Country</Text>
                    <View
                        style={{
                            height: 50,
                            width: '100%',
                            borderColor: '#6200ea',
                            borderWidth: 1,
                            borderRadius: 5,
                            marginVertical: 6,
                            justifyContent: 'center',
                            paddingLeft: 8,
                        }}
                    >
                        <TextInput
                            value={country}
                            onChangeText={(value) => setCountry(value)}
                            editable={true}
                        />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Date of Birth</Text>
                    <TouchableOpacity
                        onPress={handleOnPressStartDate}
                        style={{
                            height: 50,
                            width: '100%',
                            borderColor: '#6200ea',
                            borderWidth: 1,
                            borderRadius: 5,
                            marginVertical: 6,
                            justifyContent: 'center',
                            paddingLeft: 8,
                        }}
                    >
                        <Text>{selectedStartDate}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        backgroundColor: '#6200ea',
                        height: 50,
                        borderRadius: 6,
                        alignItems: 'center',
                        justifyContent: 'center',
                    marginVertical: 10,
                    }}
                >
                    <Text style={{ color: 'white', textAlign: 'center' }}>Save</Text>
                </TouchableOpacity>
                {renderDatePicker()}
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfile;


