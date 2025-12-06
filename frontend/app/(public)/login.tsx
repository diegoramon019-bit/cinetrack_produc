import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Animated,
  Easing,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  // Animación del logo
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!correo.trim() || !pass.trim()) {
      Alert.alert("Error", "Por favor completá todos los campos.");
      return;
    }

    try {
      const response = await axios.post("http://192.168.100.169:3000/api/usuarios/login", {
        correo,
        pass,
      });

      const usuario = response.data.usuario;

      if (usuario) {
        await login(usuario);
        Alert.alert("🎬 Éxito", `Bienvenido, ${usuario.nombre}!`);
        router.push("/dashboard");
      } else {
        Alert.alert("Error", "Respuesta inesperada del servidor.");
      }
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error.message);
      Alert.alert("Error", "Correo o contraseña incorrectos");
    }
  };

  return (
    <View style={styles.container}>
      {/* 🎬 Logo animado */}
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <Image
          source={require("../../assets/images/cinetrack-logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>

      <Text style={styles.subtitle}>Tu universo cinematográfico, siempre contigo.</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        onChangeText={setCorreo}
        value={correo}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setPass}
        value={pass}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>¿No tenés cuenta? Registrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logoImage: {
    width: 190,
    height: 90,
    marginBottom: 10,
  },
  subtitle: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#1A1A1A",
    width: "100%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    color: "#fff",
  },
  button: {
    backgroundColor: "#3FB7FF",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    color: "#3FB7FF",
    marginTop: 20,
    fontSize: 14,
  },
});