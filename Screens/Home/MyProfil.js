import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  View,
} from "react-native";
import firebase from "../../Config";
import { supabase } from "../../Config/initSupabase"; // Import Supabase client
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import { useNavigation } from "@react-navigation/native";

const database = firebase.database();
const ref_tableProfils = database.ref("Tabledeprofils");

export default function MyProfil(props) {
  const [nom, setNom] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [telephone, setTelephone] = useState("");
  const [isDefaultImage, setIsDefaultImage] = useState(true);
  const [uriImage, setUriImage] = useState("");
  const userId = firebase.auth().currentUser.uid; // Get the authenticated user's ID
  const navigation = useNavigation();

  // Fetch user data on mount
  useEffect(() => {
    const userProfileRef = ref_tableProfils.child(`unprofil${userId}`);
    userProfileRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setNom(data.nom || "");
        setPseudo(data.pseudo || "");
        setTelephone(data.telephone || "");
        if (data.profileImage) {
          setUriImage(data.profileImage);
          setIsDefaultImage(false);
        }
      }
    });

    return () => userProfileRef.off(); // Cleanup listener on unmount
  }, []);

  // Image Picker Handler
  const handleImagePick = async () => {
    try {
      // Request media library permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "You need to allow access to your media library to select an image.");
        return;
      }

      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        const uri = result.assets[0].base64;
        if(!uri) throw new Error("Failed to get image base64 data.");
        setUriImage(result.assets[0].uri);
        setIsDefaultImage(false);
        //Upload to Supabase
        await uploadImageToSupabase(uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image.");
    }
  };
  // Upload Image to Supabase Storage
  const uploadImageToSupabase = async (uri) => {
    try {
      const fileName = `${userId}-${Date.now()}.jpg`; // Generate unique file name
      // const response = await fetch(uri);
      // const blob = await response.blob();
      
      const { data, error } = await supabase.storage
        .from("profile-images") // Bucket name in Supabase
        .upload(fileName, decode(uri), { contentType: "image/jpeg" });
      
      if (error) {
        console.log(error);
        throw error;
      }

      const imageUrl = process.env.EXPO_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/" + data.fullPath;

      //Save URL to Firebase
      await ref_tableProfils.child(`unprofil${userId}`).update({
        profileImage: imageUrl,
      });
      // Alert.alert("Success", "Profile picture updated!");
    } catch (error) {
      Alert.alert("Error", "Failed to upload image.");
    }
  };

  const saveProfile = () => {
    if (!nom || !pseudo || !telephone) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    const userProfileRef = ref_tableProfils.child(`unprofil${userId}`);
    userProfileRef
      .update({
        id : userId,
        nom : nom,
        pseudo : pseudo,
        telephone : telephone,
      })
      .then(() => Alert.alert("Success", "Profile updated successfully!"))
      .catch((error) => Alert.alert("Error", error.message));
  };

  return (
    <ImageBackground
      source={require("../../assets/imgbleu.jpg")}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text style={styles.textstyle}>My Account</Text>

      <View style={styles.imageContainer}>
        <TouchableHighlight>
          <Image
            source={
              isDefaultImage
                ? require("../../assets/profil.png")
                : { uri: uriImage }
            }
            style={styles.profileImage}
          />
        </TouchableHighlight>

        <TouchableOpacity style={styles.cameraIcon} onPress={handleImagePick}>
          <Image
            source={require("../../assets/camera-icon.png")} // Replace with your camera icon
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      </View>

      <TextInput
        value={nom}
        onChangeText={(text) => setNom(text)}
        textAlign="center"
        placeholderTextColor="#fff"
        placeholder="Nom"
        keyboardType="default"
        style={styles.textinputstyle}
      />
      <TextInput
        value={pseudo}
        onChangeText={(text) => setPseudo(text)}
        textAlign="center"
        placeholderTextColor="#fff"
        placeholder="Pseudo"
        keyboardType="default"
        style={styles.textinputstyle}
      />
      <TextInput
        value={telephone}
        onChangeText={(text) => setTelephone(text)}
        placeholderTextColor="#fff"
        textAlign="center"
        placeholder="Numero"
        keyboardType="phone-pad"
        style={styles.textinputstyle}
      />

      <TouchableHighlight
        onPress={saveProfile}
        activeOpacity={0.5}
        underlayColor="#DDDDDD"
        style={styles.saveButton}
      >
        <Text style={{ color: "#FFF", fontSize: 24 }}>Save</Text>
      </TouchableHighlight>
      <TouchableHighlight
        onPress={() => {
          firebase.auth().signOut()
          navigation.replace("Auth")
        }}
        activeOpacity={0.5}
        underlayColor="#DDDDDD"
        style={styles.deconnectionButton}
      >
        <Text style={{ color: "#FFF", fontSize: 24 }}>Deconnection</Text>
      </TouchableHighlight>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    height: 200,
    width: 200,
    borderRadius: 100,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 5,
  },
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
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    marginBottom: 10,
    borderColor: "#00f",
    borderWidth: 2,
    backgroundColor: "#08f6",
    height: 60,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  deconnectionButton: {
    marginBottom: 10,
    borderColor: "#f00",
    borderWidth: 2,
    backgroundColor: "#f86",
    height: 60,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
    },
});
