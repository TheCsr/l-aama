import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Linking, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Theme } from '../constants/Theme';
import { SUPPORT_REGIONS, RegionalSupport } from '../constants/Helplines';

const CATEGORIES = ["Volunteers", "Counsellors", "NGOs", "Helplines", "Student support"];

const SUPPORT_ORGS = [
  { id: 1, name: "Crisis Help Network", desc: "Available 24/7 for immediate listening and rapid response.", helpWith: "Anxiety, Stress, Immediate crisis" },
  { id: 2, name: "Student Wellness Center", desc: "For academic and personal guidance through the university.", helpWith: "Burnout, Feeling behind, Career stress" },
];

export default function SupportScreen() {
  const [region, setRegion] = useState<RegionalSupport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocation() {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const detectedRegion = SUPPORT_REGIONS[data.country_code] || SUPPORT_REGIONS['DEFAULT'];
        setRegion(detectedRegion);
      } catch (error) {
        console.warn('Geolocation failed, using default', error);
        setRegion(SUPPORT_REGIONS['DEFAULT']);
      } finally {
        setLoading(false);
      }
    }
    fetchLocation();
  }, []);

  if (loading || !region) {
     return (
       <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={Theme.colors.mascotCoral} />
       </SafeAreaView>
     );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Support</Text>
        <Text style={styles.subtext}>Trusted people and organisations when you want more than AI support</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Urgent Support Section */}
        <View style={styles.urgentCard}>
          <View style={styles.urgentHeaderRow}>
            <Ionicons name="warning" size={20} color={Theme.colors.urgentSoft} />
            <Text style={styles.urgentTitle}>Need urgent help? ({region.countryName})</Text>
          </View>
          <Text style={styles.urgentDesc}>Dial your local emergency medical services immediately.</Text>
          <TouchableOpacity style={styles.urgentAction} activeOpacity={0.8} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); Linking.openURL(`tel:${region.emergencyMedical}`).catch(() => Alert.alert('Error', `Please dial ${region.emergencyMedical}`)); }}>
            <Text style={styles.urgentActionText}>Call {region.emergencyMedical}</Text>
            <Ionicons name="call" size={16} color={Theme.colors.surface} />
          </TouchableOpacity>
        </View>

        {/* Category Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {CATEGORIES.map((cat, i) => (
            <TouchableOpacity key={i} style={styles.catChip}>
              <Text style={styles.catText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Local Helplines Section */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mental Health Lines ({region.countryName})</Text>
        </View>
        <View style={styles.section}>
          {region.mentalHealth.map((hl, i) => (
             <View key={`hl-${i}`} style={styles.orgCard}>
                <View style={styles.orgHeader}>
                   <Text style={styles.orgName}>{hl.name}</Text>
                </View>
                <Text style={styles.orgDesc}>{hl.description}</Text>
                <TouchableOpacity style={styles.contactBtn} activeOpacity={0.8} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    if(hl.number.startsWith('http')) { Linking.openURL(hl.number); }
                    else { Linking.openURL(`tel:${hl.number.replace(/ /g,'')}`); }
                 }}>
                  <Text style={styles.contactBtnText}>{hl.number.startsWith('http') ? 'Visit Website' : `Call ${hl.number}`}</Text>
                </TouchableOpacity>
             </View>
          ))}
        </View>

        {/* Embassy Section */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nepal Embassy ({region.countryName})</Text>
        </View>
        <View style={styles.section}>
             <View style={styles.orgCard}>
                <View style={styles.orgHeader}>
                   <Text style={styles.orgName}>{region.countryName === 'International' ? 'Ministry of Foreign Affairs' : 'Embassy & Consular Services'}</Text>
                </View>
                <Text style={[styles.orgDesc, {marginBottom: 12, fontSize: 13}]}><Ionicons name="location-outline" size={14}/> {region.embassy.address}</Text>
                
                <View style={{flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap'}}>
                  <TouchableOpacity style={{backgroundColor: Theme.colors.surfaceSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Theme.radius.pill}} onPress={() => Linking.openURL(`mailto:${region.embassy.email}`)}>
                    <Text style={{color: Theme.colors.textSecondary, fontSize: 12}}>Email</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{backgroundColor: Theme.colors.surfaceSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Theme.radius.pill}} onPress={() => Linking.openURL(region.embassy.website)}>
                    <Text style={{color: Theme.colors.textSecondary, fontSize: 12}}>Website</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.contactBtn} activeOpacity={0.8} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); Linking.openURL(`tel:${region.embassy.phone.replace(/ /g,'')}`); }}>
                  <Text style={styles.contactBtnText}>Call {region.embassy.phone}</Text>
                </TouchableOpacity>
             </View>
        </View>

        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>General Directory</Text>
        </View>

        <View style={styles.section}>
          {SUPPORT_ORGS.map((org) => (
            <View key={org.id} style={styles.orgCard}>
              <View style={styles.orgHeader}>
                <Text style={styles.orgName}>{org.name}</Text>
                <TouchableOpacity>
                   <MaterialCommunityIcons name="bookmark-outline" size={22} color={Theme.colors.textTertiary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.orgDesc}>{org.desc}</Text>
              
              <View style={styles.helpsWithBox}>
                <Text style={styles.helpsWithLabel}>Helps with:</Text>
                <Text style={styles.helpsWithText}>{org.helpWith}</Text>
              </View>

              <TouchableOpacity style={styles.contactBtn} activeOpacity={0.8} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); Alert.alert("Options", `Opening contact pathways for ${org.name}`); }}>
                <Text style={styles.contactBtnText}>View options</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{height: 120}}/>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { padding: Theme.spacing.screenPadding, paddingBottom: 16 },
  title: { color: Theme.colors.textPrimary, fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtext: { color: Theme.colors.textSecondary, fontSize: 16, lineHeight: 22 },
  scrollContent: { paddingHorizontal: Theme.spacing.screenPadding },
  
  urgentCard: { backgroundColor: '#FFF0F0', borderColor: Theme.colors.urgentSoft, borderWidth: 1, padding: Theme.spacing.cardPadding, borderRadius: Theme.radius.card, marginBottom: Theme.spacing.section, elevation: 2, shadowColor: Theme.colors.urgentSoft, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  urgentHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  urgentTitle: { color: Theme.colors.urgentSoft, fontSize: 18, fontWeight: '700', marginLeft: 8 },
  urgentDesc: { color: Theme.colors.textSecondary, fontSize: 15, marginBottom: 16, lineHeight: 22 },
  urgentAction: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.urgentSoft, paddingVertical: 12, paddingHorizontal: 16, borderRadius: Theme.radius.pill, alignSelf: 'flex-start' },
  urgentActionText: { color: Theme.colors.surface, fontWeight: '600', marginRight: 8 },
  
  categoriesScroll: { marginBottom: Theme.spacing.section, flexDirection: 'row' },
  catChip: { backgroundColor: Theme.colors.surface, paddingHorizontal: 16, paddingVertical: 10, borderRadius: Theme.radius.pill, marginRight: Theme.spacing.chipGap, borderWidth: 1, borderColor: Theme.colors.divider, shadowColor: Theme.colors.textPrimary, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  catText: { color: Theme.colors.textSecondary, fontSize: 14, fontWeight: '600' },
  
  sectionHeader: { marginBottom: 16, borderBottomWidth: 1, borderBottomColor: Theme.colors.divider, paddingBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  section: { marginTop: 8 },
  
  orgCard: { backgroundColor: Theme.colors.surface, padding: Theme.spacing.cardPadding, borderRadius: Theme.radius.card, marginBottom: 16, elevation: 2, shadowColor: Theme.colors.textPrimary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10 },
  orgHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  orgName: { color: Theme.colors.textPrimary, fontSize: 18, fontWeight: '700' },
  orgDesc: { color: Theme.colors.textSecondary, fontSize: 15, marginBottom: 16, lineHeight: 22 },
  
  helpsWithBox: { backgroundColor: Theme.colors.surfaceSoft, padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(122, 72, 64, 0.05)' },
  helpsWithLabel: { color: Theme.colors.textTertiary, fontSize: 11, marginBottom: 4, textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.5 },
  helpsWithText: { color: Theme.colors.textSecondary, fontSize: 14, fontWeight: '500' },
  
  contactBtn: { backgroundColor: Theme.colors.surfaceSoft, paddingVertical: 12, borderRadius: Theme.radius.pill, alignItems: 'center' },
  contactBtnText: { color: Theme.colors.textPrimary, fontWeight: '600', fontSize: 15 },
});
