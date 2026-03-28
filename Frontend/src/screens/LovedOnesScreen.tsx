import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const circleNotes = [
  { id: 1, from: "Nikita", message: "Thinking of you today! Take a break from coding soon. ❤️", color: '#702459' },
  { id: 2, from: "Utsab Bhai", message: "You're going to crush this demo. Let's grab food after.", color: '#2C5282' },
  { id: 3, from: "Mom", message: "Don't forget to eat something healthy today. Miss you!", color: '#276749' },
];

const myReflections = [
  { id: 1, title: "Thoughts on project anxiety", date: "March 28, 2026" },
  { id: 2, title: "Grateful for today's progress", date: "March 27, 2026" },
];

export default function LovedOnesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Horizontal Circle Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>From your circle</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {circleNotes.map((note) => (
              <View key={note.id} style={[styles.loveCard, { backgroundColor: note.color }]}>
                <Text style={styles.loveFrom}>{note.from}</Text>
                <Text style={styles.loveMessage}>{note.message}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Vertical Reflections Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>My Voice Notes</Text>
          {myReflections.map((ref) => (
            <View key={ref.id} style={styles.reflectionCard}>
              <View style={styles.playButton}>
                <Ionicons name="play" size={20} color="#FFF" />
              </View>
              <View>
                <Text style={styles.reflectionTitle}>{ref.title}</Text>
                <Text style={styles.reflectionDate}>{ref.date}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={{height: 100}}/>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#161C24' },
  section: { marginTop: 30 },
  sectionHeader: { color: '#F7FAFC', fontSize: 20, fontWeight: 'bold', paddingHorizontal: 24, marginBottom: 16 },
  horizontalScroll: { paddingHorizontal: 24, gap: 16 },
  loveCard: { width: 240, padding: 20, borderRadius: 20, minHeight: 120, justifyContent: 'space-between' },
  loveFrom: { color: '#E2E8F0', fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  loveMessage: { color: '#F7FAFC', fontSize: 16, lineHeight: 22 },
  
  reflectionCard: { flexDirection: 'row', backgroundColor: '#2D3748', marginHorizontal: 24, marginBottom: 12, padding: 16, borderRadius: 16, alignItems: 'center' },
  playButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2B6CB0', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  reflectionTitle: { color: '#E2E8F0', fontSize: 16, fontWeight: '600' },
  reflectionDate: { color: '#718096', fontSize: 12, marginTop: 4 },

  fab: { position: 'absolute', bottom: 30, right: 24, width: 64, height: 64, borderRadius: 32, backgroundColor: '#4299E1', alignItems: 'center', justifyContent: 'center', elevation: 10, shadowColor: '#4299E1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10 },
});