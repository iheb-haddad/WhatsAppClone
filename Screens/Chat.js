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
  Animated,
  TouchableWithoutFeedback
} from "react-native";
import firebase from "../Config"; // Update this to your Firebase config file
import { SafeAreaView } from "react-native-safe-area-context";
const reflesdiscussions = firebase.database().ref("lesdiscussions");

const ReactionPicker = ({ messageId, onClose , addReaction}) => {
  const reactions = ["❤️", "😂", "👍", "😮", "😢", "🔥"];

  return (
    <View style={styles.reactionPicker}>
      {reactions.map((reaction) => (
        <TouchableOpacity
          key={reaction}
          onPress={() => {
            console.log("Add reaction", messageId, reaction);
            addReaction(messageId, reaction); // Add the reaction
            onClose(); // Close the picker
          }}
        >
          <Text style={styles.reaction}>{reaction}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};


export default function Chat(props) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const profile = props.route.params.profile; // Name of the person you're chatting with
  const userId = firebase.auth().currentUser.uid; // Your unique Firebase ID
  const iddisc = userId > profile.id ? userId + profile.id : profile.id + userId;
  const ref_unediscussion = reflesdiscussions.child(iddisc);
  const [isTyping, setIsTyping] = useState(false); // Local typing state
  const [otherTyping, setOtherTyping] = useState(false); // State to track the other user's
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  const database = firebase.database();

  // Fetch messages in real-time from Firebase
  useEffect(() => {
    ref_unediscussion.on("value", (snapshot) => {
      const fetchedMessages = [];
      snapshot.forEach((child) => {
        if (child.key !== "typing") {
          fetchedMessages.push({ id: child.key, ...child.val() });
        }
      });
      setMessages(fetchedMessages.reverse());
    });
  
    return () => ref_unediscussion.off();
  }, []);

  // Watch the other user's typing status
useEffect(() => {
  const typingRef = ref_unediscussion.child("typing").child(profile.id);
  typingRef.on("value", (snapshot) => {
    setOtherTyping(snapshot.val()); // Update otherTyping state
  });

  return () => typingRef.off();
}, []);

// Update typing status in Firebase
const handleInputChange = (text) => {
  setInputText(text);

  // Set "typing" to true if inputText is not empty
  const typingRef = ref_unediscussion.child("typing").child(userId);
  if (text.length > 0 && !isTyping) {
    setIsTyping(true);
    typingRef.set(true);
  } else if (text.length === 0 && isTyping) {
    setIsTyping(false);
    typingRef.set(false);
  }
};

  // Send a new message to Firebase
  const sendMessage = () => {
    if (inputText.trim() === "") return;
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: userId, // You can change this logic based on authentication
      date: new Date().toISOString(),
      receiver: profile.id,
      reactions : []
    };

    const key = ref_unediscussion.push().key;
    const ref_unediscussion_key = ref_unediscussion.child(key);
    ref_unediscussion_key.set(newMessage);
    setInputText("");
    const typingRef = ref_unediscussion.child("typing").child(userId);
    typingRef.set(false);
    setIsTyping(false);
  };

  // Render a single message
  const renderMessage = ({ item }) => {
    const isMe = item.sender === userId;
    return (
      <TouchableOpacity
      onLongPress={() => setSelectedMessageId(item.id)} // Show ReactionPicker
      style={[
        styles.messageContainer,
        isMe ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>

      {/* Render reactions */}
      {item.reactions && (
        <View style={styles.reactionsContainer}>
          {Object.values(item.reactions).map((reaction, index) => (
            <Text key={index} style={styles.reaction}>
              {reaction}
            </Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
    );
  };

  // Add animation state
const typingOpacity = useRef(new Animated.Value(0)).current;

// Watch for typing changes and animate
useEffect(() => {
  if (otherTyping) {
    Animated.timing(typingOpacity, {
      toValue: 1, // Fully visible
      duration: 300,
      useNativeDriver: true,
    }).start();
  } else {
    Animated.timing(typingOpacity, {
      toValue: 0, // Fully hidden
      duration: 300,
      useNativeDriver: true,
    }).start();
  }
}, [otherTyping]);

const addReaction = (messageId, reaction) => {
  const userId = firebase.auth().currentUser.uid; // Current user ID
  const messageRef = ref_unediscussion.child(messageId);

  // Update the 'reactions' field in Firebase
  messageRef.child("reactions").update({
    [userId]: reaction, // Add or update the reaction for this user
  });
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
      {selectedMessageId && (
        <TouchableWithoutFeedback onPress={() => setSelectedMessageId(null)} accessible={false}>
          <View>
          <TouchableWithoutFeedback>
        <ReactionPicker
          messageId={selectedMessageId}
          onClose={() => setSelectedMessageId(null)}
          addReaction={addReaction}
        />
      </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

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

      {/* Typing Indicator */}
      {otherTyping && (
      <Animated.View style={[styles.typingIndicator, { opacity: typingOpacity }]}>
        <Text style={styles.typingText}>Typing...</Text>
      </Animated.View>
      )}

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
  typingIndicator: {
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 15,
  },
  typingText: {
    color: "#666",
    fontStyle: "italic",
  },  
  reactionsContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  reaction: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    pointerEvents: "box-none", // Pass touch events to child components
  },  
  reactionPicker: {
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  reaction: {
    fontSize: 24,
    marginHorizontal: 10,
  },
});
