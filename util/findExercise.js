import { EXERCISES } from "../data/dummy-data";

export default function findExercise(id) {
    return EXERCISES.find(exercise => exercise.id === id);
}