import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    navigation.navigate("MainApp");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />
      
      {/* Background Gradient Effect */}
      <View style={styles.background}>
        <View style={styles.gradientTop} />
        <View style={styles.gradientBottom} />
      </View>

      {/* Main Content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Logo and Title */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="film" size={80} color="#e50914" />
          </View>
          <Text style={styles.title}>Cine Tanger</Text>
          <Text style={styles.subtitle}>احجز تجربة السينما المثالية</Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="ticket" size={30} color="#e50914" />
            <Text style={styles.featureText}>حجز سهل وسريع</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="calendar" size={30} color="#e50914" />
            <Text style={styles.featureText}>أحدث الأفلام والمواعيد</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="qr-code" size={30} color="#e50914" />
            <Text style={styles.featureText}>تذاكر رقمية</Text>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity 
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedText}>ابدأ الآن</Text>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>استمتع بتجربة سينما استثنائية</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: "#1a1a1a",
    opacity: 0.8,
  },
  gradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: "#0f0f0f",
    opacity: 0.8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 60,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#e50914",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#e50914",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#b3b3b3",
    textAlign: "center",
    marginBottom: 20,
  },
  features: {
    width: "100%",
    marginBottom: 50,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  featureText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 15,
    fontWeight: "600",
  },
  getStartedButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e50914",
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    marginBottom: 30,
    elevation: 5,
    shadowColor: "#e50914",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 10,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
