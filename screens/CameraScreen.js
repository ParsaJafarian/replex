import {  StyleSheet, View } from "react-native";
import CameraCard from "../components/CameraCard";
import SearchBar from "../components/SearchBar";
import ExerciseContextProvider from "../contexts/exercise-context";

export default function CameraScreen() {
    return (
        <View style={styles.container}>
            <ExerciseContextProvider>
                <SearchBar />
                <CameraCard />
            </ExerciseContextProvider>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        flex: 1,
    },
});