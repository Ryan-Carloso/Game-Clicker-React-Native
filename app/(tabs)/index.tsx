import React, { useRef, useEffect } from 'react';
import { SafeAreaView, StatusBar, TouchableOpacity, Dimensions, StyleSheet, Alert, Animated } from 'react-native';
import { bossesData } from '../../assets/bossesdata';
import { Text, View } from '@/components/Themed';
import AnimatedBossImage from '@/components/render/AnimatedBossImage';
import { useGame } from '../GameContext';

const { width } = Dimensions.get('window');

const GameScreen = () => {
  const { coins, damage, increaseCoins, applyDamageToBoss, bossHealth, bossIndex, animateText, setAnimateText } = useGame();
  const animatedValue = useRef(new Animated.Value(1)).current; // Reference for the animated value

  useEffect(() => {
    if (animateText) {
      bounce(); // Call the bounce function when animateText is true
      setAnimateText(false); // Reset the animation state
    }
  }, [animateText]);

  const handleAttack = () => {
    applyDamageToBoss(damage);
    increaseCoins(damage);
    if (bossHealth <= 0 && bossIndex >= bossesData.length - 1) {
      Alert.alert('Congratulations', 'You have defeated all the bosses!');
    }
    // Start the animation when attacking
    animateWord();
  };

  const animateWord = () => {
    animatedValue.setValue(1); // Reset to original scale
    Animated.spring(animatedValue, {
      toValue: 1.2, // Scale up
      friction: 2,
      tension: 160,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(animatedValue, {
        toValue: 1, // Scale back to original
        friction: 2,
        tension: 160,
        useNativeDriver: true,
      }).start();
    });
  };

  const bounce = () => {
    animatedValue.setValue(1); // Reset to original scale
    Animated.spring(animatedValue, {
      toValue: 1.2, // Scale up
      friction: 2,
      tension: 160,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(animatedValue, {
        toValue: 1, // Scale back to original
        friction: 2,
        tension: 160,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.gameContainer}>
        <Text style={styles.coinsText}>Coins: {coins}</Text>
        <Text style={styles.bossText}>Boss: {bossesData[bossIndex].name}</Text>
        <Text style={styles.healthText}>Boss Health: {bossHealth}</Text>
        <Text style={styles.damageText}>Damage per Hit: {damage}</Text>

        <AnimatedBossImage
          source={bossesData[bossIndex].image}
          onPress={handleAttack}
          style={styles.bossImage}
        />
        <Animated.Text style={{ ...styles.hitanimate, transform: [{ scale: animatedValue }] }}>
          hit
        </Animated.Text>
      </View>
      <TouchableOpacity onPress={handleAttack}>
        <Text style={styles.hitText}>Hit the boss</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameContainer: {
    alignItems: 'center',
  },
  coinsText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bossText: {
    fontSize: 24,
    marginBottom: 10,
  },
  healthText: {
    fontSize: 20,
    marginBottom: 20,
  },
  damageText: {
    fontSize: 20,
    marginBottom: 20,
  },
  hitanimate: {
    fontSize: 20,
    marginBottom: 5,
    marginTop: -30,
  },
  bossImage: {
    width: width * 0.8,
    height: undefined,
    aspectRatio: 1,
    marginTop: 20,
  },
  hitText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default GameScreen;