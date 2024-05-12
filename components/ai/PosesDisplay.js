import { CameraType } from "expo-camera";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { Circle, Svg, Line } from "react-native-svg";

export default function PosesSvg(
    { poses,
        cameraWidth = Dimensions.get('window').width,
        cameraHeight = Dimensions.get('window').height,
        outputTensorWidth, outputTensorHeight,
        cameraType,
        minKeyPointScore = 0.2
    }
) {
    function getKeyPointCircles() {
        const keypoints = poses[0].keypoints;
        const filteredKeypoints = keypoints.filter((k) => (k.score ?? 0) > minKeyPointScore);
        const keypointCircles = filteredKeypoints.map((k) => {
            const flipX = cameraType === CameraType.back;
            const x = flipX ? k.x : outputTensorWidth - k.x;
            const y = k.y;
            const cx = x / outputTensorWidth * cameraWidth;
            const cy = y / outputTensorHeight * cameraHeight;
            return (
                <Circle
                    cx={cx}
                    cy={cy}
                    r="5"
                    fill="red"
                    key={k.name}
                    strokeWidth='2'
                    stroke='white'
                />
            );
        });

        return keypointCircles;
    }


    if (poses == null || poses.length === 0) {
        return <View>
            <Text>No poses detected</Text>
        </View>
    } else return <Svg style={styles.svg}>
        {getKeyPointCircles()}
    </Svg>
};

const styles = StyleSheet.create({
    svg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 30,
    }
});