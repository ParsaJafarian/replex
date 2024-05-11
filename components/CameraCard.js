import { Camera, CameraType } from 'expo-camera';
import { useContext, useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CameraFooter from './CameraFooter';
import CameraHeader from './CameraHeader';
import { ExerciseContext } from '../contexts/exercise-context';
import { EXERCISES } from '../data/exercises';

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

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    return (
        <View style={styles.container}>
            <CameraHeader exerciseName={exercise.name} />
            <Camera style={styles.camera} type={type}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity>
                </View>
            </Camera>
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

