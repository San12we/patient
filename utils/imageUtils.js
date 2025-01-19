
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { firebase } from '../firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const pickImage = async (setSelectedImage) => {
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

export const uploadImage = async (selectedImage, setUploading) => {
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