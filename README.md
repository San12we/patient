import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Colors from '../../components/Shared/Colors';
import BookingSection from '../../components/BookingSection';
import ClinicSubHeading from '@/components/clinics/ClinicSubHeading';
import Doctors from '../../components/client/Doctors';
import useSchedule from '../../hooks/useSchedule';
import useInsurance from '../../hooks/useInsurance';
import axios from 'axios';
import UserBookingSection from '../../components/UserBookingSection'; // Import UserBookingSection
import { getDoctors, setSelectedDoctor } from '../../app/(redux)/doctorSlice'; // Import actions
import { BlurView } from 'expo-blur'; // Import BlurView from expo-blur
import socket from '../../Services/socket';
import LottieView from 'lottie-react-native';

type Slot = {
  _id: string;
  startTime: string;
  endTime: boolean;
  dayOfWeek: string;
  slotId: string;
};

const DoctorProfile: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const dispatch = useDispatch();
  const router = useRouter();
  const doctor = useSelector((state) => state.doctors.selectedDoctor);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ id: string; time: string; isBooked: boolean; date: string } | null>(null);
  const userId = useSelector((state) => state.auth.user.user._id);
  const { schedule, fetchSchedule, updateSlot, loading: scheduleLoading, error } = useSchedule(doctor._id, userId);
  const { insuranceProviders } = useInsurance();
  const [availableInsurances, setAvailableInsurances] = useState<any[]>([]);
  const [selectedInsurance, setSelectedInsurance] = useState<string | undefined>(undefined);
  const [userInsurance, setUserInsurance] = useState<string | null>(null);
  const dateOptions = Array.from({ length: 7 }, (_, i) => moment().add(i, 'days').toDate());
  const [selectedDay, setSelectedDay] = useState<string>(moment().format('dddd')); // Add state for selected day
  const [isInsuranceAccepted, setIsInsuranceAccepted] = useState<boolean>(false); // Add state for insurance acceptance
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch<any>(getDoctors());
        if (!doctor) {
          router.back();
        } else {
          dispatch(setSelectedDoctor(doctor));
          await fetchSchedule();
          const response = await axios.get(`https://project03-rj91.onrender.com/insurance/user/${userId}`);
          if (response.status === 200) {
            const data = response.data;
            setUserInsurance(data.insuranceProvider);
            setIsInsuranceAccepted(availableInsurances.some((insurance) => insurance.name === data.insuranceProvider));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, doctor, router, userId, availableInsurances]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const mappedInsurances = doctor.insuranceProviders
      .map((providerId) => insuranceProviders.find((provider) => provider._id === providerId))
      .filter((provider) => provider);

    setAvailableInsurances(mappedInsurances);
  }, [doctor.insuranceProviders, insuranceProviders]);

  useEffect(() => {
    const isAccepted = availableInsurances.some((insurance) => insurance.name === userInsurance);
    if (isAccepted) {
      setSelectedInsurance(userInsurance);
    }
  }, [userInsurance, availableInsurances]);

  useEffect(() => {
    socket.on('slotUpdated', (data) => {
      console.log('Slot updated:', data);
      // Fetch the updated schedule or update the specific slot in the state
      fetchSchedule();
    });

    return () => {
      socket.off('slotUpdated');
    };
  }, [fetchSchedule]);

  useEffect(() => {
    if (loading && animation.current) {
      animation.current.play();
    }
  }, [loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          autoPlay
          ref={animation}
          style={styles.lottieAnimation}
          source={require('../../assets/animations/loading.json')}
        />
      </View>
    );
  }

  const profileImageUri =
    doctor.user?.profileImage || doctor.profileImage || 'https://res.cloudinary.com/dws2bgxg4/image/upload/v1726073012/nurse_portrait_hospital_2d1bc0a5fc.jpg';

  const specialties = doctor.professionalDetails?.customSpecializedTreatment || 'N/A';
  const specialization = doctor.professionalDetails?.specialization || 'N/A';
  const specializedTreatment = doctor.professionalDetails?.specializedTreatment || 'N/A';
  const yearsOfExperience = doctor.professionalDetails?.yearsOfExperience || 'N/A';
  const clinicName = doctor.practiceName || 'Unknown Clinic';

  const getSlotsForSelectedDate = () => {
    const dayOfWeek = moment(selectedDate).format('dddd');
    return schedule[dayOfWeek] || [];
  };

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getSlotsForSelectedDay = () => {
    const today = moment().startOf('day');
    return schedule[selectedDay]?.filter(slot => moment(`${slot.date} ${slot.startTime}`, 'YYYY-MM-DD HH:mm').isSameOrAfter(today)) || [];
  };

  const isToday = (day: string) => moment().format('dddd') === day;

  const isTodayOrFuture = (day: string) => moment(day, 'dddd').isSameOrAfter(moment(), 'day');

  const slotsForSelectedDate = getSlotsForSelectedDate();
  const slotsForSelectedDay = getSlotsForSelectedDay();

  return (
    <View style={styles.container}>
       <StatusBar barStyle="dark-content" />
        <View style={styles.heroContainer}>
          <Image source={{ uri: profileImageUri }} style={styles.heroImage} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.heroOverlay}>
            <Text style={styles.heroText}>{`${doctor.firstName} ${doctor.lastName}`}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <ClinicSubHeading subHeadingTitle={`${doctor.firstName} ${doctor.lastName}`} />
          <Text style={styles.descriptionText}>
            {doctor.bio || 'No description available'}
          </Text>
        </View>

        <View style={[styles.section, styles.horizontalSection]}>
          <View style={styles.infoCard}>
            <Ionicons name="medkit" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{specialties}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="business" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{clinicName}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="calendar" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{yearsOfExperience} years of experience</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="medkit" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{specialization}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="medkit" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{specializedTreatment}</Text>
          </View>
        </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.title}>Select a Day</Text>
          <FlatList
            horizontal
            data={weekdays}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedDay(item)}
                style={[
                  styles.dayButton,
                  selectedDay === item ? styles.selectedDayButton : null,
                  schedule[item] ? styles.availableDayButton : styles.unavailableDayButton,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDay === item ? styles.selectedDayText : null,
                    schedule[item] ? styles.availableDayText : styles.unavailableDayText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Available Slots</Text>
          {scheduleLoading ? (
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
          ) : error ? (
            <Text>Error loading schedule: {error}</Text>
          ) : slotsForSelectedDay.length > 0 ? (
            <FlatList
              horizontal
              data={slotsForSelectedDay}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => {
                const slotTime = moment(`${item.date} ${item.startTime}`, 'YYYY-MM-DD HH:mm');
                const isPast = slotTime.isBefore(moment());

                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (item.isBooked || isPast) {
                        Alert.alert(item.isBooked ? 'Slot already booked' : 'Invalid slot', item.isBooked ? 'Please choose another time slot.' : 'Cannot select a past time slot.');
                      } else {
                        setSelectedTimeSlot({ id: item._id, time: `${item.startTime} - ${item.endTime}`, date: item.date, isBooked: item.isBooked });
                      }
                    }}
                    style={[
                      styles.slotButton,
                      item.isBooked || isPast ? { backgroundColor: Colors.SECONDARY } : { backgroundColor: Colors.goofy },
                      selectedTimeSlot && selectedTimeSlot.id === item._id
                        ? { borderColor: Colors.SECONDARY, borderWidth: 2, backgroundColor: Colors.selectedBackground }
                        : {},
                    ]}
                    disabled={item.isBooked || isPast}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        selectedTimeSlot && selectedTimeSlot.id === item._id
                          ? { color: Colors.PRIMARY}
                          : {},
                      ]}
                    >
                      {`${item.startTime} - ${item.endTime}`}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <Text style={styles.noSlotsText}>The doctor is not available for the selected day.</Text>
          )}
        </View>

        {userInsurance && availableInsurances.some((insurance) => insurance.name === userInsurance) && (
          <View style={styles.section}>
            <Text style={styles.acceptedInsurancesTitle}>Accepted Insurances</Text>
            <FlatList
              data={availableInsurances}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedInsurance(item._id)}
                  style={[
                    styles.insuranceCard,
                    item._id === selectedInsurance ? styles.selectedInsuranceCard : null,
                    item.name === userInsurance ? styles.userInsuranceCard : null
                  ]}
                  disabled={item.name !== userInsurance}
                >
                  <Image source={{ uri: item.icon }} style={styles.insuranceIcon} />
                  <Text style={[
                    styles.insuranceText,
                    item._id === selectedInsurance ? styles.selectedInsuranceText : null,
                    item.name === userInsurance ? styles.userInsuranceText : null
                  ]}>{item.name}</Text>
                </TouchableOpacity>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        {isInsuranceAccepted ? (
          <UserBookingSection
            doctorId={doctor._id}
            consultationFee={doctor.consultationFee || 'N/A'}
            selectedTimeSlot={selectedTimeSlot}
            selectedInsurance={selectedInsurance}
          />
        ) : (
          <BookingSection
            doctorId={doctor._id}
            consultationFee={doctor.consultationFee || 'N/A'}
            selectedTimeSlot={selectedTimeSlot}
            selectedInsurance={selectedInsurance}
          />
        )}

        <Doctors excludeDoctorId={doctor.id} />
       
      </ScrollView>
    </View>
  );
};

