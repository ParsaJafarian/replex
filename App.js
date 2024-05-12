import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import CameraScreen from "./screens/CameraScreen";
import WorkoutScreen from "./screens/WorkoutScreen";
import WorkoutContextProvider from "./contexts/workout-context";
import colors from "./util/colors";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const defaultOptions = {
  headerTitleStyle: {
    fontWeight: "bold",
  },
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTintColor: "white",
  tabBarActiveTintColor: colors.secondary,
  tabBarStyle: {
    borderTopColor: colors.primary,
    borderTopWidth: 5,
    backgroundColor: colors.primary,
  },
  contentStyle: {
    backgroundColor: colors.primary,
  },
};

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <WorkoutContextProvider>
        <NavigationContainer>
          <Tab.Navigator screenOptions={defaultOptions}>
            <Tab.Screen
              name="Camera"
              component={CameraScreen}
              options={{
                tabBarIcon: ({ color }) => (
                  <Ionicons name="camera" size={30} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Workout"
              component={WorkoutScreen}
              options={{
                tabBarIcon: ({ color }) => (
                  <Ionicons name="barbell" size={30} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </WorkoutContextProvider>
    </>
  );
}
