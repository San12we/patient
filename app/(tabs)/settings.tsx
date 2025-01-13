import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  Modal,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { selectUser } from '../(redux)/authSlice';
import InsuranceScreen from '../(routes)/insurance';
import { theme } from '@/constants/theme';
import Colors from '@/components/Shared/Colors';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FormState {
  darkMode: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  location: boolean; // Add location to FormState
}

const Settings: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const insuranceProvider = useSelector((state) => state.auth.insuranceProvider); // Get insurance provider from Redux
  console.log('User Data:', user); // Log the user data
  const profileImage = user?.user?.profileImage || ''; // Handle undefined profileImage
  const userName = `${user?.user?.firstName || ''} ${user?.user?.lastName || ''}`; // Get user name
  const userEmail = user?.user?.email || ''; // Get user email
  const profileData = useSelector((state) => state.auth.profileData); // Get profile data from Redux
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
    location: false, // Initialize location state
  });
  const [isInsuranceModalVisible, setInsuranceModalVisible] = useState<boolean>(false);

  useEffect(() => {
    console.log(user);
    console.log('Profile Image:', profileImage); // Log the profile image
  }, [user]);

  const toggleInsuranceModal = () => {
    setInsuranceModalVisible(!isInsuranceModalVisible);
  };

  const navigateToEditProfile = () => {
    navigation.navigate('(routes)/EditProfile')
  }
  
  const navigateToInsuranceProvider = () => {
    navigation.navigate('(routes)/insurance/index');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.profileWrapper}>
              <TouchableOpacity
                          onPress={navigateToEditProfile}
                          style={styles.profile}>
                          <Image
                            alt=""
                            source={{
                              uri: profileImage,
                            }}
                            style={styles.profileAvatar} />
            
                          <View style={styles.profileBody}>
                            <Text style={styles.profileName}>{userName}</Text>
            
                            <Text style={styles.profileHandle}>{userEmail}</Text>
                          </View>
            
                          <FeatherIcon
                            color="#bcbcbc"
                            name="chevron-right"
                            size={22} />
                        </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

           

            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
                <FeatherIcon color="#CC4343" name="navigation" size={20} />
              </View>

              <Text style={styles.rowLabel}>Location</Text>

              <View style={styles.rowSpacer} />

              <Switch
                onValueChange={location => setForm({ ...form, location })}
                value={form.location}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
                <FeatherIcon color="#EB18EE" name="at-sign" size={20} />
              </View>

              <Text style={styles.rowLabel}>Email Notifications</Text>

              <View style={styles.rowSpacer} />

              <Switch
                onValueChange={emailNotifications =>
                  setForm({ ...form, emailNotifications })}
                value={form.emailNotifications}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
                <FeatherIcon color="#fff" name="bell" size={20} />
              </View>

              <Text style={styles.rowLabel}>Push Notifications</Text>

              <View style={styles.rowSpacer} />

              <Switch
                onValueChange={pushNotifications =>
                  setForm({ ...form, pushNotifications })}
                value={form.pushNotifications}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insurance Provider</Text>

            <TouchableOpacity
              onPress={navigateToInsuranceProvider}
              style={styles.row}
            >
              <View style={[styles.rowIcon, { backgroundColor: '#f0ad4e' }]}>
                <FeatherIcon color="#fff" name="shield" size={20} />
              </View>

              <Text style={styles.rowLabel}>
                {insuranceProvider ? insuranceProvider : 'Manage Insurance Provider'}
              </Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resources</Text>

            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={styles.row}
            >
              <View style={[styles.rowIcon, { backgroundColor: '#8e8d91' }]}>
                <FeatherIcon color="#fff" name="flag" size={20} />
              </View>

              <Text style={styles.rowLabel}>Report Bug</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
              
              }}
              style={styles.row}
            >
              <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                <FeatherIcon color="#fff" name="mail" size={20} />
              </View>

              <Text style={styles.rowLabel}>Contact Us</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={styles.row}
            >
              <View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
                <FeatherIcon color="#0CAC2D" name="star" size={20} />
              </View>

              <Text style={styles.rowLabel}>Rate in App Store</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={isInsuranceModalVisible}
          onRequestClose={toggleInsuranceModal}
        >
          <InsuranceScreen onClose={toggleInsuranceModal} />
        </Modal>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor, // Set the background color
  },
  
  /** Profile */
  profile: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    marginRight: 12,
  },
  profileBody: {
    marginRight: 'auto',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292929',
  },
  profileHandle: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '400',
    color: '#858585',
  },
 
  profileEmail: {
    fontSize: 16,
    color: Colors.primary,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 9999,
  },
  profileImageFallback: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: '#fff',
    fontSize: 16,
  },
  profileWrapper: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  /** Section */
  section: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  sectionTitle: {
    paddingVertical: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  /** Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '400',
    color: Colors.primary,
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});

export default Settings;