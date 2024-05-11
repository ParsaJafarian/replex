import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import colors from "../util/colors";

export default function ShareButton({ data }) {
    return <TouchableOpacity>
        <Ionicons name="share-outline" size={30} color={colors.secondary} />
    </TouchableOpacity>
};
