import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, PanResponder } from 'react-native';
import { Audio } from 'expo-av';

export default function SingingBowl() {
  const [bowlSound, setBowlSound] = useState<Audio.Sound | null>(null);
  const bowlVolumeAnim = useRef(new Animated.Value(0)).current;
  const bowlGlowAnim = useRef(new Animated.Value(0)).current;
  const isMoving = useRef(false);
  const fadeOutTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Commented out to prevent crash when file is missing
        /*
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/singing_bowl_432hz.mp3'),
          { isLooping: true, volume: 0 }
        );
        setBowlSound(sound);
        await sound.playAsync();
        */
        console.log("SingingBowl: Visual mode active. Sound is disabled.");
      } catch (e) {
        console.warn("Audio file missing. Component will still render visually.");
      }
    })();
  }, []);

  useEffect(() => {
    bowlVolumeAnim.addListener(({ value }) => {
      if (bowlSound) {
        try {
          bowlSound.setVolumeAsync(value);
        } catch (e) {
          // Ignore volume updates if sound object isn't active
        }
      }
    });
    return () => { bowlVolumeAnim.removeAllListeners(); };
  }, [bowlSound]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => { isMoving.current = true; },
      onPanResponderMove: () => {
        if (fadeOutTimeout.current) clearTimeout(fadeOutTimeout.current);
        isMoving.current = true;
        Animated.parallel([
          Animated.timing(bowlVolumeAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
          Animated.timing(bowlGlowAnim, { toValue: 1, duration: 300, useNativeDriver: false })
        ]).start();

        fadeOutTimeout.current = setTimeout(() => {
          isMoving.current = false;
          Animated.parallel([
            Animated.timing(bowlVolumeAnim, { toValue: 0, duration: 1500, useNativeDriver: false }),
            Animated.timing(bowlGlowAnim, { toValue: 0, duration: 1500, useNativeDriver: false })
          ]).start();
        }, 150);
      },
      onPanResponderRelease: () => {
        isMoving.current = false;
        Animated.parallel([
          Animated.timing(bowlVolumeAnim, { toValue: 0, duration: 2500, useNativeDriver: false }),
          Animated.timing(bowlGlowAnim, { toValue: 0, duration: 2500, useNativeDriver: false })
        ]).start();
      },
    })
  ).current;

  const bowlColor = bowlGlowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1A365D', '#4299E1']
  });

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>Use the singing bowl with 432 Hz freq to relax your mind.</Text>
      <View style={styles.touchArea} {...panResponder.panHandlers}>
        <Animated.View style={[styles.bowl, { borderColor: bowlColor, shadowColor: bowlColor }]}>
           <View style={styles.bowlInner} />
        </Animated.View>
      </View>
      <Text style={styles.freqText}>432 Hz</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  instruction: { color: '#A0AEC0', fontSize: 13, textAlign: 'center', marginBottom: 10, width: 250 },
  touchArea: { padding: 10 },
  bowl: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, backgroundColor: '#CD7F32', alignItems: 'center', justifyContent: 'center', elevation: 10, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20 },
  bowlInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#8B5A2B' },
  freqText: { color: '#CD7F32', fontSize: 14, fontWeight: 'bold', marginTop: 5 },
});