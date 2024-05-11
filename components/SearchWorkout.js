import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AutocompleteInput from "react-native-autocomplete-input";
import { WorkoutContext } from "../contexts/workout-context";


export default function SearchWorkout() {

    const workoutContext = useContext(WorkoutContext);

    const [filtered, setFiltered] = useState([]); // Filtered drop down workouts the match query
    const [query, setQuery] = useState('');

    function filterData(query) {
        return workoutContext.workouts.filter(workout => {
            return workout.name.toLowerCase().includes(query.toLowerCase());
        })
    }

    function changeTextHandler(query) {
        console.log(workoutContext.workouts);
        setQuery(query);
        // console.log(filterData(query));
        setFiltered(filterData(query));
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
                        <TouchableOpacity onPress={() => {}}>
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