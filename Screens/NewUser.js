import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import firebase from "../Config";

const auth = firebase.auth();

export default function NewUser(props) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  return (
    <ImageBackground
      source={require("../assets/loginback.jpg")}
      style={styles.container}
    >
      <StatusBar style="auto" />
      <View style={styles.card}>
        <Text style={styles.title}>Create New User</Text>

        {/* Email Input */}
        <TextInput
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor="black"
          style={styles.textInput}
          onChangeText={(text) => setEmail(text)}
        />

        {/* Password Input */}
        <TextInput
          placeholder="Password"
          placeholderTextColor="black"
          secureTextEntry={true}
          style={styles.textInput}
          onChangeText={(text) => setPwd(text)}
        />

        {/* Confirm Password Input */}
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="black"
          secureTextEntry={true}
          style={styles.textInput}
          onChangeText={(text) => setConfirmPwd(text)}
        />

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              if (!email || !pwd || !confirmPwd) {
                alert("Please fill in all fields.");
                return;
              }

              if (pwd === confirmPwd) {
                auth
                  .createUserWithEmailAndPassword(email, pwd)
                  .then(() => {
                    props.navigation.navigate("Home");
                  })
                  .catch((error) => {
                    alert(error.message);
                  });
              } else {
                alert("Passwords do not match.");
              }
            }}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#0007",
    height: 400,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    gap: 10,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "white",
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
  backButton: {
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
});
