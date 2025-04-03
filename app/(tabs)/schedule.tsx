import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Image,
  Animated,
  Platform
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createAppointment } from '../../lib/database';
import { useUser } from '../../context/AuthContext';

export default function ScheduleScreen() {
  const router = useRouter();
  const { user } = useUser();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  // State for form fields
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  interface Doctor {
    id: number;
    name: string;
    specialty: string;
    rating: number;
    avatar: string;
  }
  
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointmentType, setAppointmentType] = useState('in-person');
  const [reason, setReason] = useState('');
  
  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });
  
  // Time slots
  const morningSlots = ['09:00 AM', '10:00 AM', '11:00 AM'];
  const afternoonSlots = ['01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];
  
  // Doctors data
  const doctors = [
    {
      id: 1,
      name: 'Dr. Emily Chen',
      specialty: 'Cardiologist',
      rating: 4.9,
      avatar: '/placeholder.svg?height=60&width=60'
    },
    {
      id: 2,
      name: 'Dr. Mark Wilson',
      specialty: 'General Physician',
      rating: 4.8,
      avatar: '/placeholder.svg?height=60&width=60'
    },
    {
      id: 3,
      name: 'Dr. Sarah Johnson',
      specialty: 'Neurologist',
      rating: 4.7,
      avatar: '/placeholder.svg?height=60&width=60'
    }
  ];
  
  // Format date for display
  interface FormattedDate {
    day: string;
    date: number;
    month: string;
  }

  const formatDate = (date: Date): FormattedDate => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()]
    };
  };
  
  // Check if all required fields are filled
  const isFormComplete = () => {
    return selectedDate && selectedTime && selectedDoctor;
  };
  
  // Handle appointment booking
  const handleBookAppointment = async () => {
    if (!user || !selectedDoctor || !selectedDate || !selectedTime) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createAppointment(
        user.id,
        selectedDoctor.id.toString(),
        selectedDate.toISOString().split('T')[0],
        selectedTime,
        reason
      );
      alert('Appointment booked successfully!');
      router.push('/');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };
  
  useEffect(() => {
    // Animate content when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Schedule Appointment</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Date Selection */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateScrollContent}
          >
            {dates.map((date, index) => {
              const formattedDate = formatDate(date);
              const isSelected = selectedDate && 
                selectedDate.getDate() === date.getDate() && 
                selectedDate.getMonth() === date.getMonth();
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateItem,
                    isSelected && styles.selectedDateItem
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text style={[styles.dayText, isSelected && styles.selectedText]}>
                    {formattedDate.day}
                  </Text>
                  <Text style={[styles.dateText, isSelected && styles.selectedText]}>
                    {formattedDate.date}
                  </Text>
                  <Text style={[styles.monthText, isSelected && styles.selectedText]}>
                    {formattedDate.month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>
        
        {/* Time Selection */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Select Time</Text>
          
          <View style={styles.timeSection}>
            <Text style={styles.timeSectionTitle}>Morning</Text>
            <View style={styles.timeSlotContainer}>
              {morningSlots.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.selectedTimeSlot
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text 
                    style={[
                      styles.timeSlotText,
                      selectedTime === time && styles.selectedTimeSlotText
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.timeSection}>
            <Text style={styles.timeSectionTitle}>Afternoon</Text>
            <View style={styles.timeSlotContainer}>
              {afternoonSlots.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.selectedTimeSlot
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text 
                    style={[
                      styles.timeSlotText,
                      selectedTime === time && styles.selectedTimeSlotText
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
        
        {/* Doctor Selection */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Select Doctor</Text>
          
          {doctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              style={[
                styles.doctorCard,
                selectedDoctor?.id === doctor.id && styles.selectedDoctorCard
              ]}
              onPress={() => setSelectedDoctor(doctor)}
            >
              <Image 
                source={{uri: doctor.avatar}} 
                style={styles.doctorAvatar}
              />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{doctor.rating}</Text>
                </View>
              </View>
              {selectedDoctor?.id === doctor.id && (
                <Ionicons name="checkmark-circle" size={24} color="#2D5A27" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>
        
        {/* Appointment Type */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Appointment Type</Text>
          
          <View style={styles.appointmentTypeContainer}>
            <TouchableOpacity
              style={[
                styles.appointmentTypeButton,
                appointmentType === 'in-person' && styles.selectedAppointmentType
              ]}
              onPress={() => setAppointmentType('in-person')}
            >
              <Ionicons 
                name="person" 
                size={20} 
                color={appointmentType === 'in-person' ? "#fff" : "#666"} 
              />
              <Text 
                style={[
                  styles.appointmentTypeText,
                  appointmentType === 'in-person' && styles.selectedAppointmentTypeText
                ]}
              >
                In-Person
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.appointmentTypeButton,
                appointmentType === 'video' && styles.selectedAppointmentType
              ]}
              onPress={() => setAppointmentType('video')}
            >
              <Ionicons 
                name="videocam" 
                size={20} 
                color={appointmentType === 'video' ? "#fff" : "#666"} 
              />
              <Text 
                style={[
                  styles.appointmentTypeText,
                  appointmentType === 'video' && styles.selectedAppointmentTypeText
                ]}
              >
                Video Call
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        {/* Reason for Visit */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Reason for Visit</Text>
          <TextInput
            style={styles.reasonInput}
            placeholder="Briefly describe your symptoms or reason for visit"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={reason}
            onChangeText={setReason}
          />
        </Animated.View>
        
        {/* Book Button */}
        <Animated.View 
          style={{
            opacity: fadeAnim,
            marginTop: 20,
            marginBottom: 30
          }}
        >
          <TouchableOpacity
            style={[
              styles.bookButton,
              !isFormComplete() && styles.disabledButton
            ]}
            onPress={handleBookAppointment}
            disabled={!isFormComplete()}
          >
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5A27',
    ...Platform.select({
      ios: {
        fontWeight: '700',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  placeholder: {
    width: 24,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  dateScrollContent: {
    paddingRight: 20,
  },
  dateItem: {
    width: 70,
    height: 90,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedDateItem: {
    backgroundColor: '#2D5A27',
    borderColor: '#2D5A27',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    ...Platform.select({
      ios: {
        fontWeight: '700',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  monthText: {
    fontSize: 14,
    color: '#666',
  },
  selectedText: {
    color: 'white',
  },
  timeSection: {
    marginBottom: 20,
  },
  timeSectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeSlot: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedTimeSlot: {
    backgroundColor: '#2D5A27',
    borderColor: '#2D5A27',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTimeSlotText: {
    color: 'white',
    fontWeight: '500',
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedDoctorCard: {
    borderColor: '#2D5A27',
    borderWidth: 2,
    backgroundColor: 'rgba(45, 90, 39, 0.05)',
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
  },
  doctorInfo: {
    marginLeft: 15,
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  appointmentTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appointmentTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    paddingVertical: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedAppointmentType: {
    backgroundColor: '#2D5A27',
    borderColor: '#2D5A27',
  },
  appointmentTypeText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  selectedAppointmentTypeText: {
    color: 'white',
    fontWeight: '500',
  },
  reasonInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 15,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  bookButton: {
    backgroundColor: '#2D5A27',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
    shadowOpacity: 0.1,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
});