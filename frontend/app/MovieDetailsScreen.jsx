import React, { useEffect, useState } from "react";
import { View, Text, Image, Button, ActivityIndicator, ScrollView } from "react-native";
import { getMovieById } from "../services/movie.service";

export default function MovieDetailsScreen({ route, navigation }) {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    getMovieById(movieId).then(setMovie);
  }, [movieId]);

  if (!movie) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <Image source={{ uri: movie.posterUrl }} style={{ width: "100%", height: 300, borderRadius: 10 }} />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}>{movie.title}</Text>
      <Text style={{ marginTop: 10 }}>{movie.synopsis}</Text>
      <Button
        title="Book Now"
        onPress={() => navigation.navigate("BookingScreen", { movieId: movie.id })}
      />
    </ScrollView>
  );
}
