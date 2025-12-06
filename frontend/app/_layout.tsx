import { Stack } from "expo-router";
import { ActivityIndicator, View, Animated, Easing } from "react-native";
import { useEffect, useRef, useState } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthHandler />
    </AuthProvider>
  );
}

function AuthHandler() {
  const { user } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null); //  ahora acepta objeto

  // Simula la carga inicial (pantalla de splash)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Transición suave entre pantallas (login ↔ dashboard)
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setCurrentUser(user);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  }, [user]);

  //  Pantalla de carga inicial
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0D0D0D",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#3FB7FF" />
      </View>
    );
  }

  // Decide si mostrar la parte pública o privada
  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <Stack screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          <Stack.Screen name="(public)" />
        ) : (
          <Stack.Screen name="(private)" />
        )}
      </Stack>
    </Animated.View>
  );
}