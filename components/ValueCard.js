import { View, Text, StyleSheet } from "react-native";

//Component for footer values

export default function ValueCard({ title, value }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={{ color: "#b8c2d1" }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 20,
  },
});
