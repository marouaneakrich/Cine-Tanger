import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import MoviesListScreen from "./MoviesListScreen";
import ReservationsScreen from "./ReservationsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

export default function MainAppComponent() {
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
