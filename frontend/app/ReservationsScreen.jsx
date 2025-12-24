import React, { useEffect, useState } from "react";
import { 
  View, 
  FlatList, 
  Text, 
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReservationsByCustomer, deleteReservation } from "../services/reservation.service";
import QRCode from "react-native-qrcode-svg";

export default function ReservationsScreen() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      // Get customer email from AsyncStorage
      const customerEmail = await AsyncStorage.getItem('customerEmail');
      
      if (!customerEmail) {
        setError('No customer email found. Please book a ticket first.');
        return;
      }

      const data = await getReservationsByCustomer(customerEmail);
      setReservations(data);
      setError(null);
    } catch (err) {
      setError("Failed to load reservations.");
      console.error("Error loading reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReservation = (reservationId) => {
    Alert.alert(
      "Cancel Reservation",
      "Are you sure you want to cancel this reservation?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteReservation(reservationId);
              setReservations(prev => prev.filter(r => r.id !== reservationId));
              Alert.alert("Success", "Reservation cancelled successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to cancel reservation. Please try again.");
              console.error("Error deleting reservation:", error);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e50914" />
        <Text style={styles.loadingText}>Loading Reservations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadReservations}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderReservationCard = ({ item }) => (
    <View style={styles.reservationCard}>
      <View style={styles.cardHeader}>
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle}>{item.Session?.Movie?.title || 'Movie Title'}</Text>
          <Text style={styles.sessionTime}>
            {item.Session ? new Date(item.Session.startTime).toLocaleString() : new Date(item.sessionTime || Date.now()).toLocaleString()}
          </Text>
          {item.Session?.Room && (
            <Text style={styles.roomInfo}>Room: {item.Session.Room.name}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteReservation(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#e50914" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.customerInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#b3b3b3" />
            <Text style={styles.infoText}>{item.customerName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={16} color="#b3b3b3" />
            <Text style={styles.infoText}>{item.customerEmail}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="seat-outline" size={16} color="#b3b3b3" />
            <Text style={styles.infoText}>Seat {item.seatNumber}</Text>
          </View>
        </View>

        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper}>
            <QRCode 
              value={item.qrCode || `reservation-${item.id}`} 
              size={100}
              color="#fff"
              backgroundColor="#2a2a2a"
            />
          </View>
          <Text style={styles.qrLabel}>Show this QR code at the cinema</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.statusBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.statusText}>Confirmed</Text>
        </View>
        <TouchableOpacity style={styles.viewTicketButton}>
          <Text style={styles.viewTicketText}>View Ticket</Text>
          <Ionicons name="chevron-forward" size={16} color="#e50914" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Reservations</Text>
        <Text style={styles.headerSubtitle}>
          {reservations.length} {reservations.length === 1 ? 'ticket' : 'tickets'}
        </Text>
      </View>

      {reservations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="ticket-outline" size={80} color="#666" />
          <Text style={styles.emptyTitle}>No Reservations Yet</Text>
          <Text style={styles.emptySubtitle}>
            Book your first movie ticket to see it here
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => {
              // Navigate to movies tab
            }}
          >
            <Text style={styles.browseButtonText}>Browse Movies</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderReservationCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    color: "#fff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#b3b3b3",
  },
  listContainer: {
    padding: 20,
    gap: 15,
  },
  reservationCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 14,
    color: "#b3b3b3",
  },
  roomInfo: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  customerInfo: {
    flex: 1,
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    color: "#d4d4d4",
    fontSize: 14,
  },
  qrContainer: {
    alignItems: "center",
  },
  qrWrapper: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  qrLabel: {
    color: "#b3b3b3",
    fontSize: 12,
    textAlign: "center",
    maxWidth: 120,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "600",
  },
  viewTicketButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewTicketText: {
    color: "#e50914",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#b3b3b3",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  browseButton: {
    backgroundColor: "#e50914",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  browseButtonText: {
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
});
