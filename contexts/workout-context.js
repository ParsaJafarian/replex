import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExerciseContext } from "../contexts/exercise-context";

export const WorkoutContext = createContext({
    load: () => { },
    workouts: [], // All workouts, loaded from memory
    selectedWorkout: {}, // Workout user has selected from SearchWorkout
    setSelectedWorkout: () => { }, // Setter for selected workout, used in SearchWorkout
    workout: [], // Curent workout progress
    exerciseIdx: 0,
    setExerciseIdx: () => { },
    addWorkout: () => { },
    addExercise: () => { },
    updateExercise: () => { },
    resetWorkout: () => { },
    removeExercise: () => { },
    updateStatus: () => { }
})

export default function WorkoutContextProvider({ children }) {
    const [workouts, setWorkouts] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState({});
    const [workout, setWorkout] = useState([]);
    const [exerciseIdx, setExerciseIdx] = useState(0); // Index of exercise within the selected workout 
    const exerciseContext = useContext(ExerciseContext);

    function updateStatus() {
        const listOfEx = JSON.parse(selectedWorkout["exercises"]);
        console.log(listOfEx.length)
        console.log(exerciseIdx + 1)
        if (exerciseIdx + 1 >= listOfEx.length) {
            console.log("WORKOUT COMPLETED, WOW!");
        } else {
            
            console.log(selectedWorkout);
            
            const nextEx = listOfEx[exerciseIdx + 1];
            console.log(nextEx)
            exerciseContext.setExerciseId(nextEx.id);
            exerciseContext.setSets(nextEx.sets);
            setExerciseIdx(prev=>prev + 1);
        }
    }

    function addExercise(exercise) {
        setWorkout([...workout, exercise]);
    }
    const resetWorkout = () => setWorkout([]);

    function updateExercise(id, sets) {
        const exercise = workout.find((exercise) => exercise.id === id);
        if (!exercise) return;

        const updatedWorkout = workout.map((exercise) => {
            return exercise.id === id ? { ...exercise, sets } : exercise;
        });
        setWorkout(updatedWorkout);
    }

    function removeExercise(id) {
        const updatedWorkout = workout.filter((exercise) => exercise.id !== id);
        setWorkout(updatedWorkout);
    }

    const load = async () => {
        console.log("Loading workouts from memory...");
        try {
            let oldWorkouts = await AsyncStorage.getItem('workouts');
            if (oldWorkouts !== null) {
                setWorkouts(JSON.parse(oldWorkouts));
                console.log(JSON.parse(oldWorkouts));
            }
        } catch (err) {
            alert(e);
        }
    }

    useEffect(() => {
        load();
    }, []);

    const value = {
        load,
        workouts,
        selectedWorkout,
        setSelectedWorkout,
        workout,
        setExerciseIdx,
        addExercise,
        updateExercise,
        resetWorkout,
        removeExercise,
        updateStatus
    };

    return <WorkoutContext.Provider value={value}>
        {children}
    </WorkoutContext.Provider>
}