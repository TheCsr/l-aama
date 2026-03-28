# Asha Design Specification

## 1. Product Intent

Asha is a privacy-first emotional support app designed to reduce **time to value** as much as possible.

The app should open **directly to Home** with no blocking onboarding flow, no sign-up wall, and no long setup. The first thing the user sees must be a warm, safe, calming screen with a large central microphone action so they can talk to Asha immediately.

Core UX principle:

> Open app -> feel safe -> tap mic -> speak immediately.

This product is **not** a clinical mental health app, not a chatbot dashboard, and not a social media product. It should feel like a calm private companion.

---

## 2. Mascot Direction

Reference mascot: attached red panda wearing a Nepali topi.

### What the mascot communicates
- warmth
- softness
- emotional safety
- cultural distinctiveness
- friendliness without childishness
- quiet companionship

### Visual cues from the mascot
- warm terracotta / coral-orange fur
- cream facial accents
- deep brown eyes and nose
- thin dark outlines
- rounded proportions
- simple, cute, vector-friendly silhouette
- Nepali topi pattern as a unique cultural accent

### How to use the mascot in UI
Use the mascot as a **subtle emotional companion**, not as a loud cartoon.

Recommended uses:
- small floating companion near the mic hero on Home
- softly integrated into the mic aura or breathing glow
- tiny illustrated moments on empty states
- calm reactive animation during listening state
- subtle support presence on Communities pages

Avoid:
- full mascot on every page header
- oversized cartoon treatment on serious/urgent screens
- making the product feel aimed at children
- overusing the topi pattern in a noisy way

### Mascot behavior by page
- **Home:** visible, warm, lightly animated, close to mic
- **Listening state:** slightly more alive; breathing, pulsing, attentive
- **Communities:** subtle, supportive accent only
- **Support:** more restrained; focus on trust and clarity
- **Urgent support:** mascot should be minimal or absent so the screen remains serious

---

## 3. Design Principles

1. **Immediate use**  
   The interface should remove hesitation and let the user start speaking right away.

2. **Emotional safety**  
   Every page should feel soft, grounded, and non-judgmental.

3. **Privacy by design**  
   Privacy cues should be present, but not intrusive.

4. **Low cognitive load**  
   The user may be stressed or overwhelmed; layouts must be simple and clear.

5. **Warm premium dark mode**  
   The app should feel safe at night, modern, and high quality.

6. **AI-first, human-aware**  
   The voice interaction is central, while communities and support are clear secondary pathways.

---

## 4. Information Architecture

Main navigation should be only 3 tabs:

- **Home**
- **Communities**
- **Support**

Secondary surfaces:
- Calm Audio sheet
- Privacy & Preferences sheet
- Session Summary sheet/card
- Urgent Support sheet
- Community post composer
- Mic permission prompt flow

### Routing
- App launch -> `Home`
- No forced onboarding
- Silent/background account/session creation handled internally
- Request microphone permission only when user taps the mic for the first time

---

## 5. Visual System

### 5.1 Overall Style
Style keywords:
- warm
- private
- safe
- dark-mode
- soft glow
- premium
- rounded
- calm
- minimal
- non-clinical

This should feel closer to a high-end wellness companion than a dashboard.

### 5.2 Core Color Palette
Palette should harmonize with the mascot while remaining mature.

#### Primary warm accents (mascot-inspired)
- `Mascot Peach` `#D78772`
- `Mascot Coral` `#C66E55`
- `Mascot Clay` `#9B5B4F`
- `Mascot Cocoa` `#7A4840`
- `Mascot Deep Cocoa` `#462A26`
- `Mascot Cream` `#E2DAD7`

#### App neutrals
- `Background / Deep Night` `#14121A`
- `Surface / Elevated` `#1D1A24`
- `Surface Soft` `#262231`
- `Divider Soft` `rgba(255,255,255,0.08)`
- `Text Primary` `#F6F1EE`
- `Text Secondary` `#C8BCC0`
- `Text Tertiary` `#9A8E96`

#### Supporting glows
- `Warm Glow` `rgba(215,135,114,0.28)`
- `Cream Glow` `rgba(226,218,215,0.15)`
- `Soft Plum Glow` `rgba(123,95,140,0.16)`

