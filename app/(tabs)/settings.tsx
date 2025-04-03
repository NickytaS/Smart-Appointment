import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Animated,
  Platform
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
  const router = useRouter();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Settings state
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    darkMode: false,
    biometricLogin: false
  });

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

  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    description: string,
    setting: keyof typeof settings
  ) => (
    <View style={styles.settingCard}>
      <LinearGradient
        colors={['rgba(45, 90, 39, 0.08)', 'rgba(45, 90, 39, 0.03)']}
        style={styles.settingCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.settingHeader}>
          <View style={styles.settingIcon}>
            <Ionicons name={icon as any} size={24} color="#2D5A27" />
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>{title}</Text>
            <Text style={styles.settingDescription}>{description}</Text>
          </View>
          <Switch
            value={settings[setting]}
            onValueChange={() => toggleSetting(setting)}
            trackColor={{ false: '#767577', true: '#2D5A27' }}
            thumbColor={settings[setting] ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#767577"
          />
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            {renderSettingItem(
              'notifications-outline',
              'Push Notifications',
              'Receive push notifications for appointments and updates',
              'pushNotifications'
            )}
            {renderSettingItem(
              'mail-outline',
              'Email Notifications',
              'Receive email notifications for appointments and updates',
              'emailNotifications'
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            {renderSettingItem(
              'moon-outline',
              'Dark Mode',
              'Switch between light and dark theme',
              'darkMode'
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            {renderSettingItem(
              'finger-print-outline',
              'Biometric Login',
              'Use fingerprint or face ID to login',
              'biometricLogin'
            )}
          </View>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => {
              // Handle logout
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
            <Text style={styles.logoutButtonText}>Log Out</Text>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  settingCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingCardGradient: {
    padding: 16,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(45, 90, 39, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
  },
  logoutButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});