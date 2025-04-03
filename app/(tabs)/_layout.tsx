import { Stack, Tabs,useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserProvider, useUser } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

function AuthenticatedContent() {
  const { isAuthenticated, isLoading } = useUser();
  const router = useRouter();
  const mounted = React.useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && mounted.current) {
      router.replace('/(auth)/Login');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return null; // displaying a loading spinner or an empty fragment
  }

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 80,
          paddingHorizontal: 0,
          paddingVertical: 8,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 6,
        },
        tabBarActiveTintColor: '#2D5A27',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
      }}
    >
      {/* Add your Tabs.Screen components here */}
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          headerShown: false,
          tabBarLabel: 'Schedule',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          headerShown: false,
          tabBarLabel: 'Appointments',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medical-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <UserProvider>
      <ThemeProvider>
        <AuthenticatedContent />
      </ThemeProvider>
    </UserProvider>
  );
}