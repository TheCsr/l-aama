import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image, Pressable, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Theme } from '../constants/Theme';

type AppState = 'idle' | 'recording' | 'processing' | 'reflection';

// Pre-require all mascot images
const MASCOT_IDLE = require('../../assets/mascot_idle.png');
const MASCOT_LISTEN = require('../../assets/mascot_listen.png');
const MASCOT_THINK = require('../../assets/mascot_think.png');

export default function HomeScreen() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcript, setTranscript] = useState<string>('');

  // Modals & Interactive states
  const [showAudioSheet, setShowAudioSheet] = useState(false);
  const [isPlaying432, setIsPlaying432] = useState(false);

  // Sounds refs
  const tapSoundRef = useRef<Audio.Sound | null>(null);
  const patSoundRef = useRef<Audio.Sound | null>(null);
  const calmSoundRef = useRef<Audio.Sound | null>(null);

  // Animations
  const glowAnim = useRef(new Animated.Value(1)).current;
  const mascotScale = useRef(new Animated.Value(1)).current;

  // ──── Audio setup ────
  useEffect(() => {
    let mounted = true;
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

        const { sound: tap } = await Audio.Sound.createAsync(require('../../assets/tap.wav'));
        if (mounted) tapSoundRef.current = tap;

        const { sound: pat } = await Audio.Sound.createAsync(require('../../assets/freesound_community-pat-cloth-6727.mp3'));
        if (mounted) patSoundRef.current = pat;

        const { sound: calm } = await Audio.Sound.createAsync(require('../../assets/432hz.wav'));
        await calm.setIsLoopingAsync(true);
        if (mounted) calmSoundRef.current = calm;

      } catch (e) {
        console.error('Audio init error:', e);
      }
    })();

    return () => {
      mounted = false;
      tapSoundRef.current?.unloadAsync();
      patSoundRef.current?.unloadAsync();
      calmSoundRef.current?.unloadAsync();
    };
  }, []);

  // ──── Breathing glow animation ────
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1.2, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, [glowAnim]);

  // ──── Sound helpers ────
  const playTap = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true });
      await tapSoundRef.current?.replayAsync();
    } catch {}
  }, []);

  const handlePetMascot = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(mascotScale, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.spring(mascotScale, { toValue: 1, friction: 3, tension: 200, useNativeDriver: true }),
    ]).start();
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true });
      await patSoundRef.current?.replayAsync();
    } catch (e) {
      console.warn('Pat sound error:', e);
    }
  }, [mascotScale]);

  // ──── 432Hz controls ────
  const startCalmAudio = useCallback(async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      await calmSoundRef.current?.playFromPositionAsync(0);
      setIsPlaying432(true);
    } catch (e) {
      console.error('Calm audio play error:', e);
    }
  }, []);

  const stopCalmAudio = useCallback(async () => {
    try {
      await calmSoundRef.current?.stopAsync();
      setIsPlaying432(false);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    } catch (e) {
      console.error('Calm audio stop error:', e);
    }
  }, []);

  // ──── Voice interaction Loop ────
  const sendAudioToServer = async (uri: string) => {
    // UPDATED: Matches your MacBook Direct IP and correct prefix
    const SERVER_URL = 'http://192.168.1.69:8000/chat/voice';
    const formData = new FormData();
    const fileType = uri.split('.').pop() || 'caf';
    formData.append('file', { uri, name: `audio.${fileType}`, type: `audio/${fileType}` } as any);

    try {
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = await response.json();

      setAppState('reflection');
      setTranscript(data.response || '...');
      playTap();

      if (data.response) {
        // FIXED: Switch to playback mode to unlock the main speaker for Nepali TTS
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });

        // Forced Nepali Language with specific rate for empathy
        Speech.speak(data.response, { 
            language: 'ne-NP', 
            rate: 0.85, 
            pitch: 1.0 
        });
      }
    } catch (error) {
      console.warn('Server unreachable:', error);
      setAppState('reflection');
      const fallbackText = 'I am having trouble connecting to my brain, but I am still here with you.';
      setTranscript(fallbackText);
      Speech.speak(fallbackText, { rate: 0.9 });
    }
  };

  const handlePress = async () => {
    playTap();
    if (appState === 'idle' || appState === 'reflection') {
      Speech.stop();
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        setAppState('recording');
        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(newRecording);
      } catch (err) {
        console.error('Recording failed:', err);
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
          console.error('Failed to stop:', err);
          setRecording(null);
          setAppState('idle');
        }
      }
    }
  };

  const mascotSource =
    appState === 'recording'
      ? MASCOT_LISTEN
      : appState === 'processing' || appState === 'reflection'
        ? MASCOT_THINK
        : MASCOT_IDLE;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Asha</Text>
        <TouchableOpacity style={styles.privacyPill} activeOpacity={0.7}>
          <Ionicons name="lock-closed" size={12} color={Theme.colors.mascotCocoa} style={{ marginRight: 4 }} />
          <Text style={styles.privacyText}>
            {appState === 'recording' ? 'Listening privately' : 'Private by default'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={playTap}>
          <Ionicons name="settings-outline" size={24} color={Theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.micContainer}>
          <View style={styles.micWrapper}>
            <Pressable onPress={handlePetMascot} style={styles.mascotTouchArea}>
              <Animated.Image
                source={mascotSource}
                style={[styles.mascotImage, { transform: [{ scale: mascotScale }] }]}
              />
            </Pressable>

            <Animated.View
              style={[
                styles.glowRing,
                { transform: [{ scale: appState === 'idle' ? glowAnim : 1 }] },
                appState === 'recording' && styles.glowRingActive,
              ]}
            />

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
            {appState === 'idle' && 'Tap to talk'}
            {appState === 'recording' && 'Take your time...'}
            {appState === 'processing' && 'Thinking...'}
            {appState === 'reflection' && 'Tap to talk again'}
          </Text>
        </View>

        <View style={styles.bottomSection}>
          {appState === 'reflection' ? (
            <TouchableOpacity style={styles.reflectionCard} activeOpacity={0.9}>
              <Text style={styles.reflectionTitle}>Sathi's Response</Text>
              <Text style={styles.reflectionBody}>{transcript}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.calmAudioCard}
              activeOpacity={0.8}
              onPress={async () => {
                playTap();
                setShowAudioSheet(true);
                await startCalmAudio();
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.playIconContainer}>
                  <Ionicons name="play" size={20} color={Theme.colors.surface} />
                </View>
                <View style={{ marginLeft: 16 }}>
                  <Text style={styles.calmAudioTitle}>Calming audio</Text>
                  <Text style={styles.calmAudioSub}>Take a quiet moment first</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Modal
        visible={showAudioSheet}
        animationType="slide"
        transparent={true}
        onRequestClose={async () => {
          setShowAudioSheet(false);
          await stopCalmAudio();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>432 Hz · Calming tone</Text>
            <View style={styles.audioVisualizerPlaceholder}>
              <Animated.View style={[styles.glowRingModal, { transform: [{ scale: glowAnim }] }]} />
              <Ionicons name="musical-notes" size={48} color={Theme.colors.mascotCoral} />
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={async () => {
                playTap();
                setShowAudioSheet(false);
                await stopCalmAudio();
              }}
            >
              <Text style={styles.modalCloseText}>Stop & Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20 },
  logo: { fontSize: 24, fontWeight: 'bold', color: Theme.colors.textPrimary },
  privacyPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.surfaceSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: Theme.colors.divider },
  privacyText: { color: Theme.colors.mascotCocoa, fontSize: 12, fontWeight: '500' },
  mainContent: { flex: 1, justifyContent: 'space-between', paddingVertical: 40 },
  micContainer: { alignItems: 'center', marginTop: 20, flex: 1 },
  micWrapper: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  mascotTouchArea: { position: 'absolute', top: -120, zIndex: 10, width: 150, height: 150 },
  mascotImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  glowRing: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: Theme.colors.warmGlow },
  glowRingActive: { backgroundColor: 'rgba(215,135,114,0.3)' },
  micButton: { width: 140, height: 140, borderRadius: 70, backgroundColor: Theme.colors.mascotCoral, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: Theme.colors.mascotCoral, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 15, zIndex: 5 },
  micButtonActive: { backgroundColor: Theme.colors.mascotClay },
  helperText: { color: Theme.colors.textPrimary, fontSize: 22, fontWeight: '600', marginTop: 60 },
  bottomSection: { paddingHorizontal: 24, paddingBottom: 20 },
  calmAudioCard: { backgroundColor: Theme.colors.surface, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center' },
  playIconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: Theme.colors.mascotPeach, alignItems: 'center', justifyContent: 'center' },
  calmAudioTitle: { color: Theme.colors.textPrimary, fontSize: 16, fontWeight: '600' },
  calmAudioSub: { color: Theme.colors.textSecondary, fontSize: 14, marginTop: 4 },
  reflectionCard: { backgroundColor: Theme.colors.surface, borderRadius: 16, padding: 20 },
  reflectionTitle: { color: Theme.colors.textPrimary, fontSize: 18, fontWeight: '600', marginBottom: 12 },
  reflectionBody: { color: Theme.colors.textSecondary, fontSize: 16, lineHeight: 24 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(70, 42, 38, 0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Theme.colors.background, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, alignItems: 'center' },
  modalHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: Theme.colors.divider, marginBottom: 20 },
  modalTitle: { color: Theme.colors.textPrimary, fontSize: 22, fontWeight: '700', marginBottom: 8 },
  audioVisualizerPlaceholder: { height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  glowRingModal: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: Theme.colors.surfaceSoft },
  modalCloseBtn: { backgroundColor: Theme.colors.mascotCoral, paddingVertical: 14, width: '100%', borderRadius: 25, alignItems: 'center' },
  modalCloseText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
});