#### Semantic colors
Keep these muted.
- `Success Soft` `#6E9F7A`
- `Warning Soft` `#C79863`
- `Urgent Soft` `#B86A6A`

### 5.3 Gradients
Use gradients sparingly and softly.

Recommended backgrounds:
- `linear-gradient(180deg, #1A1722 0%, #14121A 100%)`
- `radial-gradient(circle at center, rgba(215,135,114,0.18) 0%, rgba(215,135,114,0) 55%)`
- `radial-gradient(circle at 50% 36%, rgba(226,218,215,0.08) 0%, rgba(0,0,0,0) 60%)`

### 5.4 Typography
Use a rounded or humanist sans-serif with strong legibility.

Recommended feel:
- soft geometric sans
- slightly rounded terminals
- modern but not corporate

Suggested scale:
- Display / hero: 30-34 semibold
- Page titles: 22-26 semibold
- Section titles: 16-18 semibold
- Body: 15-16 regular
- Secondary body: 13-14 regular
- Microcopy / privacy pills: 11-12 medium

Text should never feel dense or clinical.

### 5.5 Corner Radius
- Large hero elements: 28-32
- Cards: 22-26
- Pills/chips: 9999
- Bottom sheets: 28 top corners
- Inputs: 18-22

### 5.6 Shadows and Glow
Use soft depth instead of harsh shadows.

Examples:
- Card shadow: `0 10px 30px rgba(0,0,0,0.22)`
- Mic glow: outer glow with warm coral, blurred heavily
- No hard black drop shadows

### 5.7 Illustration Style
Any illustrations should match the mascot style:
- soft vector
- rounded outlines
- low detail
- calm expressions
- warm palette

---

## 6. Layout System

### Safe spacing rules
- Outer screen padding: 20-24
- Major vertical section spacing: 20-28
- Card internal padding: 16-20
- Chip spacing: 8-10
- Bottom nav height: 72-84

### Screen density rule
Never let the screen feel busy. Prefer fewer, larger elements.

### Hierarchy rule
On every page, there should be exactly one obvious primary action.

---

## 7. Core Components

### 7.1 Hero Mic Button
This is the most important component in the whole app.

#### Visual spec
- centered on Home
- circular or slightly organic orb form
- 120-160 px visual diameter depending on device
- layered glow ring behind it
- soft warm gradient fill
- microphone glyph/icon centered
- subtle mascot integration nearby or within aura
- should feel tactile and comforting

#### States
- idle
- pressed
- listening
- processing
- follow-up ready

#### Idle behavior
- slow breathing glow
- no aggressive pulsing
- may have tiny mascot breathing animation nearby

#### Listening behavior
- waveform halo animates around mic
- glow intensifies slightly
- center remains readable
- transcription appears below

### 7.2 Privacy Pill
Small pill near top:
- “Private by default”
- “Private space”
- “In your control”

Style:
- translucent surface
- cream text
- tiny lock icon optional

### 7.3 Secondary Action Card
Used for Calm Audio, Communities, Support shortcuts.

Style:
- warm dark elevated card
- rounded corners
- icon + label + optional subtext
- feels soft and tap-friendly

### 7.4 Tag Pills
Used for themes such as Burnout, Loneliness, Family Pressure.

Style:
- muted filled pill
- no bright saturation
- warm neutral text

### 7.5 Session Summary Card
- soft elevated card
- title: “What I’m noticing” or similar
- clearly framed as reflection, not diagnosis

### 7.6 Bottom Sheet
Use for:
- Calm Audio
- Privacy settings
- urgent support nudges
- quick support actions

Style:
- large radius
- dark elevated surface
- blurred backdrop
- clean handle

---

## 8. Motion and Interaction

### Motion tone
Motion should feel:
- calm
- breathable
- reassuring
- slow to medium pace

Avoid snappy or flashy motion.

### Recommended animations
- mic breathing glow: 2.4-3.2 sec cycle
- subtle floating mascot: 4-6 sec cycle
- listening waveform: reactive but smooth
- bottom sheet: soft spring, not bouncy
- tab transitions: subtle fade/slide

### Haptics
Use minimal haptic feedback for:
- mic tap
- starting/stopping recording
- successful action on Support page

---

## 9. Page Specifications

