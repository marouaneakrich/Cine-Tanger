import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSessionsByMovie } from "../services/session.service";
import { getReservedSeatsBySession, createReservation } from "../services/reservation.service";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const movieId = params.movieId;
  const sessionId = params.sessionId;
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await getSessionsByMovie(movieId);
        setSessions(data);
        
        if (sessionId != null) {
          const normalizedSessionId = typeof sessionId === "string" ? parseInt(sessionId, 10) : sessionId;
          const session = data.find((s) => s.id === normalizedSessionId);
          if (session) {
            setSelectedSession(session);
          }
        }
      } catch (err) {
        console.error("Error loading sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [movieId, sessionId]);

  useEffect(() => {
    if (selectedSession) {
      getReservedSeatsBySession(selectedSession.id)
        .then(setReservedSeats)
        .catch((err) => console.error("Error loading reserved seats:", err));
    }
  }, [selectedSession]);

  const handleBooking = async () => {
    if (!selectedSeat || !name || !email) {
      Alert.alert("Missing Information", "Please fill in all fields and select a seat.");
      return;
    }

    setBookingLoading(true);
    try {
      await createReservation({
        customerName: name.trim(),
        customerEmail: email.trim(),
        seatNumber: selectedSeat,
        sessionId: selectedSession.id,
      });
      
      await AsyncStorage.setItem('customerEmail', email.trim());
      
      Alert.alert(
        "Booking Successful!", 
        "Your reservation has been confirmed.",
        [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      let errorMessage = "Failed to complete booking. Please try again.";
      
      if (error.response?.status === 400) {
        if (error.response.data?.message?.includes("already reserved")) {
          errorMessage = "This seat is already taken. Please select a different seat.";
          // Refresh reserved seats to get latest data
          if (selectedSession) {
            getReservedSeatsBySession(selectedSession.id)
              .then(setReservedSeats)
              .catch((err) => console.error("Error refreshing reserved seats:", err));
          }
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.response?.status === 404) {
        errorMessage = "Session not found. Please select a different session.";
      }
      
      Alert.alert("Booking Failed", errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e50914" />
        <Text style={styles.loadingText}>Loading Sessions...</Text>
      </View>
    );
  }

  const SeatSelector = ({ reservedSeats, onSelect }) => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const cols = 10;

    return (
      <View style={styles.seatContainer}>
        <View style={styles.screenContainer}>
          <View style={styles.screen} />
          <Text style={styles.screenText}>SCREEN</Text>
        </View>
        
        <View style={styles.seatsGrid}>
          {rows.map((row) => (
            <View key={row} style={styles.seatRow}>
              <Text style={styles.rowLabel}>{row}</Text>
              {Array.from({ length: cols }).map((_, i) => {
                const seat = `${row}${i + 1}`;
                const reserved = reservedSeats.includes(seat);
                const isSelected = selectedSeat === seat;
                
                return (
                  <TouchableOpacity
                    key={seat}
                    style={[
                      styles.seat,
                      reserved && styles.reservedSeat,
                      isSelected && styles.selectedSeat,
                      !reserved && !isSelected && styles.availableSeat
                    ]}
                    disabled={reserved}
                    onPress={() => onSelect(seat)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.seatText,
                      reserved && styles.reservedSeatText,
                      isSelected && styles.selectedSeatText
                    ]}>
                      {i + 1}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <Text style={styles.rowLabel}>{row}</Text>
            </View>
          ))}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.availableSeat]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.selectedSeat]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.reservedSeat]} />
            <Text style={styles.legendText}>Reserved</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Session</Text>
        {sessions.length === 0 ? (
          <Text style={styles.noSessionsText}>No sessions available</Text>
        ) : (
          sessions.map((session) => (
            <TouchableOpacity
              key={session.id}
              style={[
                styles.sessionCard,
                selectedSession?.id === session.id && styles.selectedSessionCard
              ]}
              onPress={() => setSelectedSession(session)}
              activeOpacity={0.8}
            >
              <View style={styles.sessionInfo}>
                <Ionicons 
                  name="time" 
                  size={20} 
                  color={selectedSession?.id === session.id ? "#e50914" : "#b3b3b3"} 
                />
                <View>
                  <Text style={[
                    styles.sessionTime,
                    selectedSession?.id === session.id && styles.selectedSessionTime
                  ]}>
                    {new Date(session.startTime).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                  <Text style={styles.sessionDate}>
                    {new Date(session.startTime).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={[
                styles.sessionIndicator,
                selectedSession?.id === session.id && styles.selectedSessionIndicator
              ]} />
            </TouchableOpacity>
          ))
        )}
      </View>

      {selectedSession && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Your Seat</Text>
            <SeatSelector 
              reservedSeats={reservedSeats} 
              onSelect={setSelectedSeat} 
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#666"
              />
            </View>

            {selectedSeat && (
              <View style={styles.selectedSeatInfo}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.selectedSeatText}>
                  Seat Selected: {selectedSeat}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.bookButton,
                (!selectedSeat || !name || !email || bookingLoading) && styles.disabledButton
              ]}
              onPress={handleBooking}
              disabled={!selectedSeat || !name || !email || bookingLoading}
            >
              {bookingLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="ticket" size={20} color="#fff" />
                  <Text style={styles.bookButtonText}>Complete Booking</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
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
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  noSessionsText: {
    color: "#b3b3b3",
    textAlign: "center",
    fontStyle: "italic",
  },
  sessionCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedSessionCard: {
    backgroundColor: "#1a1a1a",
    borderColor: "#e50914",
  },
  sessionInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sessionTime: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  selectedSessionTime: {
    color: "#e50914",
  },
  sessionDate: {
    fontSize: 14,
    color: "#b3b3b3",
    marginTop: 2,
  },
  sessionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#666",
  },
  selectedSessionIndicator: {
    backgroundColor: "#e50914",
  },
  seatContainer: {
    alignItems: "center",
  },
  screenContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  screen: {
    width: "80%",
    height: 2,
    backgroundColor: "#e50914",
    borderRadius: 1,
  },
  screenText: {
    color: "#b3b3b3",
    fontSize: 12,
    marginTop: 5,
    letterSpacing: 2,
  },
  seatsGrid: {
    alignSelf: "center",
  },
  seatRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  rowLabel: {
    width: 20,
    textAlign: "center",
    color: "#b3b3b3",
    fontSize: 12,
    fontWeight: "bold",
  },
  seat: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  availableSeat: {
    backgroundColor: "#333",
    borderColor: "#555",
  },
  selectedSeat: {
    backgroundColor: "#e50914",
    borderColor: "#e50914",
  },
  reservedSeat: {
    backgroundColor: "#1a1a1a",
    borderColor: "#333",
  },
  seatText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  selectedSeatText: {
    color: "#fff",
  },
  reservedSeatText: {
    color: "#666",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendSeat: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendText: {
    color: "#b3b3b3",
    fontSize: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 15,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  selectedSeatInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  selectedSeatText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
  bookButton: {
    backgroundColor: "#e50914",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#333",
    opacity: 0.6,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
