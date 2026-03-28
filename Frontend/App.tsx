import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Notice the added '/src/' in these paths!
import TalkScreen from './src/screens/TalkScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import LovedOnesScreen from './src/screens/LovedOnesScreen';

type TabName = 'Talk' | 'Community' | 'LovedOnes';


export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('Talk');

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Main Content Area */}
      <View style={styles.screenContainer}>
        {activeTab === 'Talk' && <TalkScreen />}
        {activeTab === 'Community' && <CommunityScreen />}
        {activeTab === 'LovedOnes' && <LovedOnesScreen />}
      </View>

      {/* 2. Custom Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Talk')}>
          <Ionicons name={activeTab === 'Talk' ? "mic" : "mic-outline"} size={28} color={activeTab === 'Talk' ? "#4299E1" : "#718096"} />
          <Text style={[styles.navText, { color: activeTab === 'Talk' ? "#4299E1" : "#718096" }]}>Talk</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Community')}>
          <Ionicons name={activeTab === 'Community' ? "people" : "people-outline"} size={28} color={activeTab === 'Community' ? "#4299E1" : "#718096"} />
          <Text style={[styles.navText, { color: activeTab === 'Community' ? "#4299E1" : "#718096" }]}>Community</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('LovedOnes')}>
          <Ionicons name={activeTab === 'LovedOnes' ? "heart" : "heart-outline"} size={28} color={activeTab === 'LovedOnes' ? "#4299E1" : "#718096"} />
          <Text style={[styles.navText, { color: activeTab === 'LovedOnes' ? "#4299E1" : "#718096" }]}>Loved Ones</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#161C24' },
  screenContainer: { flex: 1 },
  navBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    backgroundColor: '#1A202C', 
    paddingVertical: 12, 
    borderTopWidth: 1, 
    borderTopColor: '#2D3748' 
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 12, marginTop: 4, fontWeight: '500' }
});