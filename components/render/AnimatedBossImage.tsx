import React, { useRef, useEffect } from 'react';
import { Animated, Easing, ImageStyle, StyleSheet, TouchableOpacity } from 'react-native';

interface AnimatedBossImageProps {
  source: any; // Type of image, adjust as necessary
  onPress: () => void;
  style?: ImageStyle;
}

const AnimatedBossImage: React.FC<AnimatedBossImageProps> = ({ source, onPress, style }) => {
  // Create references for animation values
  const scaleValue = useRef(new Animated.Value(1)).current;
  const moveXValue = useRef(new Animated.Value(0)).current;
  const moveYValue = useRef(new Animated.Value(0)).current;

  // Function to start the continuous oscillation animation
  const startOscillation = () => {
    // Horizontal oscillation animation
    const oscillateX = Animated.sequence([
      Animated.timing(moveXValue, {
        toValue: 2, // Slight horizontal movement
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(moveXValue, {
        toValue: -2, // Slight movement in the opposite direction
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(moveXValue, {
        toValue: 0, // Return to initial position
        duration: 500, // Smooth return
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    // Vertical oscillation animation
    const oscillateY = Animated.sequence([
      Animated.timing(moveYValue, {
        toValue: 2, // Slight vertical movement
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(moveYValue, {
        toValue: -2, // Slight movement in the opposite direction
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(moveYValue, {
        toValue: 0, // Return to initial position
        duration: 500, // Smooth return
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    // Run both animations simultaneously
    Animated.loop(
      Animated.parallel([oscillateX, oscillateY])
    ).start();
  };

  useEffect(() => {
    startOscillation();
  }, []);

  const handlePress = () => {
    // Start the pulsating animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.1, // Increase the size of the image
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1, // Return to original size
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();

    // Call the onPress function passed as a prop
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.Image
        source={source}
        style={[
          styles.bossImage,
          style,
          {
            transform: [
              { scale: scaleValue }, // Scale animation
              { translateX: moveXValue }, // Horizontal movement
              { translateY: moveYValue }  // Vertical movement
            ]
          }
        ]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bossImage: {
    width: '80%', // Adjust width as necessary
    height: undefined,
    aspectRatio: 1, // Maintain image aspect ratio
    marginTop: 20,
  },
});

export default AnimatedBossImage;
