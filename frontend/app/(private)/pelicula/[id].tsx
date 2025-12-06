import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

export default function PeliculaDetalle() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const [pelicula, setPelicula] = useState<any>(null);
  const [reseñas, setReseñas] = useState<any[]>([]);
  const [nuevaResena, setNuevaResena] = useState("");
  const [calificacion, setCalificacion] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [plataformas, setPlataformas] = useState<string | null>(null);

  // URL del backend en Render
  const API = "https://cinetrack-produc.onrender.com/api";

  // ✔️ Cargar película y reseñas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const peliRes = await axios.get(`${API}/peliculas/${id}`);
        setPelicula(peliRes.data);

        const reseRes = await axios.get(`${API}/resenas/${id}`);
        setReseñas(reseRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        Alert.alert("Error", "No se pudieron cargar los datos de la película.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ✔️ Consultar plataformas
  const fetchPlataformas = async () => {
    try {
      const res = await axios.get(`${API}/peliculas/plataformas/${id}`);
      setPlataformas(res.data.plataformas || "No hay información disponible.");
    } catch {
      setPlataformas("No hay información disponible.");
    }
  };

  // ✔️ Enviar nueva reseña
  const handleEnviarResena = async () => {
    if (!nuevaResena.trim() || calificacion === 0) {
      Alert.alert("Error", "Debes escribir una reseña y seleccionar una calificación.");
      return;
    }

    try {
      await axios.post(`${API}/resenas`, {
        idUsuario: user?.idUsuario,
        idPelicula: id,
        contenido: nuevaResena,
        calificacion,
      });

      Alert.alert("🎬 Éxito", "Reseña enviada correctamente");
      setNuevaResena("");
      setCalificacion(0);

      const reseRes = await axios.get(`${API}/resenas/${id}`);
      setReseñas(reseRes.data);
    } catch (error) {
      console.error("Error al enviar reseña:", error);
      Alert.alert("Error", "No se pudo enviar la reseña.");
    }
  };

  // ⏳ Loading
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3FB7FF" />
      </View>
    );
  }

  // ❌ Película no encontrada
  if (!pelicula) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "#fff" }}>No se encontró la película</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: pelicula.portada_url }} style={styles.image} />

      <View style={styles.details}>
        <Text style={styles.title}>{pelicula.titulo}</Text>
        <Text style={styles.genre}>{pelicula.genero}</Text>
        <Text style={styles.meta}>🎬 {pelicula.director}</Text>
        <Text style={styles.meta}>📅 {pelicula.anio} · ⏱️ {pelicula.duracion}</Text>

        <Text style={styles.section}>Sinopsis</Text>
        <Text style={styles.text}>{pelicula.descripcion}</Text>

        {/* 📺 Botón Dónde ver */}
        <TouchableOpacity
          style={styles.whereButton}
          onPress={() => {
            fetchPlataformas();
            setModalVisible(true);
          }}
        >
          <Text style={styles.whereButtonText}>📺 Dónde ver</Text>
        </TouchableOpacity>

        {/* Modal */}
        <Modal transparent visible={modalVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Dónde ver {pelicula.titulo}</Text>
              <Text style={styles.modalText}>{plataformas}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ⭐ Calificación */}
        <Text style={styles.section}>Tu reseña</Text>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Text
              key={n}
              style={[styles.star, { color: n <= calificacion ? "#FFD700" : "#555" }]}
              onPress={() => setCalificacion(n)}
            >
              ★
            </Text>
          ))}
        </View>

        {/* 📝 Input reseña */}
        <TextInput
          style={styles.input}
          placeholder="Escribe tu reseña..."
          placeholderTextColor="#666"
          multiline
          value={nuevaResena}
          onChangeText={setNuevaResena}
        />

        <TouchableOpacity style={styles.button} onPress={handleEnviarResena}>
          <Text style={styles.buttonText}>Enviar reseña</Text>
        </TouchableOpacity>

        {/* 🗨 Reseñas existentes */}
        <Text style={styles.section}>Reseñas de otros usuarios</Text>
        {reseñas.length === 0 ? (
          <Text style={styles.noResenas}>Aún no hay reseñas para esta película.</Text>
        ) : (
          reseñas.map((r) => (
            <View key={r.idResena} style={styles.review}>
              <View style={styles.headerRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {r.usuario?.charAt(0)?.toUpperCase() || "?"}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewer}>{r.usuario}</Text>
                  <Text style={styles.date}>
                    {new Date(r.fecha).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>
                <Text style={styles.stars}>⭐ {r.calificacion}</Text>
              </View>
              <Text style={styles.reviewText}>{r.contenido}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0D0D0D" },
  image: { width: "100%", height: 400, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  details: { padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#E6DED2", textAlign: "center" },
  genre: { color: "#3FB7FF", textAlign: "center", marginBottom: 8 },
  meta: { color: "#ccc", textAlign: "center", fontSize: 14 },
  section: { color: "#3FB7FF", fontWeight: "bold", fontSize: 18, marginTop: 20 },
  text: { color: "#ddd", fontSize: 15, lineHeight: 22, textAlign: "justify" },
  whereButton: {
    backgroundColor: "#3FB7FF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  whereButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    color: "#3FB7FF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: { color: "#fff", fontSize: 15, textAlign: "center", marginBottom: 20 },
  closeButton: {
    backgroundColor: "#3FB7FF",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  closeButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  starRow: { flexDirection: "row", justifyContent: "center", marginVertical: 8 },
  star: { fontSize: 30, marginHorizontal: 4 },
  input: {
    backgroundColor: "#1A1A1A",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    height: 80,
    textAlignVertical: "top",
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#3FB7FF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  noResenas: { color: "#999", fontStyle: "italic", textAlign: "center", marginTop: 10 },
  review: {
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  avatar: {
    backgroundColor: "#3FB7FF",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: { color: "#fff", fontWeight: "bold" },
  reviewer: { color: "#E6DED2", fontWeight: "bold", fontSize: 14 },
  date: { color: "#888", fontSize: 12 },
  stars: { color: "#FFD700", fontWeight: "bold", fontSize: 14 },
  reviewText: { color: "#ccc", fontSize: 14, lineHeight: 20, marginTop: 4 },
});