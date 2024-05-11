import { StyleSheet, View, Button } from "react-native";
import ValueCard from "./ValueCard";
import { useState } from "react";

export default function CameraFooter() {
    const [reps, setReps] = useState(0);
    const [sets, setSets] = useState(1);
    const [confidence, setConfidence] = useState(0);

    function resetHandler(){
        setReps(0);
        setSets(1);
        setConfidence(0);
    }

    function addSetHandler(){
        setSets(current => current + 1);
        setReps(0);
        setConfidence(0);
    }

    return (
        <View style={styles.container}>
            <View style={styles.footer}>
                <ValueCard title="Reps" value={reps} />
                <ValueCard title="Sets" value={sets} />
                <ValueCard title="Confidence" value={confidence} />
            </View>
            <View style={styles.buttons}>
                <Button title="Reset" onPress={resetHandler}/>
                <Button title="Add Set" onPress={addSetHandler}/>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {

    },
    footer: {
        flexDirection: 'row',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
});