export default DoctorProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f6f5', // Set the background color
  },
  scrollContainer: {
    flex: 1,
  },
  heroContainer: { position: 'relative', height: 250 },
  heroImage: { width: '100%', height: '100%' },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
    zIndex: 10,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  section: { marginVertical: 15, paddingHorizontal: 15 },
  horizontalSection: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  descriptionText: { fontSize: 16, color: '#333' },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '45%',
  },
  infoText: { marginLeft: 8, fontSize: 14, color: Colors.textPrimary },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slotButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  slotText: {
    fontSize: 14,
  },
  acceptedInsurancesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  insuranceCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  insuranceText: {
    fontSize: 16,
    color: Colors.primary,
  },
  selectedInsuranceCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  selectedInsuranceText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  userInsuranceCard: {
    borderColor: Colors.SECONDARY,
    borderWidth: 2,
  },
  userInsuranceText: {
    color: Colors.SECONDARY,
    fontWeight: 'bold',
  },
  insuranceIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  dayButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#ffffff',
  },
  selectedDayButton: {
    backgroundColor: Colors.PRIMARY,
  },
  availableDayButton: {
    backgroundColor: Colors.availableBackground,
  },
  unavailableDayButton: {
    backgroundColor: Colors.unavailableBackground,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  selectedDayText: {
    fontWeight: 'bold',
  },
  availableDayText: {
    color: Colors.availableText,
  },
  unavailableDayText: {
    color: Colors.unavailableText,
  },
  noSlotsText: {
    fontSize: 16,
    color: Colors.unavailableText,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f6f5',
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
});




