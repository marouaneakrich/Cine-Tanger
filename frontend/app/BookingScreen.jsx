import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { getSessionsByMovie } from "../services/movie.service";
import { getReservedSeatsBySession, createReservation } from "../services/reservation.service";
import QRCode from "react-native-qrcode-svg";

export default function BookingScreen({ route, navigation }) {
  const { movieId } = route.params;
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSessionsByMovie(movieId).then((data) => {
      setSessions(data);
      setLoading(false);
    });
  }, [movieId]);

  useEffect(() => {
    if (selectedSession) {
      getReservedSeatsBySession(selectedSession.id).then(setReservedSeats);
    }
  }, [selectedSession]);

  const handleBooking = async () => {
    try {
      await createReservation({
        customerName: name,
        customerEmail: email,
        seatNumber: selectedSeat,
        sessionId: selectedSession.id,
      });
      navigation.navigate("ReservationsScreen");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const SeatSelector = ({ reservedSeats, onSelect }) => {
    const rows = ["A","B","C","D","E"];
    const cols = 10;

    return (
      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Select Seat:</Text>
        {rows.map((row) => (
          <View key={row} style={{ flexDirection: "row", marginVertical: 2 }}>
            {Array.from({ length: cols }).map((_, i) => {
              const seat = `${row}${i+1}`;
              const reserved = reservedSeats.includes(seat);
              return (
                <TouchableOpacity
                  key={seat}
                  style={{
                    width: 30, height: 30, margin: 2, justifyContent: "center", alignItems: "center",
                    borderWidth: 1, borderRadius: 4,
                    backgroundColor: reserved ? "gray" : selectedSeat === seat ? "green" : "white"
                  }}
                  disabled={reserved}
                  onPress={() => onSelect(seat)}
                >
                  <Text style={{ color: reserved ? "white" : "black" }}>{seat}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>Select Session:</Text>
      {sessions.map((s) => (
        <Button
          key={s.id}
          title={new Date(s.startTime).toLocaleString()}
          onPress={() => setSelectedSession(s)}
          color={selectedSession?.id === s.id ? "green" : "blue"}
        />
      ))}

      {selectedSession && (
        <>
          <SeatSelector reservedSeats={reservedSeats} onSelect={setSelectedSeat} />
          <TextInput placeholder="Your Name" value={name} onChangeText={setName} style={{ borderWidth: 1, marginVertical: 5, padding: 5 }} />
          <TextInput placeholder="Your Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginVertical: 5, padding: 5 }} />
          <Button title="Confirm Booking" onPress={handleBooking} disabled={!selectedSeat || !name || !email} />
        </>
      )}
    </ScrollView>
  );
}
