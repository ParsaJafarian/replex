import { View, Text, StyleSheet } from "react-native";
import colors from "../util/colors";
import AddExerciseButton from "./AddExerciseButton";

export default function CameraHeader({ exerciseName }) {
    return <View style={styles.container}>
        <Text style={styles.title}>
            {exerciseName}
        </Text>
        <AddExerciseButton />
    </View>
};

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        backgroundColor: 'white',
        borderColor: colors.primary,
        padding: 10,
        flexDirection: 'row',
    },
    title: {
        color: colors.primary,
        fontSize: 24,
    },
});
