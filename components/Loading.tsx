import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function LoadingScreen() {
  const { colors } = useTheme();
  
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: colors.background 
    }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}