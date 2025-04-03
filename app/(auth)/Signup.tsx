import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ImageBackground, 
  TextInput, 
  TouchableOpacity,
  Animated,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { router, useRouter } from 'expo-router'
import { initializeDatabase, addUser } from '@/lib/database'
// styles
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingVertical: 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5A27',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    ...Platform.select({
      ios: {
        fontWeight: '800',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  subHeading: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    ...Platform.select({
      ios: {
        fontWeight: '400',
      },
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
  formWrapper: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  nameInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    padding: 14,
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
  inputContainerFocused: {
    borderColor: '#2D5A27',
    borderWidth: 1.5,
    shadowOpacity: 0.15,
  },
  halfInput: {
    flex: 1,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    ...Platform.select({
      ios: {
        fontWeight: '400',
      },
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
  signupButton: {
    backgroundColor: '#2D5A27',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    color: '#666',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
  },
  loginLinkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

const Signup = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedInput, setFocusedInput] = useState<string | null>(null)
  const router = useRouter()

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const formAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    //initialize the database
    initializeDatabase()
    // Animate content in sequence
    Animated.sequence([
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
      Animated.spring(formAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start()
  }, [])

// In the handleSignUp function
const handleSignUp = async () => {
  if (!firstName || !lastName || !email || !phone || !password) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  try {
    setLoading(true);
    await addUser(firstName, lastName, email, phone, password);
    Alert.alert('Success', 'Account created successfully!');
    // Navigate to the login screen after successful sign up
    router.replace('/Login');
  } catch (error: any) {
    Alert.alert('Error', error.message);
  } finally {
    setLoading(false);
  }
}

  interface InputContainerStyleProps {
    inputName: string;
  }

  // const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const getInputContainerStyle = (inputName: InputContainerStyleProps['inputName']): object[] => {
    const styleArray = [styles.inputContainer];
    if (focusedInput === inputName) {
      styleArray.push({ ...styles.inputContainer, ...styles.inputContainerFocused });
    }
    return styleArray;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require('../../assets/images/doc1.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.container}>
            <ScrollView 
              contentContainerStyle={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.contentContainer}>
                <Animated.View 
                  style={[
                    styles.headerContainer, 
                    {
                      opacity: fadeAnim,
                      transform: [{translateY: slideAnim}]
                    }
                  ]}
                >
                  <View style={styles.logoCircle}>
                    <Text style={styles.logoText}>DS</Text>
                  </View>
                  <Text style={styles.heading}>Create Account</Text>
                  <Text style={styles.subHeading}>Healthcare at your fingertips</Text>
                </Animated.View>

                <Animated.View 
                  style={[
                    styles.formWrapper,
                    {
                      opacity: formAnim,
                      transform: [{scale: formAnim}]
                    }
                  ]}
                >
                  <View style={styles.formContainer}>
                    <View style={styles.nameInputsContainer}>
                      <View style={[getInputContainerStyle('firstName'), styles.halfInput]}>
                        <Ionicons name="person-outline" size={20} color={focusedInput === 'firstName' ? "#2D5A27" : "#666"} />
                        <TextInput
                          style={styles.input}
                          placeholder="First Name"
                          placeholderTextColor="#999"
                          value={firstName}
                          onChangeText={setFirstName}
                          onFocus={() => setFocusedInput('firstName')}
                          onBlur={() => setFocusedInput(null)}
                        />
                      </View>
                      
                      <View style={[getInputContainerStyle('lastName'), styles.halfInput]}>
                        <Ionicons name="person-outline" size={20} color={focusedInput === 'lastName' ? "#2D5A27" : "#666"} />
                        <TextInput
                          style={styles.input}
                          placeholder="Last Name"
                          placeholderTextColor="#999"
                          value={lastName}
                          onChangeText={setLastName}
                          onFocus={() => setFocusedInput('lastName')}
                          onBlur={() => setFocusedInput(null)}
                        />
                      </View>
                    </View>

                    <View style={getInputContainerStyle('email')}>
                      <Ionicons name="mail-outline" size={20} color={focusedInput === 'email' ? "#2D5A27" : "#666"} />
                      <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => setFocusedInput('email')}
                        onBlur={() => setFocusedInput(null)}
                        autoCapitalize="none"
                      />
                    </View>

                    <View style={getInputContainerStyle('phone')}>
                      <Ionicons name="call-outline" size={20} color={focusedInput === 'phone' ? "#2D5A27" : "#666"} />
                      <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                        onFocus={() => setFocusedInput('phone')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>

                    <View style={getInputContainerStyle('password')}>
                      <Ionicons name="lock-closed-outline" size={20} color={focusedInput === 'password' ? "#2D5A27" : "#666"} />
                      <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => setFocusedInput(null)}
                        autoCapitalize="none"
                      />
                    </View>

                    <TouchableOpacity 
                      style={styles.signupButton}
                      onPress={handleSignUp}
                      disabled={loading}
                      activeOpacity={0.8}
                    >
                      {loading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text style={styles.signupButtonText}>Create Account</Text>
                      )}
                    </TouchableOpacity>

                    {/* <View style={styles.divider}>
                      <View style={styles.dividerLine} />
                      <Text style={styles.dividerText}>or sign up with</Text>
                      <View style={styles.dividerLine} />
                    </View> */}

                    {/* <View style={styles.socialButtonsContainer}>
                      <TouchableOpacity 
                        style={styles.socialButton}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="logo-google" size={20} color="#DB4437" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.socialButton}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="logo-apple" size={20} color="#000000" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.socialButton}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="logo-facebook" size={20} color="#4267B2" />
                      </TouchableOpacity>
                    </View> */}
                  </View>

                  <TouchableOpacity 
                    style={styles.loginLink}
                    onPress={() => router.push('/Login')}
                  >
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <Text style={styles.loginLinkText}>Sign In</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </TouchableWithoutFeedback>
  )
}

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//   },
//   gradient: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//   },
//   scrollView: {
//     flexGrow: 1,
//     paddingVertical: 40,
//   },
//   contentContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//   },
//   headerContainer: {
//     marginBottom: 30,
//     alignItems: 'center',
//   },
//   logoCircle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 4.65,
//     elevation: 8,
//     marginBottom: 20,
//   },
//   logoText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2D5A27',
//   },
//   heading: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 8,
//     ...Platform.select({
//       ios: {
//         fontWeight: '800',
//       },
//       android: {
//         fontFamily: 'sans-serif-medium',
//       },
//     }),
//   },
//   subHeading: {
//     fontSize: 18,
//     color: 'rgba(255, 255, 255, 0.9)',
//     ...Platform.select({
//       ios: {
//         fontWeight: '400',
//       },
//       android: {
//         fontFamily: 'sans-serif',
//       },
//     }),
//   },
//   formWrapper: {
//     width: '100%',
//     maxWidth: 400,
//     alignSelf: 'center',
//   },
//   formContainer: {
//     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//     borderRadius: 20,
//     padding: 24,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 10,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 10,
//     elevation: 10,
//   },
//   nameInputsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 12,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     borderRadius: 12,
//     marginBottom: 16,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: '#eee',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   inputContainerFocused: {
//     borderColor: '#2D5A27',
//     borderWidth: 1.5,
//     shadowOpacity: 0.15,
//   },
//   halfInput: {
//     flex: 1,
//   },
//   input: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 16,
//     color: '#333',
//     ...Platform.select({
//       ios: {
//         fontWeight: '400',
//       },
//       android: {
//         fontFamily: 'sans-serif',
//       },
//     }),
//   },
//   signupButton: {
//     backgroundColor: '#2D5A27',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 8,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   signupButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//     letterSpacing: 0.5,
//   },
//   divider: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 24,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#ddd',
//   },
//   dividerText: {
//     color: '#666',
//     paddingHorizontal: 16,
//     fontSize: 14,
//   },
//   socialButtonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 20,
//   },
//   socialButton: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#eee',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   loginLink: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 24,
//   },
//   loginText: {
//     color: 'rgba(255, 255, 255, 0.9)',
//     fontSize: 16,
//   },
//   loginLinkText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

export default Signup