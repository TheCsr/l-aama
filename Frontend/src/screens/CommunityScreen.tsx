import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockNotes = [
  { id: 1, text: "Just feeling incredibly burnt out with grad school right now.", tags: ["#gradschool", "#burnout"], time: "2h ago" },
  { id: 2, text: "Hackathons are stressful but remember to breathe! We got this.", tags: ["#hackathon", "#anxiety"], time: "5h ago" },
  { id: 3, text: "You are more than your productivity.", tags: ["#selfworth"], time: "1d ago" },
];

export default function CommunityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Community</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#718096" />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Filter by feelings..." 
          placeholderTextColor="#718096"
        />
      </View>

      <ScrollView style={styles.feed} showsVerticalScrollIndicator={false}>
        {mockNotes.map((note) => (
          <View key={note.id} style={styles.card}>
            <Text style={styles.cardText}>{note.text}</Text>
            <View style={styles.cardFooter}>
              <View style={styles.tagContainer}>
                {note.tags.map((tag, i) => (
                  <Text key={i} style={styles.tag}>{tag}</Text>
                ))}
              </View>
              <Text style={styles.timeText}>{note.time}</Text>
            </View>
          </View>
        ))}
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#161C24' },
  header: { padding: 24 },
  headerText: { fontSize: 28, fontWeight: 'bold', color: '#F7FAFC' },
  searchBar: { flexDirection: 'row', backgroundColor: '#2D3748', marginHorizontal: 24, padding: 14, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
  searchInput: { flex: 1, marginLeft: 10, color: '#F7FAFC', fontSize: 16 },
  feed: { paddingHorizontal: 24 },
  card: { backgroundColor: '#2D3748', padding: 20, borderRadius: 20, marginBottom: 16 },
  cardText: { color: '#E2E8F0', fontSize: 16, lineHeight: 24, marginBottom: 16 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagContainer: { flexDirection: 'row', gap: 8 },
  tag: { color: '#4299E1', backgroundColor: '#1A202C', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 12, overflow: 'hidden' },
  timeText: { color: '#718096', fontSize: 12 },
});