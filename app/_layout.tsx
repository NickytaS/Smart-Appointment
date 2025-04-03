import { Slot, Stack, Tabs } from "expo-router";
import React, {useEffect} from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ensureDatabaseInitialized } from '@/lib/database';

export default function RootLayout() {
  useEffect(() => {
    const initDB = async () => {
      try {
        await ensureDatabaseInitialized();
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };

    initDB();
  }, []);

  return (
    <UserProvider>
      <ThemeProvider>
        {/* <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />

          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: true,
              headerTitle: "",
              headerTransparent: true,
              headerTintColor: "#2D5A27",
              headerBackVisible: false,
            }}
          />
        </Stack> */}
        <Slot /> 
      </ThemeProvider>
    </UserProvider>
  );
}
