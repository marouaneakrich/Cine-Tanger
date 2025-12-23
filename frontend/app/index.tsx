import React, { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, Text, Image, ActivityIndicator } from "react-native";
import { getMovies } from "../services/movie.service";

export default function MoviesListScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovies()
      .then(setMovies)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{ flexDirection: "row", marginBottom: 10, alignItems: "center" }}
      onPress={() => navigation.navigate("MovieDetailsScreen", { movieId: item.id })}
    >
      <Image source={{ uri: item.posterUrl }} style={{ width: 80, height: 120, borderRadius: 8 }} />
      <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
