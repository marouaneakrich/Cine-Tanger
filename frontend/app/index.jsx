import React, { useEffect, useState } from "react";
import { 
  View, 
  FlatList, 
  TouchableOpacity, 
  Text, 
  Image, 
  ActivityIndicator, 
  StyleSheet,
  Dimensions,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getMovies } from "../services/movie.service";
import ReservationsScreen from "./ReservationsScreen";
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get("window");
const Tab = createBottomTabNavigator();

// Temporary rating mapping (will be replaced with backend data)
const movieRatings = {
  1: 10, // The Batman
  2: 7,  // Inception
  3: 6,  // Interstellar
  4: 9,  // The Dark Knight
  5: 7,  // Avengers: Endgame
  6: 6,  // Spider-Man: No Way Home
  7: 7,  // Iron Man
  8: 8,  // Captain America: The First Avenger
  9: 6,  // Thor
  10: 7, // Black Panther
  11: 9, // Doctor Strange
  12: 10, // Guardians of the Galaxy
  13: 7, // The Matrix
  14: 10, // John Wick
  15: 7, // Gladiator
  16: 9, // Titanic
  17: 10, // Jurassic Park
  18: 9, // Avatar
  19: 7, // The Lion King
  20: 9, // Toy Story
  21: 9, // Finding Nemo
  22: 9, // WALL-E
  23: 7, // The Incredibles
  24: 9, // Shrek
};

// Splash Screen Component
function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={splashStyles.container}>
      <LottieView
        source={require('../assets/images/Movie Theatre.json')}
        style={splashStyles.animation}
        autoPlay={true}
        loop={false}
      />
      <View style={splashStyles.titleContainer}>
        <Text style={splashStyles.appTitle}>Cine Tanger</Text>
        <Text style={splashStyles.appSubtitle}>Book Your Movie Experience</Text>
      </View>
    </View>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: width * 0.7,
    height: height * 0.5,
  },
  titleContainer: {
    position: 'absolute',
    bottom: height * 0.15,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#e50914',
    marginBottom: 8,
    textShadowColor: 'rgba(229, 9, 20, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#b3b3b3',
    fontWeight: '300',
    letterSpacing: 1,
    opacity: 0.9,
  },
});

function MoviesListScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMovies()
      .then((data) => {
        setMovies(data);
        setError(null);
      })
      .catch((err) => {
        setError("Failed to load movies. Please try again.");
        console.error("Error loading movies:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
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
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            getMovies()
              .then(setMovies)
              .catch(() => setError("Failed to load movies. Please try again."))
              .finally(() => setLoading(false));
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderMovieCard = ({ item }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => navigation.navigate("MovieDetailsScreen", { movieId: item.id })}
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

function MainAppComponent() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Movies") {
            iconName = focused ? "film" : "film-outline";
          } else if (route.name === "Reservations") {
            iconName = focused ? "ticket" : "ticket-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#e50914",
        tabBarInactiveTintColor: "#b3b3b3",
        tabBarStyle: {
          backgroundColor: "#1a1a1a",
          borderTopColor: "#333",
        },
        headerStyle: {
          backgroundColor: "#1a1a1a",
        },
        headerTintColor: "#fff",
      })}
    >
      <Tab.Screen 
        name="Movies" 
        component={MoviesListScreen}
        options={{ 
          headerShown: false,
          title: "Movies"
        }}
      />
      <Tab.Screen 
        name="Reservations" 
        component={ReservationsScreen}
        options={{ 
          title: "My Reservations"
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return <MainAppComponent />;
}

export { MainAppComponent as MainApp };

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
