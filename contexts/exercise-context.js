import { createContext, useContext, useState } from "react";
import { WorkoutContext } from "./workout-context";
import { Alert } from "react-native";
import findExercise from "../util/findExercise";

export const ExerciseContext = createContext({
    id: '',
    sets: [],
    numSets: 1,
    numReps: 0,
    name: "",
    setExerciseId: () => { },
    resetExercise: () => { },
    addSet: () => { },
    addRep: () => { }
});

export default function ExerciseContextProvider({ children }) {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [sets, setSets] = useState([]);
    const [numSets, setNumSets] = useState(1);
    const [numReps, setNumReps] = useState(0);
    const workoutContext = useContext(WorkoutContext);

    function setExerciseId(_id) {
        setId(_id);
        setName(findExercise(_id).name);
        setNumReps(0);
        setNumSets(1);
    }

    function updateSets(newSets) {
        setSets(newSets);
        workoutContext.updateExercise(id, newSets)
    }

    function resetExercise() {
        updateSets([]);
        setNumSets(1);
        setNumReps(0);
    }

    function addSet() {
        if (sets.length === 0 || numReps === 0)
            return Alert.alert('Alert', 'Please add reps to the current set');

        setNumSets(numSets + 1);
        setNumReps(0);
    }

    function addRep() {
        const updatedSets = [...sets];
        if (updatedSets.length === numSets - 1) updatedSets.push(1);
        else updatedSets[numSets - 1] = updatedSets[numSets - 1] + 1;

        updateSets(updatedSets);
        setNumReps(numReps + 1);
    }

    const value = {
        id,
        name,
        sets,
        numSets,
        numReps,
        setExerciseId,
        resetExercise,
        addSet,
        addRep,
    }

    return (
        <ExerciseContext.Provider value={value}>
            {children}
        </ExerciseContext.Provider>
    );
}