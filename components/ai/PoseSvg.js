import { CameraType } from "expo-camera";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { Circle, Svg, Line } from "react-native-svg";

const adjacentKeyPoints = [
  ["left_shoulder", "right_shoulder"],
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip", "right_hip"],
  ["left_shoulder", "left_elbow"],
  ["right_shoulder", "right_elbow"],
  ["left_elbow", "left_wrist"],
  ["right_elbow", "right_wrist"],
  ["left_hip", "left_knee"],
  ["right_hip", "right_knee"],
  ["left_knee", "left_ankle"],
  ["right_knee", "right_ankle"],
];

export default function PoseSvg({
  poses,
  cameraWidth = Dimensions.get("window").width,
  cameraHeight = Dimensions.get("window").height * 0.65,
  outputTensorWidth = Dimensions.get("window").width,
  outputTensorHeight = Dimensions.get("window").height * 0.65,
  cameraType,
  minKeyPointScore = 0.2,
}) {
  const crossesMinKeyPointScore = (k) => (k.score ?? 0) > minKeyPointScore;

  function getCoordinates(keypoint) {
    const flipX = cameraType === CameraType.back;
    const x = flipX ? keypoint.x : outputTensorWidth - keypoint.x;
    const y = keypoint.y;
    const cx = (x / outputTensorWidth) * cameraWidth;
    const cy = (y / outputTensorHeight) * cameraHeight;
    return { x: cx, y: cy };
  }

  function getKeyPointCircles() {
    const keypoints = poses[0].keypoints;
    const filteredKeypoints = keypoints.filter(crossesMinKeyPointScore);
    const keypointCircles = filteredKeypoints.map((k) => {
      const { x, y } = getCoordinates(k);
      return (
        <Circle
          cx={x}
          cy={y}
          r="5"
          fill="red"
          key={k.name}
          strokeWidth="2"
          stroke="white"
        />
      );
    });

    return keypointCircles;
  }

  function getLines() {
    const lines = adjacentKeyPoints.map((keypoints) => {
      const k1 = poses[0].keypoints.find((k) => k.name === keypoints[0]);
      const k2 = poses[0].keypoints.find((k) => k.name === keypoints[1]);
      if (crossesMinKeyPointScore(k1) && crossesMinKeyPointScore(k2)) {
        const { x: x1, y: y1 } = getCoordinates(k1);
        const { x: x2, y: y2 } = getCoordinates(k2);
        return (
          <Line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#00ff00"
            strokeWidth="2"
            key={keypoints[0] + keypoints[1]}
          />
        );
      }
    });

    return lines;
  }

  if (poses == null || poses.length === 0) {
    return (
      <View style={styles.noPose}>
        <Text>No Pose detected</Text>
      </View>
    );
  }

  return (
    <Svg style={styles.svg}>
      {getKeyPointCircles()}
      {getLines()}
    </Svg>
  );
}

const styles = StyleSheet.create({
  svg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 30,
  },
  noPose: {
    position: "absolute",
    zIndex: 30,
    bottom: 0,
    backgroundColor: "white",
    width: "100%",
    justifyContent: "center",
    textAlign: "center",
    paddingLeft: "35%",
  },
});
