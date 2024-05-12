import { View, Text, StyleSheet } from "react-native";

//Component for footer values

export default function ValueCard({ title, value }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text>{value}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',   
        alignItems: 'center',
    },
    title: {
        color: 'gray',
        fontSize: 20,
    },
});