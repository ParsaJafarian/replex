import { useContext } from 'react';
import {  StyleSheet, Text, View } from 'react-native';
import CameraFooter from './CameraFooter';
import CameraHeader from './CameraHeader';
import PoseCamera from './ai/PoseCamera';
import { WorkoutContext } from '../contexts/workout-context';

const createWorkoutMessage = "Please create a workout to start";
const selectWorkoutMessage = "Please select a workout to start";

export default function CameraCard() {
    const workoutContext = useContext(WorkoutContext);
    const currentWorkout = workoutContext.workout;
    const workouts = workoutContext.workouts;
    const firstExercise = currentWorkout[0];

    if (!currentWorkout || workouts.length === 0) {
        const message = workouts.length === 0 ? createWorkoutMessage : selectWorkoutMessage;
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    {message}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraHeader exerciseName={firstExercise.name} />
            <PoseCamera/>
            <CameraFooter exerciseName={firstExercise.name} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

