import { View, Text, StyleSheet } from "react-native";

export default function CameraHeader({exerciseName}) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{exerciseName}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        backgroundColor: 'white',
        borderColor: 'orange',
        padding: 10,
    },
    title: {
        color: 'orange',
        fontSize: 20,
    },
});