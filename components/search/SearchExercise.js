import AutocompleteInput from "react-native-autocomplete-input";
import { TouchableOpacity, View, Text, StyleSheet, Button, Alert } from "react-native";
import { EXERCISES } from "../../data/exercises";
import { useContext, useState } from "react";
import { ExerciseContext } from "../../contexts/exercise-context";
import { WorkoutContext } from "../../contexts/workout-context";

export default function SearchExercise({ query, setQuery, setId }) {
    const exerciseContext = useContext(ExerciseContext);
    const workoutContext = useContext(WorkoutContext);
    const [exercises, setExercises] = useState([]); // EXERCISES

    const workout = workoutContext.workout;
    const exerciseInWorkout = (exercise) => workout.some(item => item.id === exercise.id);
    const isChosenExercise = (exercise) => exercise.id === exerciseContext.id;

    function filterData(query) {
        return EXERCISES.filter(exercise => {
            const exerciseInQuery = exercise.name.toLowerCase().includes(query.toLowerCase());
            return !exerciseInWorkout(exercise, query) && exerciseInQuery & !isChosenExercise(exercise);
        });
    }

    function changeTextHandler(query) {
        setQuery(query);
        const exercise = EXERCISES.find(exercise => exercise.name.toLowerCase() === query.toLowerCase());

        if (exercise) selectExercise(exercise);
        else if (query === '') setExercises([]);
        else setExercises(filterData(query));
    }

    function selectExercise(item) {
        setExercises([]);
        setExercise(item);
    }

    function setExercise(item) {
        setQuery(item.name);
        setId(item.id);
    }

    return <View style={styles.container}>
        <AutocompleteInput
            editable={true}
            value={query}
            placeholder="Search Exercises"
            data={exercises}
            onChangeText={changeTextHandler}
            flatListProps={{
                keyboardShouldPersistTaps: 'always',
                keyExtractor: item => item.id,
                renderItem: ({ item }) => (
                    <TouchableOpacity onPress={() => selectExercise(item)}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                ),
            }}
            clearButtonMode="always"
        />
    </View>
};

const styles = StyleSheet.create({
    container: {
        left: 0,
        position: 'absolute',
        top: 80,
        right: 0,
        padding: 5,
        zIndex: 1,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
    },
})