import React, { useState, useRef, useEffect } from 'react';
import { 
  Alert, 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  ImageBackground, 
  Text, 
  TextInput,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useUser();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.spring(formAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true })
    ]).start();
  }, []);

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
    } catch (error: any) {
      console.error('Error during login:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  const getInputContainerStyle = (isFocused: boolean) => [
    styles.inputContainer,
    isFocused && styles.inputContainerFocused
  ];

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
            <View style={styles.contentContainer}>
              <Animated.View 
                style={[
                  styles.headerContainer, 
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                  }
                ]}
              >
                <View style={styles.logoCircle}>
                  <Text style={styles.logoText}>DS</Text>
                </View>
                <Text style={styles.heading}>Welcome Back</Text>
                <Text style={styles.subHeading}>Sign in to continue</Text>
              </Animated.View>

              <Animated.View 
                style={[
                  styles.formWrapper,
                  {
                    opacity: formAnim,
                    transform: [{ scale: formAnim }]
                  }
                ]}
              >
                <View style={styles.formContainer}>
                  <View style={getInputContainerStyle(emailFocused)}>
                    <Ionicons name="mail-outline" size={22} color={emailFocused ? "#2D5A27" : "#666"} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email address"
                      placeholderTextColor={'#999'}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoComplete="email"
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                    />
                  </View>

                  <View style={getInputContainerStyle(passwordFocused)}>
                    <Ionicons name="lock-closed-outline" size={22} color={passwordFocused ? "#2D5A27" : "#666"} />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor={'#999'}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                    />
                  </View>

                  <TouchableOpacity style={styles.forgotPasswordLink}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.loginButton}
                    onPress={signInWithEmail}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.loginButtonText}>Sign In</Text>
                    )}
                  </TouchableOpacity>

                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.signupLink}
                  onPress={() => router.push('/Signup')}
                >
                  <Text style={styles.signupText}>Don't have an account? </Text>
                  <Text style={styles.signupLinkText}>Sign Up</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}



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
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
  input: {
    flex: 1,
    marginLeft: 12,
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
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#2D5A27',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#2D5A27',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 16,
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
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
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  socialButtonText: {
    color: '#333',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  signupLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signupText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
  },
  signupLinkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});