import { View, Pressable, Text, StyleSheet, Platform, Image} from "react-native";

export default function BodyGroupItem({ name, imageName, onPress }) {
    function pressedStyle({ pressed }) {
        return pressed ? styles.buttonPressed : null;
    }

    const image = require('../assets/images/back.webp');

    return (
        <View style={styles.bodyGroupItem}>
            <Pressable style={pressedStyle} onPress={onPress}>
                <View style={styles.innerContainer}>
                    <View>
                        <Image
                            source={image}
                            style={styles.image} />
                        <Text style={styles.title}>{name}</Text>
                    </View>
                </View>
            </Pressable>
        </View>
    )
};

const styles = StyleSheet.create({
    bodyGroupItem: {
        margin: 16,
        borderRadius: 8,
        backgroundColor: 'white',
        elevation: 4,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        overflow: Platform.OS === 'android' && Platform.Version >= 21 ? 'hidden' : 'visible',
    },
    innerContainer: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 200,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        margin: 8
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 8,
        alignItems: 'center',
    },
    detailItem: {
        marginHorizontal: 4,
    },
    buttonPressed: {
        opacity: 0.5,
    },
})