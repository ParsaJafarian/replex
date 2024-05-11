import { createContext, useContext, useState } from "react";

export const WorkoutContext = createContext({
    workout: [],
    addExercise: () => { },
    updateExercise: () => { },
    resetWorkout: () => { },
    removeExercise: () => { }
})

export default function WorkoutContextProvider({ children }) {
    const [workout, setWorkout] = useState([]);

    function addExercise(exercise){
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

    const value = {
        workout,
        addExercise,
        updateExercise,
        resetWorkout,
        removeExercise
    };

    return <WorkoutContext.Provider value={value}>
        {children}
    </WorkoutContext.Provider>
}