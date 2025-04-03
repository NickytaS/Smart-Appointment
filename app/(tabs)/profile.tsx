import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  TextInput,
  Animated,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

export default function ProfileScreen() {
  const router = useRouter();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Profile state
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    avatarUrl: null as string | null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);

      

      
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile data');
      if (error instanceof Error) {
        console.error('Error loading profile:', error.message);
      } else {
        console.error('Error loading profile:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
     
      
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      if (error instanceof Error) {
        console.error('Error updating profile:', error.message);
      } else {
        console.error('Error updating profile:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true
      });

      if (!result.canceled && result.assets[0]) {
        setIsLoading(true);
       

       

        Alert.alert('Success', 'Profile picture updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile picture');
      if (error instanceof Error) {
        console.error('Error updating profile picture:', error.message);
      } else {
        console.error('Error updating profile picture:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfileSection = () => (
    <View style={styles.profileSection}>
      <TouchableOpacity 
        onPress={handlePickImage} 
        style={styles.avatarContainer}
        disabled={isLoading}
      >
        {profile.avatarUrl ? (
          <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person-outline" size={40} color="#2D5A27" />
          </View>
        )}
        <View style={styles.editAvatarButton}>
          <Ionicons name="camera-outline" size={16} color="#fff" />
        </View>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={profile.firstName}
              onChangeText={(text) => setProfile(prev => ({ ...prev, firstName: text }))}
              placeholder="First Name"
              editable={!isLoading}
            />
            <TextInput
              style={styles.input}
              value={profile.lastName}
              onChangeText={(text) => setProfile(prev => ({ ...prev, lastName: text }))}
              placeholder="Last Name"
              editable={!isLoading}
            />
            <TextInput
              style={styles.input}
              value={profile.phoneNumber}
              onChangeText={(text) => setProfile(prev => ({ ...prev, phoneNumber: text }))}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              editable={!isLoading}
            />
            <TouchableOpacity 
              style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
              onPress={handleUpdateProfile}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.name}>
              {profile.firstName || profile.lastName 
                ? `${profile.firstName} ${profile.lastName}`
                : 'Add your name'}
            </Text>
            <Text style={styles.phoneNumber}>
              {profile.phoneNumber || 'Add your phone number'}
            </Text>
          </>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity 
            onPress={() => {
              if (isEditing) {
                handleUpdateProfile();
              } else {
                setIsEditing(true);
              }
            }}
            disabled={isLoading}
          >
            <Ionicons 
              name={isEditing ? "checkmark-outline" : "create-outline"} 
              size={24} 
              color="#2D5A27" 
            />
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
            {renderProfileSection()}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // ...existing styles...
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5A27',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#2D5A27',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  profileSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2D5A27',
    borderRadius: 50,
    padding: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  infoContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  phoneNumber: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
});