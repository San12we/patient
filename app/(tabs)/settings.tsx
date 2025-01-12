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
import { selectUser } from '../(redux)/authSlice';
import InsuranceScreen from '../(routes)/insurance';
import { theme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/components/Shared/Colors';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

interface FormState {
  darkMode: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  location: boolean; // Add location to FormState
}

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user.user);
  const profileImage = user.profileImage; // Get profile image from user object
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

  return (
    <LinearGradient
      colors={['rgba(55, 98, 122, 0.46)', 'rgba(211, 9, 177, 0.4)']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.profileWrapper}>
            <TouchableOpacity onPress={() => router.push('/profile')} style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: '#007bff' }]}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profileImageFallback}>
                    <Text style={styles.profileInitial}>{user.firstName?.[0]}</Text>
                  </View>
                )}
              </View>
              <View>
                <Text style={styles.profileName}>{user.firstName} {user.lastName}</Text>
                <Text style={styles.profileEmail}>{user.email}</Text>
              </View>
              <View style={styles.rowSpacer} />
              <FeatherIcon color="#0CAC2D" name="chevron-right" size={20} />
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  /** Profile */
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 9999,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '400',
    color: Colors.primary,
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