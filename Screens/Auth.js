import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import firebase from "../Config";
import { useNavigation } from "@react-navigation/native";

const auth = firebase.auth();

export default function Auth(props) {
  let email, password;
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../assets/loginback.jpg")}
      style={styles.container}
    >
      <StatusBar style="auto" />
      <View style={styles.card}>
        <Text style={styles.welcomeText}>Bienvenue</Text>

        {/* Email Input */}
        <TextInput
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor="black"
          onChangeText={(text) => {
            email = text;
          }}
          style={styles.textInput}
        />

        {/* Password Input */}
        <TextInput
          placeholder="Password"
          placeholderTextColor="black"
          secureTextEntry={true}
          style={styles.textInput}
          onChangeText={(text) => {
            password = text;
          }}
        />

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              auth
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Home" }],
                  });
                })
                .catch((error) => {
                  alert(error.message);
                });
            }}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.exitButton}>
            <Text style={styles.buttonText}>Exit</Text>
          </TouchableOpacity>
        </View>

        {/* Create New User */}
        <Text
          style={styles.newUserText}
          onPress={() => {
            props.navigation.navigate("NewUser");
          }}
        >
          Create new user
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#0007",
    height: 350,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    gap: 10,
    padding: 20,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#fff",
    marginBottom: 20,
  },
  textInput: {
    height: 50,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    color: "black",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "45%",
    alignItems: "center",
  },
  exitButton: {
    backgroundColor: "#F44336",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  newUserText: {
    width: "100%",
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontStyle: "italic",
    marginTop: 15,
    textDecorationLine: "underline",
  },
});
