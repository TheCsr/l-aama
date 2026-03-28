# 🐾 Asha — Your Emotional Companion

**Asha** (आशा, meaning *hope* in Nepali) is a warm, non-clinical emotional support app built for people navigating stress, burnout, loneliness, and everyday mental health challenges. Talk to Asha through voice, pet the mascot, browse community forums, or just breathe with a 432 Hz calming tone.

> Built at a hackathon with ❤️ — designed to feel soft, grounded, and non-judgmental.

---

## ✨ Features

### 🎙️ Voice Conversations
- Tap the central mic button to talk to Asha
- Powered by **Groq Whisper** (speech-to-text) and **LLaMA 3.3 70B** (empathetic AI responses)
- Asha responds with a spoken voice reply and a reflection card highlighting what she noticed

### 🐼 Interactive Mascot
- A friendly red panda wearing a traditional **Nepali Dhaka topi** sits atop the mic
- **Tap to pet** — triggers a bounce animation, haptic feedback, and a real cloth-pat sound effect
- The mascot dynamically changes pose based on app state (Idle → Listening → Thinking)

### 🎵 432 Hz Calming Audio
- One-tap access to a continuously looping **432 Hz therapeutic tone**
- Layered with sub-bass octaves for a grounding, singing-bowl-like resonance
- Opens in a slide-up sheet with a breathing ring visualizer

### 💬 Community Forums
- Browse categorized anonymous forums: *Burnout*, *Academic Stress*, *Feeling Lonely*, and more
- See active community counts and live status indicators
- Floating action button to compose new discussion threads

### 🆘 Support Directory (IP Geolocation)
- Automatically detects the user's country to provide localized help
- **22-Country Coverage** including major diaspora destinations (Middle East, USA, UK, Australia, India, Malaysia, Japan, etc.)
- Dynamically shows the local emergency/medical dialing numbers (e.g. 911, 999, 112, 000)
- Curated list of trusted mental health lines mapping to the user's specific region
- **Nepal Embassy Tracker** displays the local embassy/consulate contact and address with one-tap dialing
- Graceful "International Dropback" to the Ministry of Foreign Affairs if the detected country is unmapped
- *Future Goal:* We strongly wish to add direct contacts for local Nepali community centers and diaspora organizations to this database, which is currently deferred due to hackathon time constraints.

### 🔊 Sound Design & Haptics
- Soft tap sounds on every UI interaction
- Real cloth-pat audio when petting the mascot
- Haptic feedback on all buttons, tabs, and interactive elements via `expo-haptics`

---

## 🏗️ Architecture

```
l-aama/
├── Frontend/          # Expo / React Native app
│   ├── App.tsx        # Root navigator with 3-tab layout
│   ├── src/
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx         # Voice, mascot, calming audio
│   │   │   ├── CommunitiesScreen.tsx  # Forum-style community tab
│   │   │   └── SupportScreen.tsx      # Help directory & urgent support
│   │   └── constants/
│   │       └── Theme.ts               # Design tokens (colours, spacing, radii)
│   └── assets/                        # Mascot PNGs, sound effects, icons
│
├── Backend/           # FastAPI server
│   └── main.py        # Voice endpoint (/chat/voice)
│
└── design.md          # Full product & visual design spec
```

---

## 🚀 Setup Instructions

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **npm** | 9+ | Package manager |
| **Expo CLI** | Latest | `npx expo` (no global install needed) |
| **Expo Go** | Latest | Install on your iOS/Android device from the App Store |
| **Python** | 3.10+ | Backend server |
| **Groq API Key** | — | [Get one free at console.groq.com](https://console.groq.com) |

### 1. Clone the repository

```bash
git clone https://github.com/TheCsr/l-aama.git
cd l-aama
```

### 2. Start the Backend

```bash
cd Backend

# Create a virtual environment
python3 -m venv .venv
source .venv/bin/activate      # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirments.txt

# Set your Groq API key
echo "GROQ_API_KEY=your_key_here" > .env

# Run the server
python main.py
```

The API will start on `http://0.0.0.0:8000`. Note your machine's **local IP** (e.g. `192.168.1.69`) — the app needs this to connect.

### 3. Start the Frontend

```bash
cd Frontend

# Install dependencies
npm install

# Start the Expo dev server
npm start
```

Scan the QR code with **Expo Go** on your phone (same Wi-Fi network).

### 4. Connect Frontend → Backend

In `Frontend/src/screens/HomeScreen.tsx`, update the server URL to your machine's local IP:

```typescript
const SERVER_URL = 'http://<YOUR_LOCAL_IP>:8000/chat/voice';
```

---

## 🎨 Design Philosophy

| Principle | Implementation |
|-----------|---------------|
| **Warm, not clinical** | Cream `#FFF7F2` background, terracotta accents, no harsh blues/greys |
| **Low cognitive load** | Single hero action (mic), minimal navigation |
| **Privacy-first** | Privacy pill in header, no accounts required |
| **Culturally grounded** | Red panda mascot with Nepali Dhaka topi |
| **Sensory feedback** | Haptics + audio on every interaction |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Mobile App** | React Native + Expo SDK 54 |
| **Voice AI** | Groq Whisper (STT) + LLaMA 3.3 70B (LLM) |
| **Text-to-Speech** | `expo-speech` (on-device) |
| **Audio Engine** | `expo-av` (recording, playback, looping) |
| **Haptics** | `expo-haptics` |
| **Backend** | FastAPI + Uvicorn |
| **Styling** | React Native StyleSheet with custom design tokens |

---

## 📄 License

MIT
