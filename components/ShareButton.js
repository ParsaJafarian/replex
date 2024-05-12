import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import colors from "../util/colors";

export default function ShareButton({ data }) {
    return <TouchableOpacity>
        <Ionicons name="share-outline" size={34} color={colors.secondary} style={styles.button}/>
    </TouchableOpacity>
};

const styles = StyleSheet.create({
    button: {
        marginRight: 10,
    }
})
