import { useContext, useLayoutEffect, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WorkoutContext } from "../contexts/workout-context";
import { ExerciseContext } from "../contexts/exercise-context";
import uuid from "react-native-uuid";
import ShareButton from "../components/ShareButton";
import SearchExercise from "../components/SearchExercise";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

export default function WorkoutScreen({ navigation }) {
  const workoutContext = useContext(WorkoutContext);
  const exerciseContext = useContext(ExerciseContext);

  const exerciseId = exerciseContext.id;
  const workout = workoutContext.workout;

  const [creating, setCreating] = useState(false); // Is the user creating a workout
  const [workoutName, setWorkoutName] = useState("");
  const [customWorkout, setCustomWorkout] = useState([]);
  // For one exercise
  const [query, setQuery] = useState(""); // Name of exercise
  const [id, setId] = useState(""); // ID of exercise
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <ShareButton data={workout} />,
    });
  }, [navigation]);

  function removeExerciseHandler(id) {
    workoutContext.removeExercise(id);
    if (exerciseId === id) {
      exerciseContext.setExerciseId(null);
    }
  }

  function addSet() {
    Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Successfully added a set of " + reps + " reps",
      });
    setSets([...sets, Number.parseInt(reps)]);
  }

  function addExercise() {
    const exercise = {
      exercise: query,
      id,
      sets,
    };
    console.log(exercise);
    // Reset fields after adding exercise
    setQuery("");
    setReps("");
    setSets([]);
    setId("");

    // Add to workout
    setCustomWorkout([...customWorkout, exercise]);
  }

  const saveWorkout = async () => {
    try {
      let prevWorkouts = await AsyncStorage.getItem("workouts");
      if (prevWorkouts === null) {
        let workouts = [
          {
            name: workoutName,
            id: uuid.v4(),
            exercises: JSON.stringify(customWorkout),
          },
        ];
        console.log(JSON.stringify(workouts));
        await AsyncStorage.setItem("workouts", JSON.stringify(workouts));
      } else {
        let workouts = JSON.parse(prevWorkouts);
        workouts = [
          ...workouts,
          {
            name: workoutName,
            id: uuid.v4(),
            exercises: JSON.stringify(customWorkout),
          },
        ];
        console.log(JSON.stringify(workouts));
        await AsyncStorage.setItem("workouts", JSON.stringify(workouts));
      }

      // alert("Successfully created workout " + workoutName)
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: 'Successfully created workout ' + workoutName,
        button: 'close',
      })
      workoutContext.load();
    } catch (err) {
      alert(err);
    }
  };

  const clearWorkouts = async () => {
    try {
      await AsyncStorage.removeItem("workouts");
      workoutContext.load();
    } catch (e) {
      alert(e);
    }
  };

  function renderWorkoutItem({ item }) {
    return (
      <TouchableOpacity style={styles.listItem}>
        <Text
          style={{
            color: "#DDE1E9",
            fontSize: 17,
            textAlignVertical: "center",
          }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <>
      <AlertNotificationRoot>
        <View>
          {creating ? (
            <View style={styles.container}>
              <Pressable
                style={{
                  width: "100%",
                  backgroundColor: "#775FF0",
                  paddingVertical: 15,
                  paddingHorizontal: 22,
                  borderRadius: 7,
                }}
                onPress={() => setCreating(creating === false ? true : false)}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  BACK
                </Text>
              </Pressable>
              <SafeAreaView style={{ margin: 0, padding: 0, width: "100%" }}>
                <TextInput
                  style={[styles.input, styles.marginThing]}
                  placeholder="Type workout name here..."
                  placeholderTextColor={"white"}
                  value={workoutName}
                  onChangeText={setWorkoutName}
                />
                <SearchExercise
                  query={query}
                  setQuery={setQuery}
                  setId={setId}
                />
                <View style={[styles.inputContainer]}>
                  <TextInput
                    style={styles.halfInput}
                    placeholder="Repetitions per set"
                    placeholderTextColor={"white"}
                    keyboardType="numeric"
                    value={reps}
                    onChangeText={setReps}
                  />
                  <Pressable
                    style={[
                      styles.button,
                      styles.buttonBetween,
                      { marginVertical: 8, marginLeft: 8 },
                    ]}
                    onPress={addSet}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        styles.buttonTextBetween,
                        { textAlign: "center", width: 30 },
                      ]}
                    >
                      +
                    </Text>
                  </Pressable>
                </View>
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonBetween,
                    styles.marginThing,
                  ]}
                  onPress={addExercise}
                >
                  <Text style={[styles.buttonText, styles.buttonTextBetween]}>
                    Add exercise
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonFilled,
                    styles.marginThing,
                  ]}
                  onPress={saveWorkout}
                >
                  <Text style={[styles.buttonText, styles.buttonTextFilled]}>
                    Create workout
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonOutline,
                    styles.marginThing,
                  ]}
                  onPress={clearWorkouts}
                >
                  <Text style={[styles.buttonText, styles.buttonTextOutline]}>
                    Delete all workouts
                  </Text>
                </Pressable>
              </SafeAreaView>
            </View>
          ) : (
            <View style={styles.container}>
              <Pressable
                style={{
                  width: "100%",
                  backgroundColor: colors.purple,
                  paddingVertical: 15,
                  paddingHorizontal: 22,
                  position: "absolute",
                  bottom: 35,
                  left: "13%",
                  borderRadius: 7,
                  zIndex: 5,
                }}
                onPress={() => setCreating(creating === false ? true : false)}
              >
                <Text style={{ fontWeight: "bold", color: "white" }}>
                  Create workout
                </Text>
              </Pressable>
              <Text style={styles.text}>Workouts</Text>
              <FlatList
                data={workoutContext.workouts}
                keyExtractor={(item) => item.id}
                renderItem={renderWorkoutItem}
              />
            </View>
          )}
        </View>
      </AlertNotificationRoot>
    </>
  );
}

const styles = StyleSheet.create({
  buttonOutline: {
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: colors.purple,
  },
  buttonTextOutline: {
    color: colors.purple,
  },
  buttonFilled: {
    backgroundColor: colors.purple,
  },
  buttonTextFilled: {
    color: "white",
  },
  buttonBetween: {
    backgroundColor: "#b9adf7",
    fontSize: 15,
  },
  buttonTextBetween: {
    color: colors.purple,
  },

  marginThing: {
    marginTop: 20,
  },
  button: {
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  container: {
    paddingHorizontal: 40,
    paddingTop: 30,
    backgroundColor: colors.third,
    height: "100%",
  },
  text: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  listItem: {
    marginTop: 20,
    // height: 40,
    backgroundColor: colors.fourth,
    borderRadius: 6,
    paddingHorizontal: 25,
    paddingVertical: 13,
    elevation: 1, // This is for Android
  },
  excercise: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  removeButton: {
    backgroundColor: "red",
  },
  input: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "white",
  },
  inputContainer: {
    marginTop: 80,
    flexDirection: "row",
    alignItems: "center",
  },
  halfInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "white",
  },
});
