import AutocompleteInput from "react-native-autocomplete-input";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import { EXERCISES } from "../data/dummy-data";
import { useContext, useState, useEffect } from "react";
import { ExerciseContext } from "../contexts/exercise-context";
import { WorkoutContext } from "../contexts/workout-context";

export default function SearchBar() {
  const exerciseContext = useContext(ExerciseContext);
  const workoutContext = useContext(WorkoutContext);
  const [suggestions, setSuggestions] = useState([]); // [EXERCISES
  const [query, setQuery] = useState("");
  const [, setForceUpdate] = useState(false); // Add a state variable to force re-render

  const workout = workoutContext.workout;
  const exerciseInWorkout = (exercise) =>
    workout.some((item) => item.id === exercise.id);
  const isChosenExercise = (exercise) => exercise.id === exerciseContext.id;

  useEffect(() => {
    setForceUpdate((prev) => !prev); // Update the state variable to force re-render
  }, [exerciseContext.id, exerciseContext.name]);

  function filterData(query) {
    return EXERCISES.filter((exercise) => {
      const exerciseInQuery = exercise.name
        .toLowerCase()
        .includes(query.toLowerCase());
      return (
        !exerciseInWorkout(exercise, query) &&
        exerciseInQuery & !isChosenExercise(exercise)
      );
    });
  }

  function changeTextHandler(query) {
    setQuery(query);
    const exercise = EXERCISES.find(
      (exercise) => exercise.name.toLowerCase() === query.toLowerCase()
    );

    // console.log(exercise);
    if (exercise) selectExercise(exercise);
    else if (query === "") setSuggestions([]);
    else setSuggestions(filterData(query));
  }

  function selectExercise(item) {
    setSuggestions([]);
    setExercise(item);
  }

  function setExercise(item) {
    setQuery(item.name);
    // console.log(exerciseContext.name);
    exerciseContext.setExerciseId(item.id);
  }

  return (
    <View style={styles.container}>
      <AutocompleteInput
        editable={true}
        value={query}
        placeholder="Search Exercises"
        data={suggestions}
        onChangeText={changeTextHandler}
        flatListProps={{
          keyboardShouldPersistTaps: "always",
          keyExtractor: (item) => item.id,
          renderItem: ({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => selectExercise(item)}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          ),
        }}
        clearButtonMode="always"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    left: 0,
    position: "absolute",
    right: 0,
    padding: 5,
    zIndex: 50,
  },
  item: {
    borderBottomWidth: 1,
    zIndex: 50,
  },
});
