import React, { useState, useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Switch,
  Image,
  ScrollView,
  Button,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import FeatherIcon from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const spacing = 10;
const _color = "#ececec";
const _borderRadius = 16;
const _startHour = 8;
const _damping = 14;
const _entering = FadeInDown.springify().damping(_damping);
const _exiting = FadeOut.springify().damping(_damping);
const _layout = LinearTransition.springify().damping(_damping);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function Hourblock({ block }: { block: string }) {
  return (
    <View style={styles.hourBlock}>
      <Text>{block}</Text>
    </View>
  );
}

const updateSlot = async (userId: string, slotId: string, slotData: any) => {
  try {
    const response = await fetch('https://medplus-health.onrender.com/schedules/updateSlot', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, slotId, slotData }),
    });

    if (!response.ok) {
      alert('Failed to update slot');
    }
  } catch (error) {
    console.error('Error updating slot:', error);
    alert('An error occurred while updating slot');
  }
};

const toggleAvailability = (userId: string, slotId: string, setSchedules: any) => {
  setSchedules((prev: any) => {
    const updatedSlots = prev.map((slot: any) => {
      if (slot.slotId === slotId) {
        const updatedSlot = { ...slot, isAvailable: !slot.isAvailable };
        updateSlot(userId, slot.slotId, updatedSlot);
        return updatedSlot;
      }
      return slot;
    });
    return updatedSlots;
  });
};

function DayBlock({ userId, day, schedules, setSchedules }: { userId: string; day: string; schedules: any; setSchedules: any }) {
  const slots = schedules.filter((slot: any) => slot.dayOfWeek === day);
  const [recurrence, setRecurrence] = useState('None');

  const addSlot = () => {
    setSchedules((prev: any) => {
      const updatedSlots = [...prev];
      const nextSlot = {
        slotId: new Date().getTime().toString(), // Generate a unique slotId
        dayOfWeek: day,
        startTime: `${_startHour + slots.length}:00`,
        endTime: `${_startHour + slots.length + 1}:00`,
        isAvailable: true,
        isBookable: true,
        recurrence: recurrence,
      };

      updatedSlots.push(nextSlot);
      return updatedSlots;
    });

    // If recurrence is daily, add slots to consecutive days
    if (recurrence === 'Daily') {
      const dayIndex = weekDays.indexOf(day);
      for (let i = 1; i < 7; i++) {
        const nextDay = weekDays[(dayIndex + i) % 7];
        setSchedules((prev: any) => {
          const updatedSlots = [...prev];
          const nextSlot = {
            slotId: new Date().getTime().toString(), // Generate a unique slotId
            dayOfWeek: nextDay,
            startTime: `${_startHour + slots.length}:00`,
            endTime: `${_startHour + slots.length + 1}:00`,
            isAvailable: true,
            isBookable: true,
            recurrence: recurrence,
          };

          updatedSlots.push(nextSlot);
          return updatedSlots;
        });
      }
    }
  };

  const removeSlot = (slotId: string) => {
    setSchedules((prev: any) => {
      const updatedSlots = prev.filter((slot: any) => slot.slotId !== slotId);
      return updatedSlots;
    });
  };

  return (
    <Animated.View style={styles.dayBlockContainer} entering={_entering} exiting={_exiting} layout={_layout}>
      <View style={styles.recurrenceContainer}>
        <Text>Recurrence:</Text>
        <TouchableOpacity onPress={() => setRecurrence('None')}>
          <Text style={recurrence === 'None' ? styles.selectedRecurrence : styles.recurrenceOption}>None</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRecurrence('Daily')}>
          <Text style={recurrence === 'Daily' ? styles.selectedRecurrence : styles.recurrenceOption}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRecurrence('Weekly')}>
          <Text style={recurrence === 'Weekly' ? styles.selectedRecurrence : styles.recurrenceOption}>Weekly</Text>
        </TouchableOpacity>
      </View>
      {slots.map((slot: any, index: number) => (
        <Animated.View
          key={`slot-${index}`}
          style={styles.dayBlockRow}
          entering={_entering}
          exiting={_exiting}
          layout={_layout}
        >
          <Text>From:</Text>
          <Hourblock block={slot.startTime} />
          <Text>To:</Text>
          <Hourblock block={slot.endTime} />
          <Pressable onPress={() => removeSlot(slot.slotId)}>
            <View style={styles.removeButton}>
              <Ionicons name="close" size={20} color="black" />
            </View>
          </Pressable>
          <Pressable onPress={() => toggleAvailability(userId, slot.slotId, setSchedules)}>
            <View style={styles.toggleButton}>
              <Ionicons name={slot.isAvailable ? "checkmark" : "close"} size={20} color="black" />
            </View>
          </Pressable>
        </Animated.View>
      ))}
      <AnimatedPressable layout={_layout} onPress={addSlot}>
        <View style={styles.addHourButton}>
          <Image source={{ uri: 'plusImg' }} style={styles.addHourIcon} />
          <Text>Add Slot</Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

