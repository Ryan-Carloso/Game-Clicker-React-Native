import React, { useState, useEffect, useRef } from 'react';
import { Button, View, Text, StyleSheet, Alert, Animated } from 'react-native';
import { useGame } from '../GameContext';

const UpgradeScreen: React.FC = () => {
  const { coins, setCoins, damage, setDamage, applyDamageToBoss, increaseCoins, autoHitUpgrade, setAutoHitUpgrade } = useGame();
  const [upgradeCost1, setUpgradeCost1] = useState(10);
  const [upgradeCost2, setUpgradeCost2] = useState(25);
  
  // Reference for the animated value
  const bounceValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (autoHitUpgrade) {
      interval = setInterval(() => {
        // Apply damage to the boss automatically
        applyDamageToBoss(damage);
        increaseCoins(damage);
        // Start the bounce animation
        bounce();
      }, 1000); // Interval set to 1 second for demonstration
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoHitUpgrade, damage, applyDamageToBoss, increaseCoins]);

  const bounce = () => {
    bounceValue.setValue(1); // Reset to original scale
    Animated.spring(bounceValue, {
      toValue: 1.2, // Scale up
      friction: 2,
      tension: 160,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(bounceValue, {
        toValue: 1, // Scale back to original
        friction: 2,
        tension: 160,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleUpgrade1 = () => {
    if (coins >= upgradeCost1) {
      setCoins(coins - upgradeCost1);
      setDamage(damage + 1);
      setUpgradeCost1(upgradeCost1 + 10);
    } else {
      Alert.alert('Insufficient Coins', 'You do not have enough coins for this upgrade.');
    }
  };

  const handleUpgrade2 = () => {
    if (coins >= upgradeCost2) {
      setCoins(coins - upgradeCost2);
      setDamage(damage + 2);
      setUpgradeCost2(upgradeCost2 + 15);
    } else {
      Alert.alert('Insufficient Coins', 'You do not have enough coins for this upgrade.');
    }
  };

  const handleAutoHitUpgrade = () => {
    const autoHitCost = 1; // Define the cost for the auto-hit upgrade
    if (coins >= autoHitCost && !autoHitUpgrade) {
      setCoins(coins - autoHitCost);
      setAutoHitUpgrade(true);
    } else if (!autoHitUpgrade) {
      Alert.alert('Insufficient Coins', 'You do not have enough coins for the auto-hit upgrade.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Coins: {coins}</Text>
      <Text>Current Damage: {damage}</Text>
      <Button title={`Upgrade Attack 1 (Cost: ${upgradeCost1})`} onPress={handleUpgrade1} />
      <Button title={`Upgrade Attack 2 (Cost: ${upgradeCost2})`} onPress={handleUpgrade2} />
      <Animated.View style={{ transform: [{ scale: bounceValue }] }}>
        <Button title="Auto-Hit Upgrade" onPress={handleAutoHitUpgrade} disabled={autoHitUpgrade} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ... add any additional styles you might have ...
});

export default UpgradeScreen;