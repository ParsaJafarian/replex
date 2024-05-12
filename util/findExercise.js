import { EXERCISES } from "../data/exercises";

export default function findExercise(id) {
    return EXERCISES.find(exercise => exercise.id === id);
}