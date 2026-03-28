import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../constants/Theme';

const FORUMS = [
  { id: 1, title: "Burnout & Exhaustion", desc: "A safe place to talk about feeling overwhelmed and tired.", members: "1.2k", active: true },
  { id: 2, title: "Academic Stress", desc: "Navigating exams, deadlines, and the pressure to succeed.", members: "850", active: true },
  { id: 3, title: "Family Expectations", desc: "Balancing your path with family traditions and pressure.", members: "2.1k", active: false },
  { id: 4, title: "Career Anxiety", desc: "Fears about the future, finding a job, or changing paths.", members: "1.5k", active: false },
  { id: 5, title: "Feeling Lonely", desc: "When you feel like nobody really understands what you're going through.", members: "3.4k", active: true },
];

export default function CommunitiesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Forums</Text>
        <Text style={styles.subtext}>Find a safe space to share your thoughts, anonymously.</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Theme.colors.textSecondary} />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search for a topic or issue..." 
          placeholderTextColor={Theme.colors.textTertiary}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Communities</Text>
        </View>

        {FORUMS.map((forum) => (
          <TouchableOpacity key={forum.id} style={styles.forumCard} activeOpacity={0.7}>
            <View style={styles.cardInfo}>
              <View style={styles.cardHeader}>
                <Text style={styles.forumTitle}>{forum.title}</Text>
                {forum.active && <View style={styles.activeDot} />}
              </View>
              <Text style={styles.forumDesc}>{forum.desc}</Text>
              <View style={styles.metaContainer}>
                <Ionicons name="people" size={14} color={Theme.colors.textTertiary} />
                <Text style={styles.metaText}>{forum.members} talking here</Text>
              </View>
            </View>
            <View style={styles.cardAction}>
              <MaterialIcons name="chevron-right" size={24} color={Theme.colors.textTertiary} />
            </View>
          </TouchableOpacity>
        ))}

        <View style={{height: 120}} />
      </ScrollView>

      {/* Floating Action Button for New Thread */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Ionicons name="create" size={24} color={Theme.colors.surface} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { padding: Theme.spacing.screenPadding, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: Theme.colors.textPrimary, marginBottom: 8 },
  subtext: { fontSize: 16, color: Theme.colors.textSecondary, lineHeight: 22 },
  searchContainer: { flexDirection: 'row', backgroundColor: Theme.colors.surface, marginHorizontal: Theme.spacing.screenPadding, padding: 14, borderRadius: Theme.radius.input, alignItems: 'center', marginBottom: 24, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  searchInput: { flex: 1, marginLeft: 10, color: Theme.colors.textPrimary, fontSize: 16 },
  scrollContent: { paddingHorizontal: Theme.spacing.screenPadding },
  sectionHeader: { marginBottom: 16, borderBottomWidth: 1, borderBottomColor: Theme.colors.divider, paddingBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  forumCard: { backgroundColor: Theme.colors.surface, borderRadius: Theme.radius.card, marginBottom: 16, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: Theme.colors.textPrimary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10 },
  cardInfo: { flex: 1, padding: Theme.spacing.cardPadding },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  forumTitle: { fontSize: 18, fontWeight: '600', color: Theme.colors.textPrimary, marginRight: 8 },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Theme.colors.mascotCoral },
  forumDesc: { fontSize: 15, color: Theme.colors.textSecondary, marginBottom: 14, lineHeight: 22 },
  metaContainer: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 13, color: Theme.colors.textTertiary, marginLeft: 6, fontWeight: '500' },
  cardAction: { paddingHorizontal: 16, borderLeftWidth: 1, borderLeftColor: Theme.colors.divider, paddingVertical: 12 },
  fab: { position: 'absolute', bottom: Theme.spacing.bottomNavSize + 20, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: Theme.colors.mascotCoral, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: Theme.colors.mascotCoral, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 }
});
