"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useColorScheme } from "react-native"

type ThemeType = "light" | "dark" | "system"

interface ThemeContextType {
  theme: ThemeType
  isDarkMode: boolean
  setTheme: (theme: ThemeType) => void
  colors: {
    primary: string
    background: string
    card: string
    text: string
    border: string
    notification: string
    error: string
    success: string
    warning: string
    info: string
    muted: string
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme()
  const [themeType, setThemeType] = useState<ThemeType>("system")

  const isDarkMode = themeType === "system" ? systemColorScheme === "dark" : themeType === "dark"

  const lightColors = {
    primary: "#2D5A27",
    background: "#FFFFFF",
    card: "#F9FAFB",
    text: "#1F2937",
    border: "#E5E7EB",
    notification: "#EF4444",
    error: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
    info: "#3B82F6",
    muted: "#6B7280",
  }

  const darkColors = {
    primary: "#4ADE80",
    background: "#1F2937",
    card: "#374151",
    text: "#F9FAFB",
    border: "#4B5563",
    notification: "#EF4444",
    error: "#F87171",
    success: "#34D399",
    warning: "#FBBF24",
    info: "#60A5FA",
    muted: "#9CA3AF",
  }

  const colors = isDarkMode ? darkColors : lightColors

  const setTheme = (newTheme: ThemeType) => {
    setThemeType(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme: themeType, isDarkMode, setTheme, colors }}>{children}</ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

