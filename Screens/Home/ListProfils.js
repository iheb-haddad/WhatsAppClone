import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import firebase from "../../Config";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import phone icon
const database = firebase.database();
const ref_tableProfils = database.ref("Tabledeprofils");

export default function ListProfils(props) {
  const [data, setData] = useState([]);
  const userId = firebase.auth().currentUser.uid;

  useEffect(() => {
    ref_tableProfils.on("value", (snapshot) => {
      const d = [];
      snapshot.forEach((unprofil) => {
        d.push(unprofil.val());
      });
      setData(d);
    });

    return () => {
      ref_tableProfils.off();
    };
  }, []);

  // Function to initiate a phone call
  const handleCall = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch((err) =>
      alert("Unable to make a call. Check your phone settings.")
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/imgbleu.jpg")}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text style={styles.textstyle}>List profils</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id} // Use unique IDs as keys
        renderItem={({ item }) => {
          return (
            <TouchableHighlight
              onPress={() => {
                props.navigation.navigate("Chat", { profile: item });
              }}
              underlayColor="#ddd"
              style={styles.contactContainer}
              key={item.id}
            >
              <View style={styles.contactInner}>
                {/* Profile Image */}
                <Image
                  source={
                    item.profileImage
                      ? { uri: item.profileImage }
                      : require("../../assets/profil.png")
                  }
                  style={styles.profileImage}
                />
                {/* Contact Info */}
                <View style={styles.textContainer}>
                  <Text style={styles.contactName}>{item.id === userId ? "MySelf" : item.nom}</Text>
                  <Text style={styles.contactPseudo}>@{item.pseudo}</Text>
                </View>

                {/* Phone Icon */}
                {item.telephone && (
                  <TouchableOpacity
                    onPress={() => handleCall(item.telephone)}
                    style={styles.phoneIcon}
                  >
                    <Icon name="phone" size={25} color="#4CAF50" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableHighlight>
          );
        }}
        style={styles.listContainer}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  textinputstyle: {
    fontWeight: "bold",
    backgroundColor: "#0004",
    fontSize: 20,
    color: "#fff",
    width: "75%",
    height: 50,
    borderRadius: 10,
    margin: 5,
  },
  textstyle: {
    fontSize: 40,
    fontFamily: "serif",
    color: "white",
    fontWeight: "bold",
    paddingTop: 45,
  },
  container: {
    color: "blue",
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  listContainer: {
    width: "100%",
    padding: 10,
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
    elevation: 3, // For a subtle shadow effect (Android)
    shadowColor: "#000", // For iOS shadow
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  contactInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "#ccc", // Placeholder background
  },
  textContainer: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  contactPseudo: {
    fontSize: 14,
    color: "#666",
  },
  phoneIcon: {
    padding: 10,
    backgroundColor: "#E8F5E9",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
