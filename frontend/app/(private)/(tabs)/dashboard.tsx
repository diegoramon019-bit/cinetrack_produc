import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthContext";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const [peliculas, setPeliculas] = useState<
    { idPelicula: number; titulo: string; portada_url: string; anio: number; genero: string; descripcion: string; duracion: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    const fetchPeliculas = async () => {
      try {
        console.log(" Cargando películas...");
        const res = await axios.get("http://192.168.100.169:3000/api/peliculas"); //ip la base local. 
        setPeliculas(res.data);
        console.log("Películas recibidas desde la bd :", res.data.length);
      } catch (error) {
        console.error("Error al cargar las películas:", error);
        Alert.alert("Error", "No se pudieron cargar las películas. Verifica tu conexión o servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchPeliculas();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3FB7FF" />
        <Text style={{ color: "#ccc", marginTop: 10 }}>Cargando películas...</Text>
      </View>
    );
  }

  // Clasificación automática
  const series = peliculas.filter(
    (p) =>
      p.genero?.toLowerCase().includes("temporada") ||
      p.duracion?.toLowerCase().includes("temporada") ||
      p.descripcion?.toLowerCase().includes("serie")
  );

  const recomendadas = peliculas.slice(0, 5);
  const populares = peliculas.filter((p) => !series.includes(p));

  return (
    <ScrollView style={styles.container}>
      {/* Logo gráfico del inicio */}
      <View style={styles.header}>
        <Image
          source={require("../../../assets/images/cinetrack-logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Tu universo cinematográfico digital.</Text>
      </View>

      {/* 🎞 Sección principal: Populares */}
      <Text style={styles.sectionTitle}>Populares</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
        {populares.map((item) => (
          <TouchableOpacity
            key={item.idPelicula}
            style={styles.card}
            onPress={() => router.push(`/pelicula/${item.idPelicula}`)}
          >
            <Image source={{ uri: item.portada_url }} style={styles.image} />
            <Text style={styles.title}>{item.titulo}</Text>
            <Text style={styles.genre}>
              {item.genero} • {item.anio}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/*  Segunda sección: Recomendadas */}
      <Text style={styles.sectionTitle}>Recomendadas</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
        {recomendadas.map((item) => (
          <TouchableOpacity
            key={`rec_${item.idPelicula}`}
            style={styles.cardSmall}
            onPress={() => router.push(`/pelicula/${item.idPelicula}`)}
          >
            <Image source={{ uri: item.portada_url }} style={styles.imageSmall} />
            <Text style={styles.titleSmall}>{item.titulo}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Nueva sección: Series */}
      {series.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Series</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
            {series.map((item) => (
              <TouchableOpacity
                key={`serie_${item.idPelicula}`}
                style={styles.card}
                onPress={() => router.push(`/pelicula/${item.idPelicula}`)}
              >
                <Image source={{ uri: item.portada_url }} style={styles.image} />
                <Text style={styles.title}>{item.titulo}</Text>
                <Text style={styles.genre}>
                  {item.genero} • {item.anio}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D", paddingTop: 50 },
  header: { alignItems: "center", marginBottom: 20 },
  logoImage: {
    width: 190,
    height: 90,
    marginBottom: 5,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
  sectionTitle: {
    color: "#E6DED2",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
    marginVertical: 10,
  },
  horizontalList: { paddingHorizontal: 10 },
  card: {
    width: 160,
    marginHorizontal: 8,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    shadowColor: "#3FB7FF",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  image: { width: "100%", height: 240, borderRadius: 12 },
  title: { color: "#FFF", textAlign: "center", marginTop: 6, fontWeight: "600" },
  genre: { color: "#999", textAlign: "center", fontSize: 13, marginBottom: 8 },
  cardSmall: { width: 130, marginHorizontal: 8 },
  imageSmall: { width: "100%", height: 180, borderRadius: 12 },
  titleSmall: { color: "#FFF", textAlign: "center", fontSize: 12, marginTop: 5 },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D0D0D",
  },
});