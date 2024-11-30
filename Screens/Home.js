import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import ListProfils from"./Home/ListProfils";
import Groupes from "./Home/Groupes";
import MyProfil from "./Home/MyProfil";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import firebase from "../Config";

const Tab = createMaterialBottomTabNavigator();
export default function Home(props) {
  const auth = firebase.auth().currentUser.uid;

  const navigation = useNavigation();

  useEffect(() => {
    if (!auth) {
      navigation.replace("Auth");
    }
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          let iconSize = focused ? 30 : 24; // Icon size
          if (route.name === "ListProfils") {
            iconName = "list"; // Icon name for ListProfils
          } else if (route.name === "Groupes") {
            iconName = "group"; // Icon name for Groupes
          } else if (route.name === "MyProfile") {
            iconName = "person"; // Icon name for MyProfile
          }

          // Return the icon component
          return <Icon key={iconName} name={iconName} size={iconSize} color={color} />;
        },
        tabBarActiveTintColor: "#007aff", // Active tab color
        tabBarInactiveTintColor: "gray",  // Inactive tab color
        tabBarStyle: { backgroundColor: "#f8f8f8" }, // Tab bar background color
      })}
    >
      <Tab.Screen name="ListProfils" component={ListProfils} />
      <Tab.Screen name="Groupes" component={Groupes} />
      <Tab.Screen name="MyProfile" component={MyProfil} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
