import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from './src/constants/Theme';

import HomeScreen from './src/screens/HomeScreen';
import CommunitiesScreen from './src/screens/CommunitiesScreen';
import SupportScreen from './src/screens/SupportScreen';

type TabName = 'Home' | 'Communities' | 'Support';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('Home');

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Main Content Area */}
      <View style={styles.screenContainer}>
        {activeTab === 'Home' && <HomeScreen />}
        {activeTab === 'Communities' && <CommunitiesScreen />}
        {activeTab === 'Support' && <SupportScreen />}
      </View>

      {/* 2. Custom Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Home')}>
          <Ionicons name={activeTab === 'Home' ? "home" : "home-outline"} size={28} color={activeTab === 'Home' ? Theme.colors.mascotCoral : Theme.colors.textTertiary} />
          <Text style={[styles.navText, { color: activeTab === 'Home' ? Theme.colors.mascotCoral : Theme.colors.textTertiary }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Communities')}>
          <Ionicons name={activeTab === 'Communities' ? "people" : "people-outline"} size={28} color={activeTab === 'Communities' ? Theme.colors.mascotCoral : Theme.colors.textTertiary} />
          <Text style={[styles.navText, { color: activeTab === 'Communities' ? Theme.colors.mascotCoral : Theme.colors.textTertiary }]}>Communities</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Support')}>
          <Ionicons name={activeTab === 'Support' ? "heart" : "heart-outline"} size={28} color={activeTab === 'Support' ? Theme.colors.mascotCoral : Theme.colors.textTertiary} />
          <Text style={[styles.navText, { color: activeTab === 'Support' ? Theme.colors.mascotCoral : Theme.colors.textTertiary }]}>Support</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  screenContainer: { flex: 1 },
  navBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    backgroundColor: Theme.colors.surface, 
    height: Theme.spacing.bottomNavSize,
    paddingTop: 12,
    borderTopWidth: 1, 
    borderTopColor: Theme.colors.divider 
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, marginTop: 4, fontWeight: '500' }
});