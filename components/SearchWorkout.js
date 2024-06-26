import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AutocompleteInput from "react-native-autocomplete-input";
import { WorkoutContext } from "../contexts/workout-context";
import { ExerciseContext } from "../contexts/exercise-context";

export default function SearchWorkout() {
  const workoutContext = useContext(WorkoutContext);
  const exerciseContext = useContext(ExerciseContext);

  const [filtered, setFiltered] = useState([]); // Filtered drop down workouts the match query
  const [query, setQuery] = useState("");

  function filterData(query) {
    return workoutContext.workouts.filter((workout) => {
      return workout.name.toLowerCase().includes(query.toLowerCase());
    });
  }

  function changeTextHandler(query) {
    setQuery(query);
    // console.log(filterData(query));
    setFiltered(filterData(query));
  }

  function selectWorkout(item) {
    // An item is a {} workout
    setQuery(item.name);
    workoutContext.setSelectedWorkout(item);
    workoutContext.setExerciseIdx(0);

    console.log(item);
    console.log(workoutContext.selectedWorkout);

    const firstEx = JSON.parse(item["exercises"])[0];

    setFiltered([]);
    exerciseContext.setExerciseId(firstEx.id);
    exerciseContext.setSets(firstEx.sets);

    // Load initial exercises
    // exerciseContext.setExerciseId(JSON.parse(item.exercises)[0].id);
  }

  return (
    <View style={styles.container}>
      <AutocompleteInput
        editable={true}
        value={query}
        data={filtered}
        onChangeText={changeTextHandler}
        placeholderTextColor={"white"}
        style={{ backgroundColor: colors.third, color: "white" }}
        flatListProps={{
          keyboardShouldPersistTaps: "always",
          keyExtractor: (item) => item.id,
          renderItem: ({ item }) => (
            <TouchableOpacity
              style={{ backgroundColor: colors.third }}
              onPress={() => {
                selectWorkout(item);
              }}
            >
              <Text style={{ color: "white" }}>{item.name}</Text>
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
    zIndex: 100,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
  },
});
