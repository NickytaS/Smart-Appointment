import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthRoutesLayout() {
  const [session, setSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Retrieve session token from AsyncStorage
        const token = await AsyncStorage.getItem('sessionToken');
        
        // Set session state if token exists
        setSession(token);
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Show loading while checking auth state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2D5A27" />
      </View>
    );
  }

  // Redirect to main app if user is already logged in
  if (session) {
    return <Redirect href="/(tabs)/home" />;
  }

  // Show auth screens if not authenticated
  return (
    <Stack>
      <Stack.Screen name="Login" options={{headerShown: false}} />
      <Stack.Screen name="Signup" options={{headerShown: false}} />
    </Stack>
  );
}