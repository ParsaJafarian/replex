import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import { Camera, CameraType } from "expo-camera";
import * as tf from "@tensorflow/tfjs-core";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import PoseSvg from "./PoseSvg";
import { ExerciseContext } from "../../contexts/exercise-context";
import findExercise from "../../util/findExercise";
import { useIsFocused } from "@react-navigation/native";

const TensorCamera = cameraWithTensors(Camera);

const AUTO_RENDER = true;

const CAM_PREVIEW_WIDTH = roundNumber(Dimensions.get("window").width);
const CAM_PREVIEW_HEIGHT = roundNumber(Dimensions.get("window").height * 0.65);
// const CAM_PREVIEW_WIDTH = 244;
// const CAM_PREVIEW_HEIGHT = 244;

const MIN_KEYPOINT_SCORE = 0.3;
const OUTPUT_TENSOR_WIDTH = roundNumber(Dimensions.get("window").width);
const OUTPUT_TENSOR_HEIGHT = roundNumber(
  Dimensions.get("window").height * 0.65
);

function roundNumber(n) {
  let x = 4;
  return Math.floor((n + x - 1) / x) * x;
}

export default function PoseCamera() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraType, setCameraType] = useState(CameraType.front);
  const [tfReady, setTfReady] = useState(false);
  const [poses, setPoses] = useState([]);
  const model = useRef(null);
  const cameraRef = useRef(null);
  const exerciseNameRef = useRef("Pushups");
  const isFocusedRef = useRef(true);

  const exerciseContext = useContext(ExerciseContext);
  const [, setForceUpdate] = useState(false); // Add a state variable to force re-render
  const isFocused = useIsFocused();

  let requestAnimationFrameId = 0;
  let frameCount = 0;
  const makePredictionsEveryNFrames = 1;

  // componentDidMount() {
  //   const { navigation } = this.props;
  //   navigation.addListener('willFocus', () =>
  //     this.setState({ focusedScreen: true })
  //   );
  //   navigation.addListener('willBlur', () =>
  //     this.setState({ focusedScreen: false })
  //   );
  // }

  useEffect(() => {
    setForceUpdate((prev) => !prev); // Update the state variable to force re-render
    console.log(exerciseContext.name);
    exerciseNameRef.current = findExercise(exerciseContext.id).name;
  }, [exerciseContext.id]);


  useEffect(() => {
    setForceUpdate((prev) => !prev); // Update the state variable to force re-render
    isFocusedRef.current = isFocused;
  }, [isFocused]);

  useEffect(() => {
    async function createPoseDetector() {
      await tf.ready().catch((err) => console.error(err));

      const modelName = poseDetection.SupportedModels.MoveNet;
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableTracking: true,
        trackerType: poseDetection.TrackerType.BoundingBox,
      };
      model.current = await poseDetection
        .createDetector(modelName, detectorConfig)
        .catch((err) => console.error(err));
      setTfReady(true);
    }
    createPoseDetector();
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestAnimationFrameId);
    };
  }, [requestAnimationFrameId]);

  function getCoordinatesFromName(name, pose) {
    if (pose[0] == null || pose[0]["keypoints"] == null) return;

    // for (let index = 0; index < pose[0]["keypoints"].length; index++) {
    //   const element = pose[0]["keypoints"][index];
    //   if(element.score > 0.2)
    //     console.log(element);
    // }
    const keypoint = pose[0]["keypoints"].find((k) => k.name === name);
    if (keypoint === undefined || keypoint.score < 0.2) return undefined;
    const flipX = cameraType === CameraType.back;
    const x = flipX ? keypoint.x : OUTPUT_TENSOR_WIDTH - keypoint.x;
    const y = keypoint.y;
    const cx = (x / OUTPUT_TENSOR_WIDTH) * CAM_PREVIEW_WIDTH;
    const cy = (y / OUTPUT_TENSOR_HEIGHT) * CAM_PREVIEW_HEIGHT;
    return { x: cx, y: cy };
  }

  function calculateAngles(a, b, c) {
    if (a == null || b == null || c == null) return undefined;
    const radians =
      Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);

    let angle = Math.abs((radians * 180.0) / Math.PI);

    if (angle > 180.0) {
      angle = 360 - angle;
    }

    return angle;
  }

  const exerciseConfigs = {
    Pushups: {
      downAngleRange: { min: 0, max: 20 },
      upAngleRange: { min: 55, max: 90 },
      points: ["left_elbow", "left_shoulder", "left_hip"],
    },
    Squats: {
      downAngleRange: { min: 60, max: 90 },
      upAngleRange: { min: 150, max: 180 },
      points: ["left_ankle", "left_knee", "left_hip"],
    },
    "Leg Raise": {
      downAngleRange: { min: 160, max: 180 },
      upAngleRange: { min: 70, max: 100 },
      points: ["left_ankle", "left_hip", "left_shoulder"],
    },
    Crunches: {
      downAngleRange: { min: 120, max: 150 },
      upAngleRange: { min: 50, max: 90 },
      points: ["left_knee", "left_hip", "left_shoulder"],
    },
  };

  // Initialize the state object
  const state = {
    count: 0,
    isDown: false,
    exercise: "Pushups", // Set the default exercise
  };

  // Function to check if an angle is within a given range
  function isAngleInRange(angle, range) {
    return angle >= range.min && angle <= range.max;
  }

  // Function to update the rep count
  function updateRepCount(angle) {
    if (angle == null) return;
    // console.log(angle);
    // Get the current exercise configuration
    const currentExerciseConfig = exerciseConfigs[state.exercise];

    // Check if the angle is within the down range
    const isCurrentlyDown = isAngleInRange(
      angle,
      currentExerciseConfig.downAngleRange
    );

    // Check if the angle is within the up range
    const isCurrentlyUp = isAngleInRange(
      angle,
      currentExerciseConfig.upAngleRange
    );

    // Update the count and isDown state based on the current position
    if (isCurrentlyDown) {
      state.isDown = true;
    } else if (isCurrentlyUp) {
      if (state.isDown) {
        state.count++;
        exerciseContext.addRep();
        console.log(`${state.exercise} count:`, state.count);
      }
      state.isDown = false;
    }
  }

  function handleCameraStream(images, updatePreview, gl) {
    const loop = async () => {
      frameCount += 1;
      frameCount = frameCount % makePredictionsEveryNFrames;
      if (!isFocusedRef.current) {
        return;
      }
      if (frameCount === 0) {
        const imageTensor = images.next().value;
        if (!imageTensor || !model.current) {
          requestAnimationFrame(loop);
          return;
        }

        let hasError = false;
        const poses = await model.current
          .estimatePoses(imageTensor, undefined, Date.now())
          .catch((err) => {
            console.log("line 52");
            console.error(err);
            hasError = true;
          });
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

        // console.log(exercise.name);
        const newExName = exerciseNameRef.current;
        state.exercise = newExName;

        const [aName, bName, cName] = exerciseConfigs[state.exercise].points;

        const aLoc = getCoordinatesFromName(aName, poses);
        const bLoc = getCoordinatesFromName(bName, poses);
        const cLoc = getCoordinatesFromName(cName, poses);

        // console.log(left_elbow_loc);
        // console.log(left_shoulder_loc);
        // console.log(left_hip_loc);
        const angle = calculateAngles(aLoc, bLoc, cLoc);
        updateRepCount(angle);
      }
      if (isFocusedRef.current) {
        // updatePreview();
        // gl.endFrameEXP();

        // Continue the loop only if the screen is focused
        requestAnimationFrameId = requestAnimationFrame(loop);
      }
    };
    try {
      if (isFocused)
        loop();
    } catch (error) {
      console.log("oh no");
    }
  }

  if (!permission || !isFocused) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  if (!tfReady || !model) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>Loading TensorFlow...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
});
