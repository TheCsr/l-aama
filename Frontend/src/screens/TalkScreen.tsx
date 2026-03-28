import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Linking } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import SingingBowl from '../components/SingingBowl';

type AppState = 'idle' | 'recording' | 'processing' | 'emergency';
type StressType = 'default' | 'anxiety' | 'overstimulation' | 'fatigue' | 'clarity' | 'meditation' | 'emergency';

const THEME_COLORS = {
  default: '#161C24',
  anxiety: '#1A365D',
  overstimulation: '#1C332B',
  fatigue: '#45220A',
  clarity: '#2D3748',
  meditation: '#2B1A3A',
  emergency: '#7F1D1D',
};

export default function TalkScreen() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [currentTheme, setCurrentTheme] = useState<StressType>('default');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  
  const colorAnim = useRef(new Animated.Value(0)).current;
  const [prevColor, setPrevColor] = useState(THEME_COLORS.default);
  const [nextColor, setNextColor] = useState(THEME_COLORS.default);

  // 1. Setup Audio & Background Colors with Crash Protection
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') return;

        // Optimized for iOS stability to prevent C++ exceptions
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (e) {
        console.error("Native Audio Initialization Error:", e);
      }
    })();
  }, []);

  useEffect(() => {
    setNextColor(THEME_COLORS[currentTheme]);
    colorAnim.setValue(0);
    Animated.timing(colorAnim, { toValue: 1, duration: 2000, useNativeDriver: false }).start(() => {
      setPrevColor(THEME_COLORS[currentTheme]);
    });
  }, [currentTheme]);

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [prevColor, nextColor]
  });

  // 2. FastAPI Network Request
  const sendAudioToServer = async (uri: string) => {
    const SERVER_URL = 'https://intertransversal-ronan-undistinguishingly.ngrok-free.dev/chat/voice'; 
    const formData = new FormData();
    const fileType = uri.split('.').pop();
    formData.append('file', { uri, name: `audio.${fileType}`, type: `audio/${fileType}` } as any);

    try {
      const response = await fetch(SERVER_URL, { method: 'POST', body: formData, headers: { 'Content-Type': 'multipart/form-data' }});
      const data = await response.json();
      
      if (data.escalation_level === 3) {
        setCurrentTheme('emergency');
        setAppState('emergency');
      } else {
        setCurrentTheme(data.stress_type || 'default');
        setAppState('idle');
      }

      if (data.response) Speech.speak(data.response, { rate: 0.9, pitch: 1.0 });

    } catch (error) {
      console.warn("Server unreachable, mocking UI...");
      setTimeout(() => {
        setCurrentTheme('anxiety'); 
        setAppState('idle');
        Speech.speak("I am having trouble connecting to my brain, but I am still here with you.", { rate: 0.9 });
      }, 2000);
    }
  };

  // 3. Mic Button Logic with Improved Error Handling
  const handlePress = async () => {
    if (appState === 'idle' || appState === 'emergency') {
      Speech.stop(); 
      try {
        setAppState('recording');
        setCurrentTheme('default'); 
        const { recording: newRecording } = await Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(newRecording);
      } catch (err) {
        console.error("Recording failed to start:", err);
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
          console.error("Failed to safely stop recording:", err);
          setRecording(null);
          setAppState('idle');
        }
      }
    }
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      
      {/* Header & Mascot */}
      <View style={styles.header}>
        <TouchableOpacity><Ionicons name="settings-outline" size={28} color="#A0AEC0" /></TouchableOpacity>
        <View style={styles.mascotContainer}><Text style={{fontSize: 40}}>🐼</Text></View>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.mainContent}>
        
        {/* Giant Mic Button */}
        <View style={styles.micSection}>
          <TouchableOpacity
            style={[
              styles.micButton, 
              appState === 'recording' ? styles.micButtonRecording : (appState === 'emergency' ? styles.micButtonEmergency : styles.micButtonIdle)
            ]}
            onPress={handlePress}
            activeOpacity={0.8}
            disabled={appState === 'processing'}
          >
            {appState === 'idle' && <Ionicons name="mic-outline" size={72} color="#FFFFFF" />}
            {appState === 'recording' && <Ionicons name="square" size={40} color="#FFFFFF" />}
            {appState === 'processing' && <MaterialCommunityIcons name="chart-bar" size={72} color="#FFFFFF" />}
            {appState === 'emergency' && <Ionicons name="mic-outline" size={72} color="#FFFFFF" />}
          </TouchableOpacity>
          
          <Text style={styles.micText}>
            {appState === 'idle' && "Tap to talk to Sathi"}
            {appState === 'recording' && "Listening..."}
            {appState === 'processing' && "Sathi is thinking..."}
            {appState === 'emergency' && "You are not alone. I am here."}
          </Text>

          {/* Emergency Hotline Button */}
          {appState === 'emergency' && (
            <TouchableOpacity style={styles.hotlineButton} onPress={() => Linking.openURL('tel:988')}>
              <Ionicons name="call" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.hotlineText}>Call 988 Crisis Lifeline</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Singing Bowl Component */}
        <View style={styles.bottomSection}>
          <SingingBowl />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 20 },
  mascotContainer: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  mainContent: { flex: 1, justifyContent: 'space-between', paddingVertical: 40 },
  micSection: { alignItems: 'center', marginTop: 30 },
  micButton: { width: 220, height: 220, borderRadius: 110, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 35, elevation: 15 },
  micButtonIdle: { backgroundColor: '#2B6CB0', shadowColor: '#4299E1', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  micButtonRecording: { backgroundColor: '#E53E3E', shadowColor: '#FC8181' },
  micButtonEmergency: { backgroundColor: '#7F1D1D', shadowColor: '#9B2C2C' },
  micText: { color: '#F7FAFC', fontSize: 20, fontWeight: '600', marginTop: 30 },
  hotlineButton: { flexDirection: 'row', backgroundColor: '#E53E3E', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 30, alignItems: 'center', marginTop: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  hotlineText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  bottomSection: { alignItems: 'center', marginBottom: 10 },
});