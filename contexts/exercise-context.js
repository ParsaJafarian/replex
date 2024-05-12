import { createContext, useContext, useState } from "react";
import { WorkoutContext } from "./workout-context";
import { Alert } from "react-native";
import findExercise from "../util/findExercise";
import { Dialog, ALERT_TYPE } from "react-native-alert-notification";

export const ExerciseContext = createContext({
  id: "",
  sets: [],
  numSets: 1,
  numReps: 0,
  setExerciseIndex: () => {},
  setExerciseId: () => {},
  resetExercise: () => {},
  setSets: () => {},
  setNumReps: () => {},
  addSet: () => {},
  doRep: () => {},
  getImpReps: () => {},
});

export default function ExerciseContextProvider({ children }) {
  const [id, setId] = useState("");
  const [exerciseIndex, setExerciseIndex] = useState(0); // Index of exercise within the selected workout
  const [sets, setSets] = useState([]);
  const [setsLeft, setSetsLeft] = useState([]);
  const [numSets, setNumSets] = useState(1);
  const [numReps, setNumReps] = useState(0);
  const workoutContext = useContext(WorkoutContext);

  function setExerciseInd(num) {
    setExerciseIndex(num); // Set index

    // console.log(workoutContext.selectedWorkout.exercises);
    // console.log(JSON.parse(workoutContext.selectedWorkout.exercises)[num]);
    // setId(JSON.parse(workoutContext.selectedWorkout.exercises)[num].id); // Update ID to match the index
    // setSetsLeft(JSON.parse(workoutContext.selectedWorkout.exercises)[num].sets);
  }

  function getImpReps() {
    if (sets.length === 0) return;
    return sets[0];
  }

  function setExerciseId(id) {
    setId(id);
    // setNumReps(0);
    // setNumSets(1);
  }

  function updateSets(newSets) {
    setSets(newSets);
    workoutContext.updateExercise(id, newSets);
  }

  function resetExercise() {
    updateSets([]);
    setNumSets(1);
    setNumReps(0);
  }

  function addSet() {
    if (sets.length === 0 || numReps === 0)
      return Alert.alert("Alert", "Please add reps to the current set");

    setNumSets(numSets + 1);
    setNumReps(0);
  }

  function doRep() {
    if (sets.length === 0) return;
    if (sets[0] === 0) return;

    let newRepSet = sets[0] - 1;
    if (newRepSet === 0) {
      if (sets.length === 1) {
        // workoutContext.updateStatus();

        const listOfEx = JSON.parse(
          workoutContext.selectedWorkout["exercises"]
        );
        if (workoutContext.exerciseIdx + 1 >= listOfEx.length) {
          // console.log("WORKOUT COMPLETED, WOW!");
          setId("");
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Success',
            textBody: 'You completed your workout!',
            button: 'close',
          })
        } else {
          console.log(workoutContext.selectedWorkout);
          console.log(workoutContext.exerciseIdx + 1);
          const nextEx = listOfEx[workoutContext.exerciseIdx + 1];
          console.log(nextEx);
          setExerciseId(nextEx.id);
          setSets(nextEx.sets);
          workoutContext.setExerciseIdx((prev) => prev + 1);
        }
      } else {
        setSets(sets.slice(1));
      }
    } else {
      setSets([newRepSet, ...sets.slice(1)]);
    }
    console.log(newRepSet, sets);
  }

  const value = {
    id,
    sets,
    numSets,
    numReps,
    setExerciseIndex,
    setExerciseId,
    resetExercise,
    addSet,
    setSets,
    setNumReps,
    doRep,
    getImpReps,
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
}
