import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Animated,
  Platform,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@/context/AuthContext';
import { Doctor, Appointment } from '@/lib/types';
import { getUpcomingAppointments } from '@/lib/database';
import { useRouter } from 'expo-router';

const Home = () => {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Fetch upcoming appointments for the logged-in user
        const appointments = await getUpcomingAppointments(user.id);
        setUpcomingAppointments(appointments);
        
        // You'll need to implement these database functions
        // const doctorsData = await getAllDoctors();
        // setDoctors(doctorsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    // Animation sequence
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
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}]
            }
          ]}
        >
          <View style={styles.headerTop}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Hello,</Text>
              <Text style={styles.userName}>
                {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Appointment Section */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2D5A27" />
          </View>
        ) : !user ? (
          <View style={styles.noData}>
            <Text style={styles.noDataText}>Please log in to view your appointments</Text>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => router.push('/(auth)/Login')}
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Appointments Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
              {upcomingAppointments.length > 0 && (
                <TouchableOpacity onPress={() => router.push('/appointments')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              )}
            </View>

            {upcomingAppointments.length === 0 ? (
              <View style={styles.noAppointments}>
                <Ionicons name="calendar-outline" size={40} color="#ccc" />
                <Text style={styles.noAppointmentsText}>No upcoming appointments</Text>
                <TouchableOpacity 
                  style={styles.bookButton}
                  onPress={() => router.push('/(tabs)/schedule')}
                >
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            ) : (
              upcomingAppointments.map(appointment => (
                <TouchableOpacity 
                  key={appointment.id}
                  style={styles.appointmentCard}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['rgba(45, 90, 39, 0.1)', 'rgba(45, 90, 39, 0.05)']}
                    style={styles.appointmentCardGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.appointmentInfo}>
                      <Image 
                        source={{uri: appointment.avatar}} 
                        style={styles.doctorAvatar}
                      />
                      <View style={styles.appointmentDetails}>
                        <Text style={styles.doctorName}>Dr. {appointment.doctorName}</Text>
                        <Text style={styles.appointmentSpecialty}>{appointment.specialty}</Text>
                        <View style={styles.appointmentTimeContainer}>
                          <Ionicons name="calendar-outline" size={14} color="#666" />
                          <Text style={styles.appointmentTime}>{appointment.date}</Text>
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.appointmentActions}>
                      {appointment.isVideo && (
                        <View style={styles.appointmentBadge}>
                          <Ionicons name="videocam-outline" size={12} color="#2D5A27" />
                          <Text style={styles.appointmentBadgeText}>Video</Text>
                        </View>
                      )}
                      <TouchableOpacity style={styles.rescheduleButton}>
                        <Text style={styles.rescheduleButtonText}>Reschedule</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))
            )}
          </>
        )}

        {/* Specialties and Top Doctors Sections omitted for brevity */}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  noData: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#2D5A27',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTop: {
    marginBottom: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontWeight: '400',
      },
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
  userName: {
    fontSize: 24,
    color: '#2D5A27',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontWeight: '700',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  profileButton: {
    position: 'relative',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#2D5A27',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B6B',
    borderWidth: 2,
    borderColor: '#f8f9fa',
    zIndex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  seeAllText: {
    fontSize: 14,
    color: '#2D5A27',
    fontWeight: '500',
  },
  appointmentCard: {
    marginHorizontal: 20,
    marginBottom: 16, // Add this line for vertical spacing between cards
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white', // Add this for consistent background
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
    padding: 16,
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  appointmentDetails: {
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
  appointmentSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  appointmentTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  appointmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 90, 39, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  appointmentBadgeText: {
    fontSize: 12,
    color: '#2D5A27',
    marginLeft: 4,
    fontWeight: '500',
  },
  rescheduleButton: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rescheduleButtonText: {
    fontSize: 12,
    color: '#2D5A27',
    fontWeight: '500',
  },
  noAppointments: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noAppointmentsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 15,
  },
  bookButton: {
    backgroundColor: '#2D5A27',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  specialtyItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  specialtyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(45, 90, 39, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  specialtyName: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  topDoctorsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  doctorCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 5,
    width: 160,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorCardAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  doctorCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  doctorCardSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  doctorCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorCardRatingText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginLeft: 4,
  },
  doctorCardReviews: {
    fontSize: 12,
    color: '#999',
    marginLeft: 2,
  },
  bookDoctorButton: {
    backgroundColor: 'rgba(45, 90, 39, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookDoctorButtonText: {
    color: '#2D5A27',
    fontWeight: '500',
  },
  servicesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  serviceCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  serviceCardGradient: {
    padding: 20,
    height: 130,
    justifyContent: 'space-between',
  },
  serviceCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  serviceCardText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  navTextActive: {
    color: '#2D5A27',
    fontWeight: '500',
  },
});

export default Home;