import React from "react";
import Auth from "./Screens/Auth";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NewUser from "./Screens/NewUser";
import Home from "./Screens/Home";
import Chat from "./Screens/Chat";
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth" screenOptions={{headerShown : false}}>
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="NewUser" component={NewUser} />
        <Stack.Screen name="Home" component={Home} screenOptions={{headerShown : true}}/>
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}