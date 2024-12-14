import { useFonts } from 'expo-font';

export default function useCustomFonts() {
  const [fontsLoaded] = useFonts({
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'JosefinSans-SemiBold' : require("../assets/fonts/JosefinSans-SemiBold.ttf"),
    'Poppins-SemiBold' : require("../assets/fonts/Poppins-SemiBold.ttf"),
    'JosefinSans-Bold' : require("../assets/fonts/JosefinSans-Bold.ttf"),

  });

  return fontsLoaded;
}
