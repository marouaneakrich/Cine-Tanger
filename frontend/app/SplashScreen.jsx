import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from "react-native";
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ onFinish }) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[splashStyles.container, { opacity: fadeAnim }]}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <LottieView
          source={require('../assets/Movie.json')}
          style={splashStyles.animation}
          autoPlay={true}
          loop={true}
        />
      </Animated.View>

      <Animated.View
        style={[
          splashStyles.titleContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={splashStyles.appTitle}>Cine Tanger</Text>
        <Text style={splashStyles.appSubtitle}>Elevate Your Cinema Experience</Text>

        <View style={splashStyles.progressTrack}>
          <Animated.View style={[splashStyles.progressBar, { width: progressWidth }]} />
        </View>
      </Animated.View>
    </Animated.View>
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
    fontSize: 14,
    color: '#b3b3b3',
    fontWeight: '400',
    letterSpacing: 2,
    opacity: 0.8,
    textTransform: 'uppercase',
  },
  progressTrack: {
    width: width * 0.6,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginTop: 30,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#e50914',
    borderRadius: 3,
  },
});
