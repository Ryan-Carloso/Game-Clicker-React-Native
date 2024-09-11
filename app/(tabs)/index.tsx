import React, { useRef, useEffect } from 'react';
import { SafeAreaView, StatusBar, TouchableOpacity, Dimensions, StyleSheet, Alert, Animated, ScrollView } from 'react-native';
import { bossesData } from '../../assets/bossesdata';
import { Text, View } from '@/components/Themed';
import AnimatedBossImage from '@/components/render/AnimatedBossImage';
import { useGame } from '../GameContext';

const { width } = Dimensions.get('window');

const GameScreen = () => {
  const { coins, damage, upgradeDamage, increaseCoins, applyDamageToBoss, bossHealth, bossIndex, animateText, setAnimateText, autoHit } = useGame();
  const animatedValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animateText) {
      bounce();
      setAnimateText(false);
    }
    if (autoHit) {
      const autoHitInterval = setInterval(() => {
        handleAttack();
      }, 1000);
      return () => clearInterval(autoHitInterval);
    }
  }, [animateText, autoHit]);

  const handleAttack = () => {
    applyDamageToBoss(damage); // Use damage for manual hits
    increaseCoins(damage);
    if (bossHealth <= 0 && bossIndex >= bossesData.length - 1) {
      Alert.alert('Congratulations', 'You have defeated all the bosses!');
    }
    animateWord();
  };

  const animateWord = () => {
    animatedValue.setValue(1);
    Animated.spring(animatedValue, {
      toValue: 1.2,
      friction: 2,
      tension: 160,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(animatedValue, {
        toValue: 1,
        friction: 2,
        tension: 160,
        useNativeDriver: true,
      }).start();
    });
  };

  const bounce = () => {
    animatedValue.setValue(1);
    Animated.spring(animatedValue, {
      toValue: 1.2,
      friction: 2,
      tension: 160,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(animatedValue, {
        toValue: 1,
        friction: 2,
        tension: 160,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View style={styles.gameContainer}>
        <Text style={styles.coinsText}>Coins: {coins.toFixed(1)}</Text>
        <Text style={styles.bossText}>Boss: {bossesData[bossIndex].name}</Text>
        <Text style={styles.healthText}>Boss Health: {bossHealth.toFixed(1)}</Text>
        <Text style={styles.damageText}>Damage per second: {upgradeDamage.toFixed(1)}</Text>

        <Animated.View style={{ ...styles.bossImage, transform: [{ scale: animatedValue }] }}>
          <AnimatedBossImage
            source={bossesData[bossIndex].image}
            onPress={handleAttack}
            style={styles.bossImage}
          />
        </Animated.View>
        <Animated.Text style={{ ...styles.hitanimate, transform: [{ scale: animatedValue }] }}>
          Lottie animated next
        </Animated.Text>

      <TouchableOpacity onPress={handleAttack}>
        <Text style={styles.hitText}>Hit the boss</Text>
      </TouchableOpacity>
      </View>
      </ScrollView>
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
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  coinsText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  bossText: {
    fontSize: 24,
    marginBottom: 10,
    color: '#000',

  },
  healthText: {
    fontSize: 20,
    marginBottom: 5,
    color: '#000',

  },
  damageText: {
    fontSize: 20,
    marginBottom: 5,
    color: '#000',

  },
  hitanimate: {
    fontSize: 20,
    marginBottom: 5,
  },
  bossImage: {
    width: width * 0.8,
    height: undefined,
    aspectRatio: 1,
  },
  hitText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',

  },
});

export default GameScreen;