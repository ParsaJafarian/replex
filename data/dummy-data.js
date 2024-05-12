import BodyGroup from "../models/BodyGroup";
import Exercise from "../models/Exercise";

export const BODYGROUPS = [
    new BodyGroup('bg1', 'Chest', "chest.webp"),
    new BodyGroup('bg2', 'Back', "back.webp"),
    new BodyGroup('bg3', 'Core', "core.webp"),
    // new BodyGroup('bg4', 'Legs', ),
]

export const EXERCISES = [
    new Exercise('e1', 'bg1', 'Pushups'),
    new Exercise('e2', 'bg3', 'Leg Raise'),
    new Exercise('e3', 'bg3', 'Squats'),
    new Exercise('e4', 'bg3', 'Crunches'),
    // new Exercise('e10', 'bg4', 'Squat'),
    // new Exercise('e11', 'bg4', 'Lunges'),
    // new Exercise('e12', 'bg4', 'Leg Press'),
]