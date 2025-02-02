import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction, selectUser } from '../app/(redux)/authSlice';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Badge } from 'react-native-elements';
import { theme } from '@/constants/theme'; // Import theme
import Colors from './Shared/Colors';

const ClientHeader: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const profileImage = user?.user?.profileImage; // Add optional chaining
  const name = user ? `${user?.user?.firstName} ${user?.user?.lastName}` : ''; // Add optional chaining and fallback
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    return () => {
    };
  }, [user]);



  return (
    <View style={[styles.container, { backgroundColor: '#e3f6f5'}]}>
      <View style={styles.leftSection}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImageFallback}>
            <Text style={styles.profileInitial}>{name?.[0]}</Text>
          </View>
        )}
      </View>
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
       
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    paddingTop: 20, // Increased padding to create space from the status bar
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    display: 'none', // Hide the title
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
