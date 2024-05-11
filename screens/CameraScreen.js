import { StyleSheet, View } from "react-native";
import CameraCard from "../components/CameraCard";
import SearchBar from "../components/SearchBar";

export default function CameraScreen() {
    return <View style={styles.container}>
        <SearchBar />
        <CameraCard />
    </View>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});