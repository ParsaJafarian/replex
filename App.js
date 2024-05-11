import { StatusBar } from 'expo-status-bar';
import CameraScreen from './screens/CameraScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import colors from './util/colors';

const Tab = createBottomTabNavigator();

const defaultOptions = {
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTintColor: 'white',
  tabBarActiveTintColor: colors.secondary,
  tabBarStyle: {
    borderTopColor: colors.primary,
    borderTopWidth: 5,
  },
}

export default function App() {
  return <>
    <StatusBar style="light" />
    <NavigationContainer>
      <Tab.Navigator screenOptions={defaultOptions}>
        <Tab.Screen name="Camera" component={CameraScreen} options={{
          tabBarIcon: ({ color }) => <Ionicons name="camera" size={30} color={color} />
        }} />
        <Tab.Screen name="Workout" component={WorkoutScreen} options={{
          tabBarIcon: ({ color }) => <Ionicons name="barbell" size={30} color={color} />
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  </>
}