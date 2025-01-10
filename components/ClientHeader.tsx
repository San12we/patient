import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction, selectUser } from '../app/(redux)/authSlice';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Badge } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

import Colors from './Shared/Colors';

const ClientHeader: React.FC<{ title: string }> = ({ title }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const { profileImage, name, userId } = user || {};
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    return () => {
    };
  }, [userId]);

  const handleLogout = () => {
    dispatch(logoutAction());
    router.replace('/auth/login'); // Use replace instead of push to prevent going back to the previous screen
  };

  return (
    <LinearGradient
      colors={['rgba(55, 98, 122, 0.46)', 'rgba(211, 9, 177, 0.4)']} // Use the same gradient colors
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImageFallback}>
              <Text style={styles.profileInitial}>{name?.[0]}</Text>
            </View>
          )}
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.notificationButton}>
            <AntDesign name="bells" size={24} color="black" />
            {notificationCount > 0 && (
              <Badge
                value={notificationCount}
                status="error"
                containerStyle={styles.badgeContainer}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <AntDesign name="logout" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingTop: 40, // Increased padding to create space from the status bar
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileImageFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginLeft: 10,
  },
});

export default ClientHeader;
