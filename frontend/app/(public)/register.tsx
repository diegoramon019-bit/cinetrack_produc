import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

// API Render centralizada
const API = "https://cinetrack-produc.onrender.com/api";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!nombre.trim() || !correo.trim() || !pass.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await axios.post(`${API}/usuarios/register`, {
        nombre,
        correo,
        pass,
      });

      if (response.status === 201) {
        Alert.alert("🎬 Registro exitoso", "Tu cuenta fue creada. Ya podés iniciar sesión.");
        router.push("/login");
      } else {
        Alert.alert("Error", response.data?.error || "No se pudo registrar el usuario.");
      }
    } catch (error: any) {
      console.error("Error en el registro:", error);

      if (error.response?.status === 409) {
        Alert.alert("Correo registrado", "Ese correo ya está en uso. Probá con otro.");
      } else {
        Alert.alert("Error", "No se pudo completar el registro. Revisá tu conexión.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎬 Únete al séptimo arte digital</Text>
      <Text style={styles.subtitle}>Crea tu cuenta para comenzar</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        placeholderTextColor="#aaa"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>¿Ya tenés cuenta? Iniciá sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "#3FB7FF",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 25,
    textAlign: "center",
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
    padding: 14,
    borderRadius: 8,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    color: "#3FB7FF",
    marginTop: 20,
  },
});