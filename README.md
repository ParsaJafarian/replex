# RepLex
The user can first create their own personal workout and customize it to their own liking. Then, they can choose any workout they created in order to do the selected exercises. With the user filming themself while performing the exercises, RepLex counts the user's remaining reps and sets. As such, the user is free of the hassle of counting. Moreover, gym teachers don't have to be suspicious of students cheating because the model never lies.

## How to start

```bash
npm install
npm start
```
## How it was built
We built it using React Native, a cross platform framework that is written in React like code in javascript but that compiles to native iOS and Android code. Movenet, a pre-built tensorflow pose detection model from Google is also used in order to detect the user's poses.

## Challenges
React native and mobile development does not have the general community support that Web has. As such, finding solutions on online forums were much harder than if we were making a web-app. Moreover, the tensorflow-react-native library that we were using was outdated. As such, many conflicts arose between node packages of the app.

## What's next
Currently, there are not many featured exercises that can be correctly counted. The next step would be to add the related conditions to new exercises so that the model recognizes them as well.
