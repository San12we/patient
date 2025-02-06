import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from './Style/TaskStyle';

import FeatherIcon from '@expo/vector-icons/Feather';
import { Feather as Icon } from '@expo/vector-icons';
import { notificationImg, UserProfile, AddImg } from '../../theme/Images';
import { Agenda, calendarTheme } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { TaskContext } from '../../context/TaskContext';
import { useSelector } from 'react-redux'; // Import useSelector from react-redux

export default function Task() {
  const router = useRouter();
  const { items } = useContext(TaskContext);
  const user = useSelector((state) => state.auth?.user); // Access user from state with optional chaining
  const [selectedDate, setSelectedDate] = useState(new Date());

  const customTheme = {
    ...calendarTheme,
    agendaTodayColor: '#20bf55',
    agendaKnobColor: '#20bf55',
    selectedDayBackgroundColor: '#20bf55',
    dotColor: '#20bf55',
  };

  const renderEmptyData = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No Task for this day</Text>
      </View>
    );
  };

  const renderItem = (item) => (
    <View style={{ marginVertical: 10, marginTop: 20, backgroundColor: 'white', marginHorizontal: 10, padding: 10 }}>
      <Text>{item.name}</Text>
      <Text>{item.time}</Text>
      <Text>{item.task}</Text>
      {item.type === 'Schedule' && <Text>Type: Schedule</Text>}
    </View>
  );

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
              source={{ uri: user?.profileImage || 'https://randomuser.me/api/portraits/men/86.jpg' }}
            />
          </TouchableOpacity>
          <View
            style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}
          >
            <Text
              style={{ fontFamily: 'NSExtraBold', fontSize: 16, color: '#fff' }}
            >
             Dr. {user?.firstName}
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

      <View style={styles.calenderView}>
        <View style={styles.mainCalenderView}>
          <Agenda
            items={items.tasks} // Ensure accessing tasks correctly
            theme={customTheme}
            showOnlySelectedDayItems={true}
            renderEmptyData={renderEmptyData}
            renderItem={renderItem}
            onDayPress={(day) => setSelectedDate(new Date(day.timestamp))} // Capture selected date
          />
        </View>
      </View>
      <TouchableOpacity style={styles.stickyCircle} onPress={() => router.push({ pathname: '/addtask', params: { selectedDate: selectedDate.toISOString() } })}>
        <Image source={AddImg} style={styles.addImg} />
      </TouchableOpacity>
    </View>
  );
}