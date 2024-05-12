import { useContext, useLayoutEffect } from "react";
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { WorkoutContext } from "../contexts/workout-context";
import { ExerciseContext } from "../contexts/exercise-context";
import { Ionicons } from '@expo/vector-icons'; // Ensure you have this import if you use icons
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
        return (
            <View style={styles.excercise}>
                <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{item.name}</Text>
                    <View style={styles.setsContainer}>
                        <Text style={styles.setsTitle}>Sets:</Text>
                        {item.sets.map((set, index) => (
                            <View key={index} style={{ flexDirection: 'row' }}>
                                <Text style={styles.setsText}>
                                    {set}
                                </Text>
                                <Text style={styles.setsText}>
                                    {index < item.sets.length - 1 ? ' - ' : ''}
                                </Text>
                            </View>

                        ))}
                    </View>
                </View>
                <TouchableOpacity style={styles.removeButton} onPress={() => removeExerciseHandler(item.id)}>
                    <Ionicons name="remove-circle" size={24} color="white" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={workout}
                keyExtractor={(item) => item.id}
                renderItem={renderExerciseItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0', // Light grey background
    },
    excercise: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        backgroundColor: 'white',
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
    },
    setsContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    setsText: {
        color: '#666',
    },
    setsTitle: {
        fontSize: 14,
        marginRight: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    removeButton: {
        padding: 6,
        backgroundColor: '#ff6347', // Tomato color
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
