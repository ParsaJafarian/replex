import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import { Camera, CameraType } from "expo-camera";
import * as tf from '@tensorflow/tfjs-core';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import PoseSvg from "./PoseSvg";

const TensorCamera = cameraWithTensors(Camera);

const AUTO_RENDER = true;

const CAM_PREVIEW_WIDTH = Dimensions.get('window').width;
const CAM_PREVIEW_HEIGHT = Dimensions.get('window').height * 0.65;

const MIN_KEYPOINT_SCORE = 0.3;
const OUTPUT_TENSOR_WIDTH = Dimensions.get('window').width;
const OUTPUT_TENSOR_HEIGHT = OUTPUT_TENSOR_WIDTH * 2;

export default function PoseCamera() {
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [cameraType, setCameraType] = useState(CameraType.front);
    const [tfReady, setTfReady] = useState(false);
    const [poses, setPoses] = useState([]);
    const model = useRef(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        async function createPoseDetector() {
            await tf.ready().catch((err) => console.error(err));
            setTfReady(true);

            const modelName = poseDetection.SupportedModels.MoveNet;
            const detectorConfig = {
                modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
                enableTracking: true,
                trackerType: poseDetection.TrackerType.BoundingBox,
            }
            model.current = await poseDetection.createDetector(modelName, detectorConfig).catch((err) => console.error(err));
        }
        createPoseDetector();
    }, []);

    function handleCameraStream(images, updatePreview, gl) {
        const loop = async () => {
            const imageTensor = images.next().value;
            if (model.current == null) {
                requestAnimationFrame(loop);
                return;
            }

            let hasError = false
            const poses = await model.current.estimatePoses(imageTensor, undefined, Date.now()).catch((err) => {
                console.log("line 52");
                console.error(err);
                hasError = true;
            })
            if (hasError) {
                requestAnimationFrame(loop);
                return;
            }
            setPoses(poses);

            tf.dispose(imageTensor);

            if (!AUTO_RENDER) {
                updatePreview();
                gl.endFrameEXP();
            }

            requestAnimationFrame(loop);
        }
        loop();
    }

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    if (!tfReady || !model) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>
                    Loading TensorFlow...
                </Text>
            </View>
        );
    }

    return <View style={styles.container}>
        <TensorCamera
            style={styles.camera}
            type={cameraType}
            resizeHeight={OUTPUT_TENSOR_HEIGHT}
            resizeWidth={OUTPUT_TENSOR_WIDTH}
            resizeDepth={3}
            onReady={handleCameraStream}
            autorender={AUTO_RENDER}
            ref={cameraRef}
        />
        <PoseSvg
            poses={poses}
            cameraWidth={CAM_PREVIEW_WIDTH}
            cameraHeight={CAM_PREVIEW_HEIGHT}
            outputTensorWidth={OUTPUT_TENSOR_WIDTH}
            outputTensorHeight={OUTPUT_TENSOR_HEIGHT}
            cameraType={cameraType}
            minKeyPointScore={MIN_KEYPOINT_SCORE}
        />

    </View>

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
})