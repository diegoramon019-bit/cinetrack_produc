import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
//vistas que ve el usuario sin estar logueado.
export default function PublicLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#0D0D0D", borderTopColor: "#1A1A1A" },
        tabBarActiveTintColor: "#3FB7FF",
        tabBarInactiveTintColor: "#999",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="login" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          title: "Registrarse",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-plus-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}