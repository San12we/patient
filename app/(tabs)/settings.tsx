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
import InsuranceScreen from '../insurance';
import { theme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface FormState {
  darkMode: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user.user);
  const profileData = useSelector((state) => state.auth.profileData); // Get profile data from Redux
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
  });
  const [isInsuranceModalVisible, setInsuranceModalVisible] = useState<boolean>(false);

  useEffect(() => {
    console.log(user);
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
          <View style={styles.section}>
            <Text style={styles.rowLabel}>Patient Profile</Text>
            <TouchableOpacity onPress={() => router.push('/profile')} style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: '#007bff' }]}>
                {user.profileImage ? (
                  <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
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
              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                <FeatherIcon color="#fff" name="moon" size={20} />
              </View>

              <Text style={styles.rowLabel}>Dark Mode</Text>

              <View style={styles.rowSpacer} />

              <Switch
                onValueChange={darkMode => setForm({ ...form, darkMode })}
                value={form.darkMode}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                
              }}
              style={styles.row}
            >
              <View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
                <FeatherIcon color="#fff" name="navigation" size={20} />
              </View>

              <Text style={styles.rowLabel}>Location</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>

            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
                <FeatherIcon color="#fff" name="at-sign" size={20} />
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
                <FeatherIcon color="#fff" name="star" size={20} />
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
    color: '#0c0c0c',
  },
  profileEmail: {
    fontSize: 16,
    color: '#989898',
  },
  /** Section */
  section: {
    paddingHorizontal: 10,
  },
  sectionTitle: {
    paddingVertical: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#9e9e9e',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  /** Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    backgroundColor: '#f2f2f2',
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
    color: '#0c0c0c',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});

export default Settings;