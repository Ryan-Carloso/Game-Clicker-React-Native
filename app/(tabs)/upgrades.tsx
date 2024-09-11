import React, { useState, useEffect, useRef } from 'react';
import { Button, View, Text, StyleSheet, Alert, Animated } from 'react-native';
import { useGame } from '../GameContext';

const UpgradeScreen: React.FC = () => {
  const { coins, setCoins, damage, setDamage, upgradeDamage, setUpgradeDamage, applyDamageToBoss, increaseCoins, autoHitUpgrade, setAutoHitUpgrade } = useGame();
  const [upgradeCost1, setUpgradeCost1] = useState(1);
  const [upgradeCost2, setUpgradeCost2] = useState(2);
  const [upgradeCostIncrease1, setUpgradeCostIncrease1] = useState(5); // Initial increase for upgrade 1
  const [upgradeCostIncrease2, setUpgradeCostIncrease2] = useState(10); // Initial increase for upgrade 2
  const [upgradeCount1, setUpgradeCount1] = useState(0); // Track upgrades for attack 1
  const [upgradeCount2, setUpgradeCount2] = useState(0); // Track upgrades for attack 2

  // Reference for the animated value
  const bounceValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (autoHitUpgrade) {
      interval = setInterval(() => {
        // Apply damage to the boss automatically
        applyDamageToBoss(upgradeDamage); // Use upgradeDamage for auto-hit
        increaseCoins(upgradeDamage);
        // Start the bounce animation
        bounce();
      }, 1000); // Interval set to 1 second for demonstration
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoHitUpgrade, upgradeDamage, applyDamageToBoss, increaseCoins]);

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
      setUpgradeDamage(upgradeDamage + 0.2); // Increase upgradeDamage
      setUpgradeCost1(upgradeCost1 + upgradeCostIncrease1); // Increase cost by the current increase amount
      setUpgradeCostIncrease1(upgradeCostIncrease1 + 2); // Increase the increase amount by 2 for the next upgrade
      setUpgradeCount1(upgradeCount1 + 1); // Increment upgrade count for attack 1
      setAutoHitUpgrade(true); // Automatically enable auto-hit when upgrading attack 1
    } else {
      Alert.alert('Insufficient Coins', 'You do not have enough coins for this upgrade.');
    }
  };

  const handleUpgrade2 = () => {
    if (coins >= upgradeCost2) {
      setCoins(coins - upgradeCost2);
      setUpgradeDamage(upgradeDamage + 0.5); // Increase upgradeDamage
      setUpgradeCost2(upgradeCost2 + upgradeCostIncrease2); // Increase cost by the current increase amount
      setUpgradeCostIncrease2(upgradeCostIncrease2 + 3); // Increase the increase amount by 3 for the next upgrade
      setUpgradeCount2(upgradeCount2 + 1); // Increment upgrade count for attack 2
      setAutoHitUpgrade(true); // Automatically enable auto-hit when upgrading attack 2
    } else {
      Alert.alert('Insufficient Coins', 'You do not have enough coins for this upgrade.');
    }
  };

  // Remove the handleAutoHitUpgrade function as it's no longer needed

  return (
    <View style={styles.container}>
      <Text>Coins: {coins.toFixed(1)}</Text>
      <Text>Current Damage: {upgradeDamage.toFixed(1)}</Text>
      <Button title={`Clicker (Cost: ${upgradeCost1.toFixed(1)}, Upgrades: ${upgradeCount1})`} onPress={handleUpgrade1} />
      <Button title={`Hero (Cost: ${upgradeCost2.toFixed(1)}, Upgrades: ${upgradeCount2})`} onPress={handleUpgrade2} />
      {/* Remove the Animated.View and Button for the auto-hit upgrade */}
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
