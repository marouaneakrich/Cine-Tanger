import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  Button, 
  ActivityIndicator, 
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getMovieById } from "../services/movie.service";
import { getSessionsByMovie } from "../services/session.service";
import { useLocalSearchParams, useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function MovieDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const movieId = params.movieId;
  const [movie, setMovie] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [movieData, sessionsData] = await Promise.all([
          getMovieById(movieId),
          getSessionsByMovie(movieId)
]);
        setMovie(movieData);
        setSessions(sessionsData);
        setError(null);
      } catch (err) {
        setError("Failed to load movie details.");
        console.error("Error loading movie:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [movieId]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e50914" />
        <Text style={styles.loadingText}>Loading Movie Details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            const loadData = async () => {
              try {
                const [movieData, sessionsData] = await Promise.all([
                  getMovieById(movieId),
                  getSessionsByMovie(movieId)
                ]);
                setMovie(movieData);
                setSessions(sessionsData);
                setError(null);
              } catch (err) {
                setError("Failed to load movie details.");
                console.error("Error loading movie:", err);
              } finally {
                setLoading(false);
              }
            };
            loadData();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Movie not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />
      
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: movie.posterUrl }} 
          style={styles.posterImage}
        />
        <View style={styles.imageOverlay} />
      </View>

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>{movie.title}</Text>
          <View style={styles.metaInfo}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#ffd700" />
              <Text style={styles.rating}>8.5</Text>
            </View>
            <Text style={styles.duration}>{movie.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}min` : '2h 30min'}</Text>
            <Text style={styles.genre}>Action, Adventure</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Synopsis</Text>
          <Text style={styles.synopsis}>{movie.synopsis || "No synopsis available."}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cast & Crew</Text>
          <View style={styles.castList}>
            <View style={styles.castItem}>
              <Text style={styles.castRole}>Director</Text>
              <Text style={styles.castName}>Christopher Nolan</Text>
            </View>
            <View style={styles.castItem}>
              <Text style={styles.castRole}>Writer</Text>
              <Text style={styles.castName}>Jonathan Nolan</Text>
            </View>
            <View style={styles.castItem}>
              <Text style={styles.castRole}>Stars</Text>
              <Text style={styles.castName}>John David Washington, Robert Pattinson</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Showtimes</Text>
          <View style={styles.showtimeList}>
            {sessions.length > 0 ? (
              sessions.map((session) => {
                const sessionTime = new Date(session.startTime);
                const timeString = sessionTime.toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                });
                return (
                  <TouchableOpacity 
                    key={session.id}
                    style={styles.showtimeItem}
                    onPress={() => router.push({ 
                      pathname: "BookingScreen", 
                      params: { 
                        movieId: movie.id.toString(), 
                        sessionId: session.id.toString() 
                      }
                    })}
                  >
                    <Text style={styles.showtimeTime}>{timeString}</Text>
                    <Text style={styles.showtimeType}>
                      {session.Room?.name || 'Standard'}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.noSessionsText}>No sessions available</Text>
            )}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => router.push({ 
            pathname: "BookingScreen", 
            params: { movieId: movie.id.toString() }
          })}
        >
          <Ionicons name="ticket" size={20} color="#fff" />
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141414",
  },
  imageContainer: {
    position: "relative",
    height: 300,
  },
  posterImage: {
    width: width,
    height: 300,
    backgroundColor: "#333",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  content: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 15,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  rating: {
    color: "#ffd700",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
  duration: {
    color: "#b3b3b3",
    fontSize: 14,
  },
  genre: {
    color: "#b3b3b3",
    fontSize: 14,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  synopsis: {
    color: "#d4d4d4",
    fontSize: 15,
    lineHeight: 22,
  },
  castList: {
    gap: 8,
  },
  castItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  castRole: {
    color: "#b3b3b3",
    fontSize: 14,
    fontWeight: "500",
  },
  castName: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
    textAlign: "right",
  },
  showtimeList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  showtimeItem: {
    backgroundColor: "#2a2a2a",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 80,
  },
  showtimeTime: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  showtimeType: {
    color: "#b3b3b3",
    fontSize: 12,
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: "#e50914",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 30,
    gap: 8,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: "#e50914",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: "#e50914",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noSessionsText: {
    color: "#b3b3b3",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 20,
  },
});