## 9.1 Home — Idle State

### Purpose
Immediate entry point. User should be able to speak to Asha instantly.

### Layout
**Top area**
- Asha wordmark/logo aligned center or slightly left
- top-right small icon for privacy/settings/profile
- small privacy pill under or near header: `Private by default`

**Middle hero area**
- main focal point: large centered mic button
- subtle mascot presence integrated around hero
- helper text under mic: `Tap to talk`
- secondary line: `Say as much or as little as you want`

**Secondary support area**
- Calm Audio card/button
  - title: `Calming audio`
  - subtext: `Take a quiet moment first`

**Quick pathways**
Two cards below, horizontally or vertically stacked depending on space:
- `Communities`
- `Support`

**Bottom nav**
- Home active
- Communities
- Support

### Visual priority
1. Mic
2. Helper text
3. Calm Audio
4. Communities / Support shortcuts

### Notes
- Do not clutter Home with lists, feed content, or too much copy.
- Home should feel like a landing space, not a dashboard.

---

## 9.2 Home — Listening State

### Purpose
User tapped mic and is speaking.

### Layout changes
- header remains minimal
- privacy microcopy changes to `Listening privately`
- mic transforms into active listening state with waveform ring
- live transcript card appears below mic
- supportive AI line below transcript: `Take your time, I’m here with you`
- controls at bottom of central block:
  - Pause
  - Finish
  - Type instead

### Visual behavior
- slightly brighter glow
- mascot feels attentive but subtle
- background can dim slightly to focus attention

### Notes
- This must not look like a generic voice assistant.
- It should feel emotionally held, not merely recorded.

---

## 9.3 Home — Post-response / Reflection State

### Purpose
After voice input, show immediate soft reflection while keeping voice conversation central.

### Layout
- mic still visible and tappable
- summary card appears below

Card content example:
- title: `What I’m noticing`
- body: `It sounds like you may be carrying a mix of pressure, exhaustion, and guilt around slowing down.`
- tags: `Burnout`, `Pressure`, `Low energy`

Actions below card:
- `Keep talking`
- `See similar stories`
- `Find support`

### Notes
- Never label this as diagnosis.
- Reflection should feel soft and human.

---

## 9.4 Calm Audio Sheet

### Purpose
Offer a lightweight calming mode without pulling the user away from Asha.

### Presentation
Bottom sheet from Home.

### Content
- title: `Calming audio`
- subtitle: `Take a moment to slow down`
- large play/pause control
- subtle waveform or breathing circle
- track name: `432 Hz calming tone`
- timer chips: `2 min`, `5 min`, `10 min`
- optional action: `Play while I reflect`

### Notes
- Treat this as a calming ritual feature, not a music player.
- Keep it minimal and visually grounded.

---

## 9.5 Communities — Browse

### Purpose
Allow users to explore similar stories and topic-based support spaces without social media chaos.

### Layout
**Header**
- title: `Communities`
- subtext: `Connect with people who may understand what you’re carrying`

**Search / browse row**
- soft search field: `Search stories or topics`

**Topic chips**
- Burnout
- Family pressure
- Loneliness
- Academic stress
- Work stress
- Feeling behind
- Moving away

**Section 1: Similar stories**
- horizontal or stacked story cards
- anonymous format
- short reflective excerpts

**Section 2: Support spaces**
- rounded community cards with title + one-line summary
- indicate `Anonymous` and `Moderated`

### Notes
- Users should be able to browse without posting.
- Keep the page calm and curated.

---

## 9.6 Community Detail

### Purpose
Topic-specific safe discussion area.

### Layout
- back button
- topic title, e.g. `Burnout & exhaustion`
- one-line description
- trust pills: `Anonymous`, `Moderated`
- segmented tabs:
  - Discussions
  - Similar stories
  - Private questions

**Discussion cards**
- anonymous user marker
- short title/snippet
- calm spacing

**Primary action**
- floating button or sticky bottom button: `Post anonymously`

### Notes
- Reduce visual density.
- No visible vanity metrics like follower counts.
- Reactions should be soft/supportive, not social-media-like.

---

## 9.7 Support — Browse

### Purpose
Bridge users from AI support to trusted human support.

