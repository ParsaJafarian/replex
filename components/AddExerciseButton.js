import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../util/colors";
import { useContext } from "react";
import { ExerciseContext } from "../contexts/exercise-context";
import { WorkoutContext } from "../contexts/workout-context";
import { EXERCISES } from "../data/dummy-data";

export default function AddExerciseButton() {
    const exerciseContext = useContext(ExerciseContext);
    const exerciseId = exerciseContext.id;
    const exercise = EXERCISES.find(exercise => exercise.id === exerciseId);

    const workoutContext = useContext(WorkoutContext);
    const workout = workoutContext.workout;

    const hasError = workout.some(item => item.id === exerciseId) || exerciseContext.sets.length === 0;

    function addExerciseToWorkout() {
        workoutContext.addExercise({
            id: exerciseId,
            name: exercise.name,
            sets: exerciseContext.sets
        });
        console.log("Exercise added to workout")
    }

    return <TouchableOpacity
        style={styles.buttonContainer}
        onPress={addExerciseToWorkout}
        disabled={hasError}
    >
        <View style={hasError ? [styles.button, styles.disabledButton] : styles.button}>
            <Text style={styles.buttonText}>
                Add Exercise to Workout
            </Text>
        </View>
    </TouchableOpacity>
};


const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    button: {
        backgroundColor: colors.secondary,
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
    },
    disabledButton: {
        backgroundColor: 'grey',
    }
})
