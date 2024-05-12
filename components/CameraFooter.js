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
                <ValueCard title="Reps" value={exerciseContext.numReps} />
                <ValueCard title="Sets" value={exerciseContext.numSets} />
            </View>
            <View style={styles.footer}>
                <Button title="Add Rep" onPress={exerciseContext.addRep} />
                <Button title="Reset" onPress={exerciseContext.resetExercise} />
                {/* <Button title="Add Set" onPress={exerciseContext.addSet} /> */}
                <Button title="Add Set" onPress={exerciseContext.addSet} />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {

    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }
});