### Layout
**Header**
- title: `Support`
- subtext: `Trusted people and organisations when you want more than AI support`

**Category chips**
- Volunteers
- Counsellors
- NGOs
- Helplines
- Student support
- Community organisations

**Support cards**
Each card contains:
- support name
- one-line description
- what they help with
- `View` or `Contact` action

**Urgent support section**
- visually more prominent but not alarming
- title: `Need urgent help?`
- body: calm explanation
- action: `See urgent options`

### Notes
- This page should feel credible and calm.
- Do not make the whole page look like an emergency screen.

---

## 9.8 Support Detail

### Purpose
Make real support options feel approachable and easy to act on.

### Layout
- provider title
- short reassuring intro
- sections/cards:
  - What they help with
  - Best for
  - Access type
  - Availability

**Actions**
- `Contact now`
- `Save for later`

**Footer note**
- `It’s okay if you’re not ready yet`

### Notes
- Reduce decision friction.
- Clear information, soft presentation.

---

## 9.9 Privacy & Preferences Sheet

### Purpose
Expose privacy controls without interrupting first use.

### Presentation
Modal sheet from Home/settings.

### Content
- title: `Privacy & preferences`
- intro: `Asha is designed to feel private, safe, and in your control`
- settings list:
  - Save conversation memory
  - Enable check-ins
  - Manage microphone access
  - Delete conversation history
  - Support preferences

### Notes
- Do not overload with legal copy.
- Use concise trust-building language.

---

## 9.10 Urgent Support Sheet

### Purpose
Used when the system detects elevated risk.

### Tone
Calm, serious, direct.

### Layout
- title: `You deserve immediate human support right now`
- short serious explanation
- actions:
  - `Call emergency services`
  - `Contact a crisis helpline`
  - `Message someone I trust`
  - `View urgent support options`

### Notes
- Mascot should be minimal or absent here.
- Reduce decorative elements.
- Keep readability and urgency clear.

---

## 10. Copy Tone Guidelines

All copy should feel:
- warm
- plain-spoken
- non-clinical
- gently supportive
- emotionally intelligent
- short

### Good examples
- `Tap to talk`
- `Take your time`
- `Say as much or as little as you want`
- `Private by default`
- `You can start anywhere`
- `It’s okay if you’re not ready yet`

### Avoid
- therapy jargon
- diagnosis language
- robotic AI phrases
- startup/productivity copy
- overexplaining

---

## 11. Accessibility Requirements

- minimum contrast ratios for text on dark backgrounds
- all tap targets at least 44x44
- support Dynamic Type / text scaling
- captions/transcript visible during voice flows
- screen-reader labels for all primary actions
- do not rely only on color for urgency or states
- animated effects must remain subtle and non-disorienting

---

## 12. Technical Implementation Notes

### First launch behavior
- launch directly into Home
- background auth/session creation should happen silently
- no loading screen longer than necessary
- if data is not ready yet, the Home page should still render immediately

### Microphone permission flow
- ask only on first mic tap
- if denied, show supportive fallback sheet:
  - explain why mic helps
  - offer `Type instead`
  - offer `Open settings`

### Home performance
- mic hero and glow animation must stay smooth
- optimize mascot asset for multiple resolutions
- avoid heavy visual effects that cause frame drops

### State persistence
- last transcript / recent reflection can be cached lightly
- calm audio timer state can persist while app remains active

---

## 13. What Success Looks Like

A correct implementation should make a first-time user feel this sequence within seconds:

1. `This feels safe.`
2. `I know exactly what to do.`
3. `I can talk immediately.`
4. `This feels private and warm.`
5. `If I do not want to talk, there are still gentle next steps.`

If the app feels cluttered, clinical, childish, or generic like a voice assistant, the design has missed the mark.

---

## 14. Summary for the Developer

Build Asha as a **warm, premium, privacy-first emotional support app** centered around an instantly accessible voice interaction.

The app should:
- open directly to Home
- present a large central mic immediately
- use the red panda mascot as a subtle emotional companion
- harmonize the UI with warm terracotta, cream, cocoa, and deep night tones
- keep Communities and Support simple and secondary
- use calm motion, rounded forms, and minimal copy
- prioritize emotional safety and low friction over feature density

The Home screen is the heart of the product. Get that right first.
