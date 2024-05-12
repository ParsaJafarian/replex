import { useContext, useLayoutEffect, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  StyleSheet,
  Button,
  Alert,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WorkoutContext } from "../contexts/workout-context";
import { ExerciseContext } from "../contexts/exercise-context";
import uuid from "react-native-uuid";
import ShareButton from "../components/ShareButton";
import SearchExercise from "../components/SearchExercise";

export default function WorkoutScreen({ navigation }) {
  const workoutContext = useContext(WorkoutContext);
  const exerciseContext = useContext(ExerciseContext);

  const exerciseId = exerciseContext.id;
  const workout = workoutContext.workout;

  const [creating, setCreating] = useState(false); // Is the user creating a workout
  const [workoutName, setWorkoutName] = useState("");
  const [customWorkout, setCustomWorkout] = useState([]);
  // For one exercise
  const [query, setQuery] = useState(""); // Name of exercise
  const [id, setId] = useState(""); // ID of exercise
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <ShareButton data={workout} />,
    });
  }, [navigation]);

  function removeExerciseHandler(id) {
    workoutContext.removeExercise(id);
    if (exerciseId === id) {
      exerciseContext.setExerciseId(null);
    }
  }

  function renderExerciseItem({ item }) {
    return (
      <View style={styles.excercise}>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <View style={styles.setsContainer}>
            <Text style={styles.setsTitle}>Sets:</Text>
            {item.sets.map((set, index) => (
              <View key={index} style={{ flexDirection: "row" }}>
                <Text style={styles.setsText}>{set}</Text>
                <Text style={styles.setsText}>
                  {index < item.sets.length - 1 ? " - " : ""}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeExerciseHandler(item.id)}
        >
          <Ionicons name="remove-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  function addSet() {
    setSets([...sets, Number.parseInt(reps)]);
  }

  function addExercise() {
    const exercise = {
      exercise: query,
      id,
      sets,
    };
    console.log(exercise);
    // Reset fields after adding exercise
    setQuery("");
    setReps("");
    setSets([]);
    setId("");

    // Add to workout
    setCustomWorkout([...customWorkout, exercise]);
  }

  const saveWorkout = async () => {
    try {
      let prevWorkouts = await AsyncStorage.getItem("workouts");
      if (prevWorkouts === null) {
        let workouts = [
          {
            name: workoutName,
            id: uuid.v4(),
            exercises: JSON.stringify(customWorkout),
          },
        ];
        console.log(JSON.stringify(workouts));
        await AsyncStorage.setItem("workouts", JSON.stringify(workouts));
      } else {
        let workouts = JSON.parse(prevWorkouts);
        workouts = [
          ...workouts,
          {
            name: workoutName,
            id: uuid.v4(),
            exercises: JSON.stringify(customWorkout),
          },
        ];
        console.log(JSON.stringify(workouts));
        await AsyncStorage.setItem("workouts", JSON.stringify(workouts));
      }

      workoutContext.load();
    } catch (err) {
      alert(err);
    }
  };

  const clearWorkouts = async () => {
    try {
      await AsyncStorage.removeItem("workouts");
    } catch (e) {
      alert(e);
    }
  };

  return creating ? (
    <View style={styles.container}>
      <Button
        title="back"
        onPress={() => setCreating(creating === false ? true : false)}
      />
      <SafeAreaView>
        <TextInput
          style={styles.input}
          placeholder="Type workout name here..."
          value={workoutName}
          onChangeText={setWorkoutName}
        />
        <SearchExercise query={query} setQuery={setQuery} setId={setId} />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.halfInput}
            placeholder="Repetitions per set"
            keyboardType="numeric"
            value={reps}
            onChangeText={setReps}
          />
          <Button
            title="Add set"
            style={{
              flex: 1,
              borderRadius: 5,
              paddingHorizontal: 10,
              paddingVertical: 8,
            }}
            onPress={addSet}
          />
        </View>
        <Button title="Add exercise" style={styles.btn} onPress={addExercise} />
      </SafeAreaView>
      <Button
        title="Create workout"
        style={{ marginTop: 100 }}
        onPress={saveWorkout}
      />
      <Button
        title="Delete all workouts"
        style={{ marginTop: 100 }}
        onPress={clearWorkouts}
      />
    </View>
  ) : (
    <View>
      <Button
        title="Create workout"
        onPress={() => setCreating(creating === false ? true : false)}
      />
      <FlatList
        data={workout}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  excercise: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  removeButton: {
    backgroundColor: "red",
  },
  input: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  inputContainer: {
    marginTop: 80,
    flexDirection: "row",
    alignItems: "center",
  },
  halfInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  btn: {
    marginTop: 20,
  },
});