function Day({ userId, day, schedules, setSchedules }: { userId: string; day: string; schedules: any; setSchedules: any }) {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    if (schedules.some((slot: any) => slot.dayOfWeek === day)) {
      setIsOn(true);
    }
  }, [schedules, day]);

  return (
    <Animated.View style={[styles.dayContainer, { backgroundColor: isOn ? 'transparent' : _color }]} layout={_layout}>
      <View style={styles.dayHeader}>
        <Text>{day}</Text>
        <Switch
          value={isOn}
          onValueChange={setIsOn}
          trackColor={{ true: _color }}
          style={styles.daySwitch}
        />
      </View>
      {isOn && <DayBlock userId={userId} day={day} schedules={schedules} setSchedules={setSchedules} />}
    </Animated.View>
  );
}

const AddTask = () => {
  const [schedules, setSchedules] = useState<any>([]);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if schedules have been submitted
  const [professionalId, setProfessionalId] = useState<string | null>(null); // State to store professionalId
  const user = useSelector((state: any) => state.auth?.user); // Access user from state with optional chaining
  const router = useRouter(); // Initialize router
  console.log('User:', user); // Log user for debugging

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const storedSchedules = await AsyncStorage.getItem('schedules');
        if (storedSchedules) {
          setSchedules(JSON.parse(storedSchedules));
          setIsSubmitted(true); // Assume schedules are submitted if they are stored
        }
      } catch (error) {
        console.error('Error loading schedules:', error);
      }
    };

    const loadProfessionalId = async () => {
      try {
        const storedProfessionalId = await AsyncStorage.getItem('professionalId');
        setProfessionalId(storedProfessionalId);
      } catch (error) {
        console.error('Error loading professionalId:', error);
      }
    };

    loadSchedules();
    loadProfessionalId();
  }, []);

  const persistSchedules = async (newSchedules: any) => {
    try {
      await AsyncStorage.setItem('schedules', JSON.stringify(newSchedules));
    } catch (error) {
      console.error('Error saving schedules:', error);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('User not found');
      return;
    }

    try {
      const payload = { userId: user.userId, professionalId, slots: schedules };
      console.log('Payload:', payload); // Log the payload to ensure professionalId is included

      const response = await fetch('https://medplus-health.onrender.com/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Include professionalId in the payload
      });

      if (response.ok) {
        alert('Schedules have been submitted successfully!');
        persistSchedules(schedules); // Persist schedules after successful submission
        setIsSubmitted(true); // Mark schedules as submitted
      } else {
        alert('Failed to submit schedules');
      }
    } catch (error) {
      console.error('Error submitting schedules:', error);
      alert('An error occurred while submitting schedules');
    }
  };

  const renderSlot = ({ item }: { item: any }) => (
    <View style={styles.slotCard}>
      <Text style={styles.slotText}>
        {item.startTime} - {item.endTime} {item.isAvailable ? "(Available)" : "(Not Available)"}
      </Text>
    </View>
  );

  const renderPreview = () => {
    const [recurrence, setRecurrence] = useState(null);
    const [isRecurrenceOptionsVisible, setIsRecurrenceOptionsVisible] = useState(false);

    const toggleRecurrenceOptions = () => {
      setIsRecurrenceOptionsVisible(!isRecurrenceOptionsVisible);
    };

    const selectRecurrence = (option) => {
      setRecurrence(option);
      setIsRecurrenceOptionsVisible(false);
    };

    if (!schedules.some((slot: any) => slot.dayOfWeek)) return null;

    const getConsecutiveDays = (startDay) => {
      const startIndex = weekDays.indexOf(startDay);
      return weekDays.slice(startIndex).concat(weekDays.slice(0, startIndex));
    };

    return (
      <View style={styles.previewContainer}>
        <View style={styles.header}>
         
        </View>
        {weekDays.map((day) => (
          <View key={day} style={styles.dayPreview}>
            <Text style={styles.previewDay}>{day}</Text>
            <FlatList
              data={schedules.filter((slot: any) => slot.dayOfWeek === day)}
              renderItem={renderSlot}
              horizontal
              keyExtractor={(item, index) => `preview-${day}-${index}-${item.startTime}-${item.endTime}`}
              contentContainerStyle={styles.slotList}
            />
            {recurrence === 'Daily' && getConsecutiveDays(day).slice(1).map((consecutiveDay) => (
              <View key={consecutiveDay} style={styles.dayPreview}>
                <Text style={styles.previewDay}>{consecutiveDay}</Text>
                <FlatList
                  data={schedules.filter((slot: any) => slot.dayOfWeek === day)}
                  renderItem={renderSlot}
                  horizontal
                  keyExtractor={(item, index) => `preview-${consecutiveDay}-${index}-${item.startTime}-${item.endTime}`}
                  contentContainerStyle={styles.slotList}
                />
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        style={{
          height: 260,
          borderRadius: 20,
          marginTop: -20,
          paddingTop: 60,
          paddingHorizontal: 10,
        }}
        start={[0, 1]}
        end={[1, 0]}
        colors={['#232526', '#414345']}
      >
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity>
            <Image
              style={{ width: 50, height: 50, borderRadius: 100 }}
              source={{ uri: user.profileImage }}
            />
          </TouchableOpacity>
          <View
            style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}
          >
            <Text
              style={{ fontFamily: 'NSExtraBold', fontSize: 16, color: '#fff' }}
            >
             Dr. {user.firstName}
            </Text>
           
          </View>
          <TouchableOpacity
            onPress={() => {
              router.push('/(tabs)/home')
            }}>
            <FeatherIcon
              color="#000"
              name="arrow-left"
              size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.container}>
        {weekDays.map((day) => (
          <Day
            userId={user.userId} // Use user.userId
            day={day}
            schedules={schedules}
            setSchedules={setSchedules}
            key={day}
          />
        ))}
        {renderPreview()}
        <Button
          title={isSubmitted ? "Update" : "Submit"}
          onPress={handleSubmit}
          color="black"
        />
      </ScrollView>
    </View>
  );
};


export default AddTask;

const styles = StyleSheet.create({
  container: {
    padding: spacing,
    gap: spacing,
    backgroundColor: '#ecf2f9',
  },
  dayContainer: {
    borderWidth: 1,
    borderColor: _color,
    padding: spacing,
    borderRadius: _borderRadius,
    gap: spacing,
  },

  recurrenceOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: 'black',
  },
    recurrenceDropdown: {
    position: 'absolute',
    top: 32,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  daySwitch: {
    transform: [{ scale: 0.7 }],
  },
  dayBlockContainer: {
    gap: spacing,
  },
  dayBlockRow: {
    flexDirection: 'row',
    gap: spacing,
    alignItems: 'center',
  },
  hourBlock: {
    borderWidth: 1,
    borderColor: _color,
    borderRadius: _borderRadius - spacing / 2,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing / 4,
  },
  removeButton: {
    backgroundColor: _color,
    height: 30,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: _borderRadius - spacing / 2,
  },
  addHourButton: {
    flexDirection: 'row',
    gap: spacing / 2,
    padding: spacing,
    borderRadius: _borderRadius - spacing / 2,
    backgroundColor: _color,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing / 2,
  },
  addHourIcon: {
    width: 20,
    height: 20,
    tintColor: 'blue',
  },
  previewContainer: {
    marginTop: spacing * 2,
  },
  previewTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: spacing,
  },
  dayPreview: {
    marginBottom: spacing,
        backgroundColor: '#ecf2f9'
  },
  previewDay: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: spacing / 2,

  },
  slotList: {
    gap: spacing,
    
  },
  slotCard: {
    backgroundColor: '#ffcab0',
    padding: spacing,
    borderRadius: _borderRadius - spacing / 2,
    marginRight: spacing,
  },
  slotText: {
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recurrenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing,
  },
  recurrenceButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  recurrenceButtonText: {
    font
  },
  selectedRecurrence: {
    marginHorizontal: spacing / 2,
    padding: spacing / 2,
    borderRadius: _borderRadius - spacing / 2,
    backgroundColor: 'blue',
    color: 'white',
  },
  toggleButton: {
    backgroundColor: _color,
    height: 30,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: _borderRadius - spacing / 2,
  },
});
