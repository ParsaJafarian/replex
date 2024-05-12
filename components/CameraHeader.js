import { View, Text, StyleSheet } from "react-native";
import colors from "../util/colors";
import { useContext } from "react";
import { WorkoutContext } from "../contexts/workout-context";

export default function CameraHeader() {
  const workoutContext = useContext(WorkoutContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{workoutContext.selectedWorkout.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: "white",
    borderColor: colors.primary,
    padding: 10,
    flexDirection: "row",
    backgroundColor: colors.primary,
  },
  title: {
    color: colors.primary,
    fontSize: 24,
  },
});
