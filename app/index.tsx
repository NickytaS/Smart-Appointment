import { Image, StyleSheet, Platform, ScrollView, ImageBackground, TouchableOpacity, Animated } from 'react-native';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';

export default function Index() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate content in sequence
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/doc2.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
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
                  {opacity: fadeAnim}
                ]}
              >
                <View style={styles.logoContainer}>
                  <View style={styles.logoCircle}>
                    <Text style={styles.logoText}>DS</Text>
                  </View>
                </View>
                
                <Text style={styles.heading}>DocSmart</Text>
                <Animated.Text 
                  style={[
                    styles.subHeading,
                    {transform: [{translateY: slideAnim}]}
                  ]}
                >
                  Your health is our priority. Connect with trusted doctors and get the care you deserve.
                </Animated.Text>
              </Animated.View>

              <Animated.View style={{
                transform: [{scale: buttonAnim}],
                opacity: buttonAnim
              }}>
                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={() => router.push('/Signup')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.loginButtonText}>Get Started</Text>
                </TouchableOpacity>
              </Animated.View>
              
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? <Link href={'/(auth)/Login'} style={styles.footerLink}>Sign in</Link></Text>
              </View>
              <Link href={"/(tabs)/home"}>Go to home</Link>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D5A27',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 60,
    width: '100%',
    maxWidth: 320,
  },
  heading: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
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
    textAlign: 'center',
    lineHeight: 26,
    ...Platform.select({
      ios: {
        fontWeight: '400',
      },
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
  loginButton: {
    backgroundColor: '#2D5A27',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
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
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  footer: {
    marginTop: 30,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  footerLink: {
    color: 'white',
    fontWeight: 'bold',
  }
});