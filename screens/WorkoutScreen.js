import { useContext, useLayoutEffect } from "react";
import { FlatList, Text, View, StyleSheet, Button } from "react-native";
import { WorkoutContext } from "../contexts/workout-context";
import { ExerciseContext } from "../contexts/exercise-context";
import ShareButton from "../components/ShareButton";

export default function WorkoutScreen({ navigation }) {
    const workoutContext = useContext(WorkoutContext);
    const exerciseContext = useContext(ExerciseContext);

    const exerciseId = exerciseContext.id;
    const workout = workoutContext.workout;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <ShareButton data={workout} />
        });
    }, [navigation]);

    function removeExerciseHandler(id) {
        workoutContext.removeExercise(id);
        if (exerciseId === id) {
            exerciseContext.setExerciseId(null);
        }
    }

    function renderExerciseItem({ item }) {
        return <View style={styles.excercise}>
            <Text>{item.name}</Text>
            {item.sets.map((set, index) => {
                return <Text key={index}>{set}</Text>
            })}
            <Button
                title="Remove"
                onPress={() => removeExerciseHandler(item.id)}
                style={styles.removeButton}
            />
        </View>
    }

    return <View>
        <FlatList
            data={workout}
            keyExtractor={(item) => item.id}
            renderItem={renderExerciseItem}
        />
    </View>
};

const styles = StyleSheet.create({
    excercise: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    removeButton: {
        backgroundColor: 'red',
    }
})
