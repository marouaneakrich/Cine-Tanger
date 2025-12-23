import  { useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { getReservations } from "../services/reservation.service";
import QRCode from "react-native-qrcode-svg";

export default function ReservationsScreen() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    getReservations().then(setReservations);
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 8 }}>
      <Text>{item.customerName}</Text>
      <Text>{item.customerEmail}</Text>
      <Text>Seat: {item.seatNumber}</Text>
      <QRCode value={item.qrCode} size={100} />
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
