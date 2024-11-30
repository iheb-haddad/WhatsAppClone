import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import firebase from "../Config"; // Update this to your Firebase config file
import { SafeAreaView } from "react-native-safe-area-context";
const reflesdiscussions = firebase.database().ref("lesdiscussions");


export default function Chat(props) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const profile = props.route.params.profile; // Name of the person you're chatting with
  const userId = firebase.auth().currentUser.uid; // Your unique Firebase ID
  const iddisc = userId > profile.id ? userId + profile.id : profile.id + userId;
  const ref_unediscussion = reflesdiscussions.child(iddisc);

  const database = firebase.database();

  // Fetch messages in real-time from Firebase
  useEffect(() => {
    ref_unediscussion.on("value", (snapshot) => {
      const fetchedMessages = [];
      snapshot.forEach((child) => {
        if (child.key !== "typing") {
          fetchedMessages.push(child.val());
        }
      });
      setMessages(fetchedMessages.reverse());
    });
  
    return () => ref_unediscussion.off();
  }, []);

// Update typing status in Firebase
const handleInputChange = (text) => {
  setInputText(text);
};

  // Send a new message to Firebase
  const sendMessage = () => {
    if (inputText.trim() === "") return;
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: userId, // You can change this logic based on authentication
      date: new Date().toISOString(),
      receiver: profile.id
    };

    const key = ref_unediscussion.push().key;
    const ref_unediscussion_key = ref_unediscussion.child(key);
    ref_unediscussion_key.set(newMessage);
    setInputText("");
  };

  // Render a single message
  const renderMessage = ({ item }) => {
    const isMe = item.sender === userId;
    return (
      <TouchableOpacity
      style={[
        styles.messageContainer,
        isMe ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Chat Header */}
      <View style={styles.header}>
        <Image
          source={
            profile.profileImage // Check if a profile picture URL exists
              ? { uri: profile.profileImage } // If a profile picture URL exists, use it
              : require("../assets/profil.png") // Default image if no URL
          }
          style={styles.profileImage}
        />
        <Text style={styles.headerText}>
          {profile.pseudo} {profile.nom}
        </Text>
      </View>

      {/* Chat Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flexGrow}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          inverted // Scrolls to the bottom
        />

        {/* Input Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={handleInputChange}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  flexGrow: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#0F52BA",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10, // Add spacing between the photo and text
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circular image
  },
  messagesList: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  messageContainer: {
    maxWidth: "75%",
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0F52BA",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "gray",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#0F52BA",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
