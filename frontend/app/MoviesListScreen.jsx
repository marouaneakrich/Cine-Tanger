import React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useMovies } from "../hooks/useQueries";
import { useAppStore } from "../store/appStore";

const { width } = Dimensions.get("window");

const movieRatings = {
  1: 10,
  2: 7,
  3: 6,
  4: 9,
  5: 7,
  6: 6,
  7: 7,
  8: 8,
  9: 6,
  10: 7,
  11: 9,
  12: 10,
  13: 7,
  14: 10,
  15: 7,
  16: 9,
  17: 10,
  18: 9,
  19: 7,
  20: 9,
  21: 9,
  22: 9,
  23: 7,
  24: 9,
};

export default function MoviesListScreen() {
  const router = useRouter();
  const { data: movies, isLoading, error, refetch } = useMovies();
  const { setSelectedMovie } = useAppStore();

  const handleMoviePress = (movie) => {
    setSelectedMovie(movie);
    router.push(`/MovieDetailsScreen?movieId=${movie.id}`);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e50914" />
        <Text style={styles.loadingText}>Loading Movies...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load movies. Please try again.</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderMovieCard = ({ item }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => handleMoviePress(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.posterUrl }}
        style={styles.moviePoster}
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.movieGenre} numberOfLines={1}>Action & Adventure</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {movieRatings[item.id] || item.rating || 'N/A'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cine Tanger</Text>
        <Text style={styles.headerSubtitle}>Book Your Movie Experience</Text>
      </View>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovieCard}
        numColumns={2}
        contentContainerStyle={styles.moviesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No movies available</Text>
          </View>
        }
      />
    </View>
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
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: "#1a1a1a",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e50914",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#b3b3b3",
  },
  moviesList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  movieCard: {
    width: (width - 30) / 2,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    margin: 5,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  moviePoster: {
    width: "100%",
    height: 200,
    backgroundColor: "#333",
  },
  movieInfo: {
    padding: 12,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  movieGenre: {
    fontSize: 12,
    color: "#b3b3b3",
    marginBottom: 8,
  },
  ratingContainer: {
    alignSelf: "flex-start",
  },
  rating: {
    fontSize: 12,
    color: "#ffd700",
    fontWeight: "600",
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
  emptyText: {
    color: "#b3b3b3",
    fontSize: 16,
  },
});
