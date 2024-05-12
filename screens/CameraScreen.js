import { StyleSheet, View } from "react-native";
import CameraCard from "../components/camera/CameraCard";
import ExerciseContextProvider from "../contexts/exercise-context";
import SearchWorkout from "../components/SearchWorkout";
import colors from "../util/colors";

export default function CameraScreen() {
  return (
    <View style={styles.container}>
      <ExerciseContextProvider>
        <SearchWorkout />
        <CameraCard />
      </ExerciseContextProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.third,
  },
  button: {
    flex: 1,
  },
});
