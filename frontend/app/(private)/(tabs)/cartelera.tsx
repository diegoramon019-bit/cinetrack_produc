import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";

interface CarteleraItem {
  idCartelera: number;
  titulo: string;
  portada_url: string;
  cine: string;
  horarios: string;
  estado: string;
}

export default function Cartelera() {
  const [cartelera, setCartelera] = useState<CarteleraItem[]>([]);
  const [loading, setLoading] = useState(true);

  //  Backend en Render
  const API = "https://cinetrack-produc.onrender.com/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API}/cartelera`);
        setCartelera(res.data);
      } catch (error) {
        console.error("Error al cargar cartelera:", error);
        Alert.alert("Error", "No se pudo cargar la cartelera.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3FB7FF" />
        <Text style={{ color: "#ccc" }}>Cargando cartelera...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Cartelera Semanal</Text>

      {["En Cartelera", "Preventa", "Próximamente"].map((categoria) => (
        <View key={categoria}>
          <Text style={styles.sectionTitle}>{categoria}</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalList}
          >
            {cartelera
              .filter((c) => c.estado === categoria)
              .map((item) => (
                <TouchableOpacity key={item.idCartelera} style={styles.card}>
                  <Image source={{ uri: item.portada_url }} style={styles.image} />
                  <Text style={styles.title}>{item.titulo}</Text>
                  <Text style={styles.details}>{item.cine}</Text>
                  <Text style={styles.horarios}>{item.horarios}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    paddingTop: 50,
  },
  header: {
    color: "#3FB7FF",
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#E6DED2",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    marginVertical: 10,
  },
  horizontalList: {
    paddingHorizontal: 10,
  },
  card: {
    width: 150,
    marginHorizontal: 8,
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    shadowColor: "#3FB7FF",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 10,
  },
  title: {
    color: "#FFF",
    textAlign: "center",
    marginTop: 6,
    fontWeight: "600",
  },
  details: {
    color: "#999",
    textAlign: "center",
    fontSize: 12,
  },
  horarios: {
    color: "#3FB7FF",
    textAlign: "center",
    fontSize: 12,
    marginBottom: 6,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D0D0D",
  },
});