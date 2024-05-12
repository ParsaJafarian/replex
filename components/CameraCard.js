import { Camera, CameraType } from 'expo-camera';
import { useContext, useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CameraFooter from './CameraFooter';
import CameraHeader from './CameraHeader';
import { ExerciseContext } from '../contexts/exercise-context';
import { EXERCISES } from '../data/dummy-data';
import colors from '../util/colors';
import * as tf from '@tensorflow/tfjs-core';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-react-native';

export default function CameraCard() {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [isTfReady, setTfReady] = useState(false);
    const poseDetector = useRef(null);

    const exerciseContext = useContext(ExerciseContext);
    const getExercise = (id) => EXERCISES.find(exercise => exercise.id === id);
    const exercise = getExercise(exerciseContext.id);

    useEffect(() => {
        async function createPoseDetector() {
            await tf.ready();
            setTfReady(true);

            const modelName = poseDetection.SupportedModels.MoveNet;
            const detectorConfig = {
                modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
                enableTracking: true,
                trackerType: poseDetection.TrackerType.BoundingBox,
            }
            poseDetector.current = await poseDetection.createDetector(modelName, detectorConfig);
        }
        createPoseDetector();
    }, [])

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>Please select an exercise</Text>
            </View>
        );
    }

    if (!exercise) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>Please select an exercise</Text>
            </View>
        );
    }

    if (!isTfReady) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>Loading TensorFlow...</Text>
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
        marginTop: 20,
        flex: 1,
        justifyContent: 'center',
        borderBottomColor: colors.primary,
        borderBottomWidth: 1,
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

