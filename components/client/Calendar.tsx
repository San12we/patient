import React from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideInLeft } from 'react-native-reanimated';
import Colors from '../Shared/Colors';

const { width } = Dimensions.get('window');

const Calendar = ({
  daysOfWeek,
  selectedDay,
  setSelectedDay,
  getSlotsForSelectedDay,
  handleSlotSelection,
  scheduleLoading,
  error,
  selectedTimeSlot,
}) => {
  const renderDayButton = (day) => {
    const today = moment().startOf('day');
    const isPastDay = moment(day, 'dddd').isBefore(today, 'day');
    const hasSlots = getSlotsForSelectedDay(day)?.length > 0;
    const isDisabled = isPastDay || !hasSlots;
    const isToday = moment(day, 'dddd').isSame(moment(), 'day');

    return (
      <Animated.View entering={SlideInRight} exiting={SlideInLeft} key={day}>
        <TouchableOpacity
          onPress={() => setSelectedDay(day)}
          style={[
            styles.dayButton,
            selectedDay === day && styles.selectedDayButton,
            isToday && !isDisabled && styles.todayButton,
            isDisabled && styles.disabledDayButton,
          ]}
          disabled={isDisabled}
        >
          <Text
            style={[
              styles.dayText,
              selectedDay === day && styles.selectedDayText,
              isToday && !isDisabled && styles.todayText,
              isDisabled && styles.disabledDayText,
            ]}
          >
            {day.substring(0, 3)} {/* Display only the first 3 letters of the day */}
          </Text>
          {isDisabled && (
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={Colors.GRAY}
              style={styles.infoIcon}
            />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderSlot = ({ item }) => {
    const slotTime = moment(`${item.date} ${item.startTime}`, 'YYYY-MM-DD HH:mm');
    const isPast = slotTime.isBefore(moment());

    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} key={item._id}>
        <TouchableOpacity
          onPress={() => handleSlotSelection(item)}
          style={[
            styles.slotButton,
            item.isBooked || isPast ? { backgroundColor: Colors.SECONDARY } : { backgroundColor: Colors.goofy },
            selectedTimeSlot?.id === item._id && { borderColor: Colors.SECONDARY, borderWidth: 2, backgroundColor: Colors.selectedBackground },
          ]}
          disabled={item.isBooked || isPast}
        >
          <Text style={[styles.slotText, selectedTimeSlot?.id === item._id && { color: Colors.PRIMARY }]}>
            {`${item.startTime} - ${item.endTime}`}
          </Text>
          {selectedTimeSlot?.id === item._id && (
            <Ionicons name="checkmark-circle" size={20} color={Colors.PRIMARY} style={styles.checkIcon} />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Select a Day</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysContainer}>
          {daysOfWeek.map((day) => renderDayButton(day))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Available Slots</Text>
        {scheduleLoading ? (
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
        ) : error ? (
          <Text style={styles.errorText}>Error loading schedule: {error}</Text>
        ) : getSlotsForSelectedDay(selectedDay).length > 0 ? (
          <FlatList
            horizontal
            data={getSlotsForSelectedDay(selectedDay)}
            keyExtractor={(item) => item._id}
            renderItem={renderSlot}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.slotsContainer}
          />
        ) : (
          <Text style={styles.noSlotsText}>
            {getSlotsForSelectedDay(selectedDay).length === 0
              ? 'The doctor is not available for the selected day.'
              : 'No slots available for the selected day.'}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  daysContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  dayButton: {
    width: 80, // Fixed width for better spacing
    height: 80, // Fixed height for better touchability
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 16, // Slightly rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDayButton: {
    backgroundColor: Colors.PRIMARY,
  },
  todayButton: {
    backgroundColor: Colors.SECONDARY,
  },
  disabledDayButton: {
    backgroundColor: Colors.LIGHT_GRAY,
  },
  dayText: {
    fontSize: 16,
    color: Colors.primary, // Same text color for all days
    fontWeight: '500',
  },
  selectedDayText: {
    color: '#fff',
  },
  todayText: {
    color: '#fff',
  },
  disabledDayText: {
    color: Colors.GRAY,
  },
  infoIcon: {
    marginLeft: 4,
  },
  slotsContainer: {
    paddingHorizontal: 8,
  },
  slotButton: {
    width: 120, // Fixed width for better spacing
    height: 60, // Fixed height for better touchability
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  slotText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  checkIcon: {
    position: 'absolute',
    right: 4,
    top: 4,
  },
  noSlotsText: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: Colors.ERROR,
    textAlign: 'center',
  },
});

export default Calendar;