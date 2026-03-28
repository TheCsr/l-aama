import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Theme } from '../constants/Theme';

type AppState = 'idle' | 'recording' | 'processing' | 'reflection';

export default function HomeScreen() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  
  // Glowing animation
  const glowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') return;
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (e) {
        console.error("Audio init error:", e);
      }
    })();
  }, []);

  useEffect(() => {
    // Breathing glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [glowAnim]);

  const sendAudioToServer = async (uri: string) => {
    const SERVER_URL = 'http://192.168.1.69:8000/chat/voice';
    const formData = new FormData();
    const fileType = uri.split('.').pop() || 'caf';
    formData.append('file', { uri, name: `audio.${fileType}`, type: `audio/${fileType}` } as any);

    try {
      const response = await fetch(SERVER_URL, { method: 'POST', body: formData, headers: { 'Content-Type': 'multipart/form-data' }});
      const data = await response.json();
      
      setAppState('reflection');
      setTranscript(data.response || "It sounds like you may be carrying a mix of pressure and exhaustion.");
      if (data.response) Speech.speak(data.response, { rate: 0.9, pitch: 1.0 });
    } catch (error) {
      console.warn("Server unreachable, mocking UI...");
      setTimeout(() => {
        setAppState('reflection');
        const fallbackText = "I am having trouble connecting to my brain, but I am still here with you. Take a warm breath.";
        setTranscript(fallbackText);
        Speech.speak(fallbackText, { rate: 0.9 });
      }, 1500);
    }
  };

  const handlePress = async () => {
    if (appState === 'idle' || appState === 'reflection') {
      Speech.stop(); 
      try {
        setAppState('recording');
        const { recording: newRecording } = await Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(newRecording);
      } catch (err) {
        console.error("Recording failed:", err);
        setAppState('idle');
      }
    } else if (appState === 'recording') {
      setAppState('processing');
      if (recording) {
        try {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          setRecording(null);
          if (uri) await sendAudioToServer(uri);
          else setAppState('idle');
        } catch (err) {
          console.error("Failed to stop recording:", err);
          setRecording(null);
          setAppState('idle');
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Asha</Text>
        <View style={styles.privacyPill}>
          <Ionicons name="lock-closed" size={12} color={Theme.colors.mascotCocoa} style={{marginRight: 4}}/>
          <Text style={styles.privacyText}>
            {appState === 'recording' ? 'Listening privately' : 'Private by default'}
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color={Theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        
        {/* Mascot & Hero Mic */}
        <View style={styles.micContainer}>
          
          <View style={styles.micWrapper}>
            {/* Render all 3 states at opacity 0/1 to eliminate flickering */}
            <Image source={require('../../assets/mascot_idle.png')} style={[styles.mascot, { opacity: appState === 'idle' ? 1 : 0 }]} />
            <Image source={require('../../assets/mascot_listen.png')} style={[styles.mascot, { opacity: appState === 'recording' ? 1 : 0 }]} />
            <Image source={require('../../assets/mascot_think.png')} style={[styles.mascot, { opacity: (appState === 'processing' || appState === 'reflection') ? 1 : 0 }]} />
            
            <Animated.View style={[
              styles.glowRing, 
              { transform: [{ scale: appState === 'idle' ? glowAnim : 1 }] },
              appState === 'recording' && styles.glowRingActive
            ]} />
            
            <TouchableOpacity
              style={[styles.micButton, appState === 'recording' && styles.micButtonActive]}
              onPress={handlePress}
              activeOpacity={0.9}
              disabled={appState === 'processing'}
            >
              {appState === 'idle' && <Ionicons name="mic" size={56} color="#FFFFFF" />}
              {appState === 'recording' && <Ionicons name="stop" size={40} color="#FFFFFF" />}
              {appState === 'processing' && <MaterialCommunityIcons name="waveform" size={56} color="#FFFFFF" />}
              {appState === 'reflection' && <Ionicons name="mic" size={56} color="#FFFFFF" />}
            </TouchableOpacity>
          </View>
          
          <Text style={styles.helperText}>
            {appState === 'idle' && "Tap to talk"}
            {appState === 'recording' && "Take your time..."}
            {appState === 'processing' && "Thinking..."}
            {appState === 'reflection' && "Tap to talk again"}
          </Text>
          {(appState === 'idle' || appState === 'reflection') && (
            <Text style={styles.subHelperText}>Say as much or as little as you want</Text>
          )}
        </View>

        {/* Reflection Card OR Calm Audio */}
        <View style={styles.bottomSection}>
          {appState === 'reflection' ? (
            <View style={styles.reflectionCard}>
              <Text style={styles.reflectionTitle}>What I'm noticing</Text>
              <Text style={styles.reflectionBody}>{transcript}</Text>
              <View style={styles.tagContainer}>
                <Text style={styles.tag}>Burnout</Text>
                <Text style={styles.tag}>Pressure</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.calmAudioCard}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.playIconContainer}>
                  <Ionicons name="play" size={20} color={Theme.colors.surface} />
                </View>
                <View style={{marginLeft: 16}}>
                  <Text style={styles.calmAudioTitle}>Calming audio</Text>
                  <Text style={styles.calmAudioSub}>Take a quiet moment first</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Theme.spacing.screenPadding, paddingTop: 20 },
  logo: { fontSize: 24, fontWeight: 'bold', color: Theme.colors.textPrimary },
  privacyPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.surfaceSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Theme.radius.pill, borderWidth: 1, borderColor: Theme.colors.divider },
  privacyText: { color: Theme.colors.mascotCocoa, fontSize: 12, fontWeight: '500' },
  mainContent: { flex: 1, justifyContent: 'space-between', paddingVertical: 40 },
  micContainer: { alignItems: 'center', marginTop: 20, flex: 1 },
  micWrapper: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  mascot: { width: 140, height: 140, resizeMode: 'contain', position: 'absolute', top: -115, zIndex: 10 },
  glowRing: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: Theme.colors.warmGlow },
  glowRingActive: { backgroundColor: 'rgba(215,135,114,0.3)' },
  micButton: { width: 140, height: 140, borderRadius: 70, backgroundColor: Theme.colors.mascotCoral, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: Theme.colors.mascotCoral, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 15, zIndex: 5 },
  micButtonActive: { backgroundColor: Theme.colors.mascotClay },
  helperText: { color: Theme.colors.textPrimary, fontSize: 22, fontWeight: '600', marginTop: 60 },
  subHelperText: { color: Theme.colors.textSecondary, fontSize: 15, marginTop: 8 },
  bottomSection: { paddingHorizontal: Theme.spacing.screenPadding, paddingBottom: 20 },
  calmAudioCard: { backgroundColor: Theme.colors.surface, borderRadius: Theme.radius.card, padding: Theme.spacing.cardPadding, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  playIconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: Theme.colors.mascotPeach, alignItems: 'center', justifyContent: 'center' },
  calmAudioTitle: { color: Theme.colors.textPrimary, fontSize: 16, fontWeight: '600' },
  calmAudioSub: { color: Theme.colors.textSecondary, fontSize: 14, marginTop: 4 },
  reflectionCard: { backgroundColor: Theme.colors.surface, borderRadius: Theme.radius.card, padding: Theme.spacing.cardPadding, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  reflectionTitle: { color: Theme.colors.textPrimary, fontSize: 18, fontWeight: '600', marginBottom: 12 },
  reflectionBody: { color: Theme.colors.textSecondary, fontSize: 16, lineHeight: 24, marginBottom: 16 },
  tagContainer: { flexDirection: 'row', gap: 8 },
  tag: { color: Theme.colors.textSecondary, backgroundColor: Theme.colors.surfaceSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Theme.radius.pill, fontSize: 12 },
});
