import React, { useLayoutEffect } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../util/colors';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const gradientColors = [colors.primary, colors.third];

export default function WelcomeScreen() {
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
            tabBarStyle: {
                display: 'none'
            },
        });
    }, [navigation]);

    return <LinearGradient colors={gradientColors} style={styles.container}>
        <Image source={require('../assets/welcome2.webp')} style={styles.img} />
        <View style={styles.innerContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>WORKOUT IN CONFIDENCE WITH
                    <Text style={{ color: colors.secondary, fontSize: 32 }}> REPCOUNT PRO</Text>
                </Text>
            </View>
            <View style={styles.description}>
                <Text style={{ color: colors.text, fontSize: 20 }}>
                    Experience the power of computer vision and machine learning to track your workouts with RepCount Pro. Get started by creating your own workout and let RepCount Pro do the rest.
                </Text>
            </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Camera')}>
            <LinearGradient colors={[colors.thirdDark, colors.primary]} style={styles.button}>
                <Text style={{ color: colors.text, fontSize: 20, textAlign: 'center' }}>
                    Get Started
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    </LinearGradient>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
    },
    imgContainer: {
        borderRadius: 10,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 2,
    },
    img: {
        width: '100%',
        height: '53%',
    },
    titleContainer: {
    },
    title: {
        fontSize: 30,
        fontFamily: 'notoserif',
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
    },
    button: {
        padding: 20,
        marginHorizontal: "20%",
        marginBottom: 20,
        borderRadius: 14,
    },
    description: {
        flex: 1,
        marginHorizontal: 40,
        marginVertical: 20,
        alignContent: 'center',
        textAlign: 'center',
    },
});
