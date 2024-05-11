import { StatusBar } from 'expo-status-bar';
import CameraScreen from './screens/CameraScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

const Tab = createBottomTabNavigator();

export default function App() {
  return <>
    <StatusBar style="light" />
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="Workout" component={WorkoutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  </>
}