<!-- notification context -->
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationContextType {
    expoPushToken: string | null;
    notification: Notifications.Notification | null;
    error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notifications.Notification | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    const sendTokenToBackend = async (token: string) => {
        try {
            const response = await fetch('https://medplus-health.onrender.com/api/push-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            if (!response.ok) {
                throw new Error('Failed to send push token to backend');
            }

            console.log('Push token sent to backend successfully');
        } catch (error) {
            console.error('Error sending push token to backend:', error);
            setError(error);
        }
    };

    const storeTokenLocally = async (token: string) => {
        try {
            await AsyncStorage.setItem('expoPushToken', token);
        } catch (error) {
            console.error('Error storing push token locally:', error);
            setError(error);
        }
    };

    const retrieveTokenLocally = async () => {
        try {
            const token = await AsyncStorage.getItem('expoPushToken');
            if (token) {
                setExpoPushToken(token);
            }
        } catch (error) {
            console.error('Error retrieving push token from local storage:', error);
            setError(error);
        }
    };

    useEffect(() => {
        retrieveTokenLocally();

        registerForPushNotificationsAsync().then(
            (token) => {
                if (token) {
                    setExpoPushToken(token);
                    storeTokenLocally(token);
                    sendTokenToBackend(token);
                }
            },
            (error) => setError(error)
        );

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            console.log("🔔 Notification Received: ", notification);
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("🔔 Notification Response: ", JSON.stringify(response, null, 2));
            // Handle the notification response here
        });

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ expoPushToken, notification, error }}>
            {children}
        </NotificationContext.Provider>
    );
};



const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();

// CORS configuration
const corsOptions = {
    origin: '*', // During development allow all origins
    methods: ['GET', 'POST'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allow credentials
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Add test endpoint
app.get('/test', (req, res) => {
    res.status(200).send('Server is running properly');
});

app.post('/send-notification', async (req, res) => {
    const { token, title, body } = req.body;

if(!token || !title || !body) {
    return res.status(400).send('Missing required fields: token, title or body');
}

const message = {
    notification:{
        title: title,
        body: body
    },
    token: token
}
try{
  const response = await admin.messaging().send(message);
  console.log('Successfully sent message:', response);
  res.status(200).send('Notification sent successfully');
} catch (error) {
    console.log('Error sending message:', error);
    res.status(500).send('Error sending notification');
}

});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    }
);


{
  "cli": {
    "version": ">= 14.4.1",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}







import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-modules-core";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => setExpoPushToken(token),
      (error) => setError(error)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("🔔 Notification Received: ", notification);
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "🔔 Notification Response: ",
          JSON.stringify(response, null, 2),
          JSON.stringify(response.notification.request.content.data, null, 2)
        );
        // Handle the notification response here
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
