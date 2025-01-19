
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TextInput from './TextInput';

const ProfileForm = ({ fullName, setFullName, email, setEmail, phone, setPhone, dateOfBirth, setDateOfBirth, gender, setGender, setOpenDatePicker, handleSave }) => (
    <>
        <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput value={fullName} onChangeText={setFullName} style={styles.input} placeholder="Enter your full name" />
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
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setOpenDatePicker(true)} style={styles.datePicker}>
                <Text>{dateOfBirth}</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.formGroup}>
            <Text style={styles.label}>Gender</Text>
            <TextInput value={gender} onChangeText={setGender} style={styles.input} placeholder="Enter your gender" />
        </View>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
    </>
);

const styles = StyleSheet.create({
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

export default ProfileForm;