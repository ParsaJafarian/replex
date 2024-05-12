export class Exercise {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

export const EXERCISES = [
    new Exercise('e1', 'Pushups'),
    new Exercise('e2', 'Leg Raise'),
    new Exercise('e3', 'Squats'),
    new Exercise('e4', 'Crunches'),
]