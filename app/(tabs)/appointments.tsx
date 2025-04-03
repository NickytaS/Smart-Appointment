// AppointmentScreen.tsx
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Animated,
  Platform
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getUpcomingAppointments, updateAppointmentStatus } from '../../lib/database';
import { useUser } from '../../context/AuthContext';

export default function AppointmentScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  useEffect(() => {
    const loadAppointments = async () => {
      if (user) {
        try {
          const data = await getUpcomingAppointments(user.id);
          const formattedData = data.map(appointment => ({
            ...appointment,
            id: Number(appointment.id),
          }));
          setAppointments(formattedData);
        } catch (error) {
          console.error('Error loading appointments:', error);
        }
      }
    };
    loadAppointments();

    // Example logic to filter past appointments
    const loadPastAppointments = async () => {
      if (user) {
        try {
          const data = await getUpcomingAppointments(user.id); // Replace with actual past appointments API
          const filteredData = data
            .filter(appointment => new Date(appointment.date) < new Date())
            .map(appointment => ({
              ...appointment,
              id: Number(appointment.id),
            }));
          setPastAppointments(filteredData);
        } catch (error) {
          console.error('Error loading past appointments:', error);
        }
      }
    };

    loadPastAppointments();
    loadAppointments();
  }, [user]);

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
  
  interface Appointment {
    id: number;
    doctorName: string;
    specialty: string;
    date: string;
    location: string;
    avatar: string;
    isVideo: boolean;
    status?: string;
  }

  const renderAppointmentCard = (appointment: Appointment, isPast: boolean = false): JSX.Element => {
    return (
      <TouchableOpacity 
        key={appointment.id}
        style={styles.appointmentCard}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(45, 90, 39, 0.08)', 'rgba(45, 90, 39, 0.03)']}
          style={styles.appointmentCardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.appointmentHeader}>
            <View style={styles.appointmentInfo}>
              <Image 
                source={{uri: appointment.avatar}} 
                style={styles.doctorAvatar}
              />
              <View style={styles.appointmentDetails}>
                <Text style={styles.doctorName}>{appointment.doctorName}</Text>
                <Text style={styles.appointmentSpecialty}>{appointment.specialty}</Text>
              </View>
            </View>
            
            {isPast && (
              <View style={[
                styles.statusBadge,
                appointment.status === 'Cancelled' ? styles.cancelledBadge : styles.completedBadge
              ]}>
                <Text style={[
                  styles.statusText,
                  appointment.status === 'Cancelled' ? styles.cancelledText : styles.completedText
                ]}>
                  {appointment.status}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.appointmentFooter}>
            <View style={styles.appointmentMetaItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.appointmentMetaText}>{appointment.date}</Text>
            </View>
            
            <View style={styles.appointmentMetaItem}>
              <Ionicons 
                name={appointment.isVideo ? "videocam-outline" : "location-outline"} 
                size={16} 
                color="#666" 
              />
              <Text style={styles.appointmentMetaText}>
                {appointment.isVideo ? 'Video Call' : appointment.location}
              </Text>
            </View>
          </View>
          
          {!isPast && (
            <View style={styles.appointmentActions}>
              <TouchableOpacity style={styles.rescheduleButton}></TouchableOpacity>
                <Ionicons name="calendar-outline" size={16} color="#2D5A27" />
                <Text style={styles.rescheduleButtonText}>Reschedule</Text>
              <TouchableOpacity style={styles.reviewButton}>
                <Ionicons name="star-outline" size={16} color="#2D5A27" />
                <Text style={styles.reviewButtonText}>Leave Review</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.bookAgainButton}>
                <Ionicons name="add-circle-outline" size={16} color="#2D5A27" />
                <Text style={styles.bookAgainButtonText}>Book Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Appointments</Text>
        <TouchableOpacity 
          style={styles.scheduleButton}
          onPress={() => router.push('/(tabs)/schedule')}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.scheduleButtonText}>New</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'upcoming' && styles.activeTabText
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'past' && styles.activeTabText
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}]
          }}
        >
          {activeTab === 'upcoming' ? (
            appointments.length > 0 ? (
              appointments.map(appointment => renderAppointmentCard(appointment))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={60} color="#ccc" />
                <Text style={styles.emptyStateTitle}>No Upcoming Appointments</Text>
                <Text style={styles.emptyStateText}>
                  You don't have any upcoming appointments scheduled.
                </Text>
                <TouchableOpacity 
                  style={styles.bookNowButton}
                  onPress={() => router.push('/(tabs)/schedule')}
                >
                  <Text style={styles.bookNowButtonText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            pastAppointments.length > 0 ? (
              pastAppointments.map(appointment => renderAppointmentCard(appointment, true))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="time-outline" size={60} color="#ccc" />
                <Text style={styles.emptyStateTitle}>No Past Appointments</Text>
                <Text style={styles.emptyStateText}>
                  You don't have any past appointment records.
                </Text>
              </View>
            )
          )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  title: {
    fontSize: 22,
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
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D5A27',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scheduleButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    paddingVertical: 15,
    marginRight: 30,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2D5A27',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2D5A27',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  appointmentCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  appointmentCardGradient: {
    padding: 20,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  appointmentDetails: {
    marginLeft: 0,
    gap: 6,
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
  appointmentSpecialty: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  completedBadge: {
    backgroundColor: 'rgba(45, 90, 39, 0.1)',
  },
  cancelledBadge: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  completedText: {
    color: '#2D5A27',
  },
  cancelledText: {
    color: '#FF6B6B',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginVertical: 15,
  },
  appointmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  appointmentMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentMetaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  appointmentActions: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 20,
  },
  rescheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 90, 39, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rescheduleButtonText: {
    color: '#2D5A27',
    fontWeight: '500',
    marginLeft: 5,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontWeight: '500',
    marginLeft: 5,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 90, 39, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  reviewButtonText: {
    color: '#2D5A27',
    fontWeight: '500',
    marginLeft: 5,
  },
  bookAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 90, 39, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookAgainButtonText: {
    color: '#2D5A27',
    fontWeight: '500',
    marginLeft: 5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  bookNowButton: {
    backgroundColor: '#2D5A27',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  bookNowButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});