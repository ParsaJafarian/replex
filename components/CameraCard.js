import { Camera, CameraType } from 'expo-camera';
import { useContext, useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CameraFooter from './CameraFooter';
import CameraHeader from './CameraHeader';
import { ExerciseContext } from '../contexts/exercise-context';
import { EXERCISES } from '../data/dummy-data';
import * as tf from '@tensorflow/tfjs-core';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-react-native';
import PoseCamera from './ai/PoseCamera';

export default function CameraCard() {
    const [type, setType] = useState(CameraType.back);

    const exerciseContext = useContext(ExerciseContext);
    const getExercise = (id) => EXERCISES.find(exercise => exercise.id === id);
    const exercise = getExercise(exerciseContext.id);

    if (!exercise) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>Please select an exercise</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraHeader exerciseName={exercise.name} />
            <PoseCamera type={type} />
            <CameraFooter />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        height: "70%",
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    }
});

