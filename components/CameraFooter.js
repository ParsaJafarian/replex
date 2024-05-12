import { StyleSheet, View, Button } from "react-native";
import ValueCard from "./ValueCard";
import { useContext } from "react";
import { ExerciseContext } from "../contexts/exercise-context";

export default function CameraFooter({ exerciseName }) {
  const exerciseContext = useContext(ExerciseContext);

  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        <ValueCard title="Exercise" value={exerciseName} />
        <ValueCard title="Reps left" value={exerciseContext.getImpReps()} />
        <ValueCard title="Sets left" value={exerciseContext.sets.length} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { display: "flex", gap: 20, paddingVertical: 10 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 0,
  },
});
