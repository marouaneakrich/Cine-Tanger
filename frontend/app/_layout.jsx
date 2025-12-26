import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryProvider } from "../providers/QueryProvider";

export default function Layout() {
  return (
    <QueryProvider>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />
      <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
            title: "Movies"
          }} 
        />
        <Stack.Screen 
          name="HomeScreen" 
          options={{ 
            headerShown: false,
            title: "Welcome"
          }} 
        />
        <Stack.Screen 
          name="MainApp" 
          options={{ 
            headerShown: false,
            title: "Movies"
          }} 
        />
        <Stack.Screen 
          name="MovieDetailsScreen" 
          options={{ 
            title: "Movie Details",
            headerStyle: { backgroundColor: "#1a1a1a" },
            headerTintColor: "#fff"
          }} 
        />
        <Stack.Screen 
          name="BookingScreen" 
          options={{ 
            title: "Book Tickets",
            headerStyle: { backgroundColor: "#1a1a1a" },
            headerTintColor: "#fff"
          }} 
        />
        <Stack.Screen 
          name="ReservationsScreen" 
          options={{ 
            title: "My Reservations",
            headerStyle: { backgroundColor: "#1a1a1a" },
            headerTintColor: "#fff"
          }} 
        />
      </Stack>
    </QueryProvider>
  );
}
