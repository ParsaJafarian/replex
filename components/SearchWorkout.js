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
    const [query, setQuery] = useState('');

    function filterData(query) {
        return workoutContext.workouts.filter(workout => {
            return workout.name.toLowerCase().includes(query.toLowerCase());
        })
    }

    function changeTextHandler(query) {
        setQuery(query);
        // console.log(filterData(query));
        setFiltered(filterData(query));
    }

    function selectWorkout(item) {
        // An item is a {} workout
        // console.log(item)
        setQuery(item.name);
        workoutContext.setSelectedWorkout(item);
        // exerciseContext.setExerciseId(JSON.parse(item.exercises)[0].id);
        exerciseContext.setExerciseInd(0);
    }

    return (
        <View style={styles.container}>
            <AutocompleteInput 
                editable={true}
                value={query}
                data={filtered}
                onChangeText={changeTextHandler}
                flatListProps={{
                    keyboardShouldPersistTaps: 'always',
                    keyExtractor: item => item.id,
                    renderItem: ({ item }) => (
                        <TouchableOpacity onPress={() => {selectWorkout(item)}}>
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                    ),
                }}
                clearButtonMode="always"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        left: 0,
        position: 'absolute',
        right: 0,
        padding: 5,
        zIndex: 1,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
    },
})
