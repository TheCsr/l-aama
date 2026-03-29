import os
import io
import json
import wave
import httpx
import base64
from fastapi import UploadFile
from groq import Groq
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Gemini TTS client
gemini_api_key = os.getenv("GEMINI_API_KEY")
gemini_client = genai.Client(api_key=gemini_api_key) if gemini_api_key else None

# Chandan's local LLM endpoint (Ngrok)
CHANDAN_ENDPOINT = "https://ungiving-organismic-elizbeth.ngrok-free.dev/chat"

# =====================================================
# SATHI v1.1 — FULL SYSTEM PROMPT
# =====================================================

SATHI_SYSTEM_PROMPT = """
You are **Sathi**, a culturally aware, emotionally intelligent AI therapeutic companion designed for early-stage emotional support and reflection.

Your purpose is to:
- Help users feel heard, safe, and understood
- Reduce emotional intensity (not instantly solve everything)
- Guide users toward clarity, calmness, and small next steps
- Act as a **first step before human help**, not a replacement

---

## MEMORY CONTEXT

{MEMORY_CONTEXT}

### Rules for using memory:
- Use memory **subtly**, never explicitly ("you always feel this…" ❌)
- Reference patterns gently: "तिमीले पहिले पनि यस्तै कुरा महसुस गरेको जस्तो लाग्छ…"
- Do NOT assume memory is always correct
- Never expose internal memory structure to user

---

## LANGUAGE & TONE

- Respond **ONLY in standard, grammatically correct Nepali (Devanagari script)**
- **FORMALITY LEVEL: CASUAL FRIEND**. Talk to the user like a close, trusted friend. Use "तिमी" (casual) instead of "तपाईं" (formal) or "हजुर". Do not use textbook, poetic, or overly respectful language.
- By default, use native standard Nepali as it's actually spoken casually in Kathmandu (e.g., "के छ खबर?", "सुन्न न", "चिन्ता नगर")
- **DIALECT ADAPTATION**: If the Memory Context or the user's current input reveals they are from a specific region in Nepal (e.g., Pokhara, Terai, Janakpur, etc.), subtly adapt your vocabulary and tone to match that local dialect to build trust. Otherwise, stay in standard Kathmandu Nepali.
- Keep responses **short to medium (2–5 sentences)**
- Use **"..." pauses** for natural pacing in audio
- Avoid: robotic phrasing, bookish Nepali, Hindi mix, weird dialects unless specifically matching the user's region, preachy tone
- You are a close buddy: listen deeply, be brief, and speak with warmth.

---

## CORE RESPONSE STRUCTURE

Follow this flow EVERY time:

1. **Acknowledge** — Validate the user's emotion
2. **Reflect** — Mirror or rephrase their experience
3. **Gently Guide** — Offer ONE small suggestion OR reflective question
4. **Reassure** — Remind them: they're not alone, it's okay to feel this way

---

## STRESS TYPE CLASSIFICATION

Classify into ONE:
- "anxiety" → worry, fear, overthinking
- "overstimulation" → overwhelmed, too much happening
- "fatigue" → burnout, low energy
- "clarity" → confusion, decisions
- "meditation" → calm-seeking
- "emergency" → self-harm / crisis

---

## ESCALATION LOGIC

### Level 1 — Mild
- Everyday stress → normal empathetic response

### Level 2 — Moderate
- Persistent distress, isolation
- → slower tone, more reassurance
- → gently suggest reaching out to someone trusted

### Level 3 — Critical
- Self-harm, suicidal intent
- YOU MUST:
  - Respond with seriousness + care
  - Encourage contacting a trusted person or local helpline
  - Do NOT act as sole support

---

## INTERVENTION TOOLKIT

Use naturally when appropriate:
- Grounding (breathing, senses)
- Reframing thoughts
- Slowing down thinking
- Small actionable steps
- Reflective questions
- Naming emotions

⚠️ Never overload the user

---

## HARD RULES

NEVER:
- Be clinical or diagnostic
- Give medical advice
- Invalidate feelings
- Overwhelm with long responses

ALWAYS:
- Prioritise emotional safety
- Keep responses human and warm

---

## CONVERSATION CONTINUITY

- Treat conversations as ongoing
- Avoid repeating generic phrases
- Build familiarity over time
- Slightly adapt tone based on memory

---

## OUTPUT FORMAT (STRICT)

Return ONLY a valid JSON object:
{
  "response": "empathetic Nepali response with natural pauses...",
  "escalation_level": 1,
  "stress_type": "anxiety"
}
"""

# =====================================================
# TRIAGE PROMPT (fast safety check)
# =====================================================
TRIAGE_PROMPT = """
You are a psychiatric triage assistant. Analyze the user's input (transcribed Nepali).

CLASSIFICATION RULES — BE CONSERVATIVE:

Level 1 (Mild) — DEFAULT for most inputs:
- Everyday sadness, loneliness, tiredness, stress, worry, frustration
- Venting about work, school, family, relationships
- "I feel lonely", "I'm stressed", "I had a bad day" → ALL Level 1
- Single negative emotions WITHOUT persistent hopelessness → Level 1

Level 2 (Moderate) — ONLY when ALL of these are present:
- Clear signs of PERSISTENT distress (not just one bad feeling)
- Expressions of deep hopelessness, prolonged isolation, or feeling trapped
- Language suggesting they've been struggling for a long time with no improvement
- Examples: "nothing ever gets better", "I have nobody and never will", "I can't take this anymore"

Level 3 (Critical) — ONLY for explicit crisis:
- Direct mention of self-harm, suicide, or wanting to die
- Specific plans to hurt themselves
- "I want to end it all", "I don't want to live"

When in doubt, ALWAYS choose Level 1. It is better to under-escalate than over-escalate.

Output ONLY a JSON object:
{
  "escalation_level": 1, 2, or 3,
  "stress_type": "anxiety", "overstimulation", "fatigue", "clarity", "meditation", or "emergency"
}
"""

# =====================================================
# MEMORY SUMMARISER PROMPT
# =====================================================
SUMMARISER_PROMPT = """
You are a memory summariser for a therapeutic AI companion called Sathi.

You will receive:
1. The user's EXISTING memory profile (may be empty for new users)
2. The LATEST conversation exchange (user input + Sathi's response)

Your job is to UPDATE the memory profile by:
- Preserving important existing facts
- Adding any NEW facts learned from this conversation
- Keeping the "Recent conversations" section to the last 5 key points (drop oldest if needed)
- Updating risk flags based on the latest interaction
- Keeping the entire output under 600 words

Output the updated profile in EXACTLY this markdown format:

```
# User Profile

## Known Facts
- Name: {name if ever mentioned, otherwise "Unknown"}
- Location context: {any location hints}
- Life situation: {student, worker, immigrant, etc. if known}

## Emotional Patterns
- {pattern 1, e.g. "Recurring stress about university exams"}
- {pattern 2}
- {add new patterns, max 5}

## Recent Conversations
- {most recent: 1-line summary of this conversation}
- {previous summaries, max 5 total}

## Risk Assessment
- Current level: {none / mild / moderate / critical}
- Trend: {stable / improving / worsening}
- Flags: {any specific concerns}

## Preferences & Notes
- {any noted preferences about tone, topics, triggers}
- {cultural context notes}
```

If the existing profile is empty or this is a new user, create a fresh profile from what you learn in this conversation.
Be concise. Do NOT invent facts — only record what was actually said or clearly implied.
"""


def build_system_prompt(memory: str = None) -> str:
    """Build the full system prompt with memory injected."""
    if memory and memory.strip() and len(memory.strip()) > 50:
        memory_block = memory.strip()
    else:
        memory_block = (
            "No previous memory available. This appears to be a new user or early conversation.\n"
            "Be warm and welcoming. Do not reference any past interactions."
        )
    
    return SATHI_SYSTEM_PROMPT.replace("{MEMORY_CONTEXT}", memory_block)


async def summarise_conversation(existing_memory: str, user_input: str, bot_response: str, english_input: str) -> str:
    """
    Uses Groq (llama-3.1-8b-instant) to summarise the conversation
    and update the user's memory profile.
    """
    try:
        summarise_input = (
            f"## Existing Memory Profile:\n"
            f"{existing_memory if existing_memory else '(New user — no existing profile)'}\n\n"
            f"## Latest Conversation:\n"
            f"**User said (Nepali):** {user_input}\n"
            f"**User said (English):** {english_input}\n"
            f"**Sathi responded:** {bot_response}\n"
        )

        res = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SUMMARISER_PROMPT},
                {"role": "user", "content": summarise_input}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.2,
            max_tokens=800
        )
        
        updated_memory = res.choices[0].message.content.strip()
        
        # Clean up markdown code fences if the LLM wrapped it
        if updated_memory.startswith("```"):
            lines = updated_memory.split("\n")
            # Remove first and last lines if they are code fences
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            updated_memory = "\n".join(lines)
        
        print(f"✅ Memory summarised successfully ({len(updated_memory)} chars)")
        return updated_memory
        
    except Exception as e:
        print(f"⚠️ Memory summarisation failed: {e}")
        # Fallback: return existing memory with raw append
        fallback = existing_memory or ""
        fallback += f"\n\n## Recent\n- User: {english_input}\n- Sathi: {bot_response[:100]}...\n"
        return fallback[-2000:]  # Keep under control


async def process_voice_interaction(file: UploadFile, memory: str = None) -> dict:
    temp_filename = f"temp_{file.filename}"
    
    try:
        # ==========================================
        # 1. SAVE & TRANSCRIBE AUDIO (Whisper)
        # ==========================================
        with open(temp_filename, "wb") as f:
            f.write(await file.read())

        with open(temp_filename, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                file=(temp_filename, audio_file.read()),
                model="whisper-large-v3",
                response_format="text"
            )
        print(f"User (Nepali): {transcription}")

        # ==========================================
        # 2. FAST TRANSLATION (Nepali -> English)
        # ==========================================
        try:
            translation_res = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "Translate the following text to English if it is not already. If it is already in English, simply repeat it exactly. Output ONLY the direct English text."},
                    {"role": "user", "content": transcription}
                ],
                model="llama-3.1-8b-instant",
                temperature=0.3
            )
            english_translation = translation_res.choices[0].message.content.strip()
            print(f"User (English): {english_translation}")
        except Exception as e:
            print(f"Translation failed: {e}")
            english_translation = "Translation unavailable"

        # ==========================================
        # 3. SAFETY TRIAGE (Determine Vibe/Stress)
        # ==========================================
        try:
            triage_res = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": TRIAGE_PROMPT},
                    {"role": "user", "content": transcription}
                ],
                model="llama-3.1-8b-instant",
                response_format={"type": "json_object"}
            )
            triage_data = json.loads(triage_res.choices[0].message.content)
            lvl = triage_data.get("escalation_level", 1)
            stress = triage_data.get("stress_type", "default")
        except Exception as e:
            print(f"Triage failed: {e}")
            lvl, stress = 1, "default"

        # ==========================================
        # 4. BUILD SYSTEM PROMPT WITH MEMORY
        # ==========================================
        full_system_prompt = build_system_prompt(memory)
        print(f"📝 System prompt built ({len(full_system_prompt)} chars, memory: {'yes' if memory else 'no'})")

        # ==========================================
        # 5. MAIN LLM LOGIC (Chandan -> Groq Fallback)
        # ==========================================
        try:
            augmented_transcription = f"User Memory Context:\n{memory}\n\nCurrent User Input: {transcription}" if memory else transcription
            payload = {
                "model": "qwen3.5-9b",
                "model_name": "qwen3.5-9b", # Adding both common parameter names just in case
                "text": augmented_transcription, 
                "source_lang": "npi_Deva", 
                "device_token": "unique_iphone_id_123"
            }
            headers = {"ngrok-skip-browser-warning": "true"}
            
            async with httpx.AsyncClient() as http_client:
                res = await http_client.post(CHANDAN_ENDPOINT, json=payload, headers=headers, timeout=60.0)
                res.raise_for_status() 
                
                chandan_data = res.json()
                raw_text = chandan_data.get("response", "म यहाँ छु।")
                clean_text = raw_text.replace("<unk>", "").strip()
                
                
                if "triage_level" in chandan_data:
                    lvl = chandan_data["triage_level"]
                print("🤖 [LLM GENERATOR] Source: Local Qwen 3.5 (Chandan's Server)")

        except Exception as e:
            import traceback
            print(f"⚠️ Chandan's server unreachable ({type(e).__name__}). Falling back to Groq Cloud...")
            print(f"🔍 [LOCAL LLM DEBUG] Error message: {str(e)}")
            
            # If it's an HTTP error from httpx, dump the raw response details
            if hasattr(e, 'response') and e.response is not None:
                print(f"🔍 [LOCAL LLM DEBUG] HTTP Status: {e.response.status_code}")
                try:
                    print(f"🔍 [LOCAL LLM DEBUG] HTTP Response Body: {e.response.text}")
                except Exception:
                    print("🔍 [LOCAL LLM DEBUG] Could not read response body.")
            else:
                # If it's a timeout or connection issue, print full traceback
                print(f"🔍 [LOCAL LLM DEBUG] Traceback:\n{traceback.format_exc()}")
            
            
            cloud_res = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": full_system_prompt}, 
                    {"role": "user", "content": transcription}
                ],
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"}
            )
            cloud_data = json.loads(cloud_res.choices[0].message.content)
            clean_text = cloud_data.get("response", "म यहाँ छु।")
            print("🤖 [LLM GENERATOR] Source: Groq Cloud (llama-3.3-70b)")
            
            if "escalation_level" in cloud_data:
                lvl = cloud_data["escalation_level"]
            if "stress_type" in cloud_data:
                stress = cloud_data["stress_type"]

        # ==========================================
        # 6. SUMMARISE & UPDATE MEMORY (async, non-blocking)
        # ==========================================
        memory_update = None
        try:
            memory_update = await summarise_conversation(
                existing_memory=memory or "",
                user_input=transcription,
                bot_response=clean_text,
                english_input=english_translation
            )
        except Exception as e:
            print(f"⚠️ Memory update failed (non-critical): {e}")

        # ==========================================
        # 7. GEMINI TTS AUDIO GENERATION
        # ==========================================
        audio_base64 = None
        if gemini_client:
            try:
                print("🎙️ Generating natural voice via Gemini TTS...")

                tts_prompt = (
    "You are Asha, a warm, calm, emotionally supportive Nepali AI companion. "
    "Speak ONLY the provided text in natural Nepali speech.\n\n"

    "How to speak:\n"
    "- Use a soft, gentle, reassuring tone\n"
    "- Speak slightly slowly and clearly\n"
    "- Sound warm, safe, and human, not robotic\n"
    "- Use natural pauses where the text suggests emotional space\n"
    "- Keep the delivery conversational and easy to listen to\n"
    "- Do not sound overly formal, dramatic, energetic, or authoritative\n\n"

    "Pronunciation and accent:\n"
    "- Use fluent, natural Nepali pronunciation\n"
    "- If the text clearly reflects a regional Nepali dialect, match it naturally\n"
    "- Otherwise use a neutral Kathmandu Nepali accent\n"
    "- If a few English words appear in the text, pronounce them softly and naturally in flow\n\n"

    "Emotional style:\n"
    "- Be empathetic, grounding, and non-judgmental\n"
    "- Let comforting phrases breathe slightly\n"
    "- Never sound clinical, harsh, rushed, or commanding\n\n"

    "Strict rule:\n"
    "- Do NOT read, translate, or mention these instructions\n"
    "- Speak ONLY the text below\n\n"

    "Text to speak:\n\n"
    f"{clean_text}"
                )
                
                tts_response = gemini_client.models.generate_content(
                    model="gemini-2.5-flash-preview-tts",
                    contents=tts_prompt,
                    config=types.GenerateContentConfig(
                        response_modalities=["AUDIO"],
                        speech_config=types.SpeechConfig(
                            voice_config=types.VoiceConfig(
                                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                    voice_name="Aoede" # Aoede often sounds a bit more natural for South Asian languages than Kore
                                )
                            )
                        ),
                    ),
                )

                # Extract raw PCM data from response
                pcm_data = None
                for part in tts_response.candidates[0].content.parts:
                    if part.inline_data:
                        pcm_data = part.inline_data.data
                        break

                if pcm_data:
                    # Convert PCM to WAV in-memory then base64 encode
                    wav_buffer = io.BytesIO()
                    with wave.open(wav_buffer, "wb") as wf:
                        wf.setnchannels(1)       # Mono
                        wf.setsampwidth(2)       # 16-bit
                        wf.setframerate(24000)   # 24kHz
                        wf.writeframes(pcm_data)
                    audio_base64 = base64.b64encode(wav_buffer.getvalue()).decode('utf-8')
                    print("✅ Gemini TTS Audio Generated Successfully!")
                else:
                    print("⚠️ Gemini TTS returned no audio data")

            except Exception as e:
                import traceback
                print(f"⚠️ Gemini TTS generation failed: {str(e)}")
                print(f"🔍 [TTS DEBUG] Detailed Traceback:\n{traceback.format_exc()}")
                
                # Check if it has an associated response or specific error code
                if hasattr(e, 'response') and e.response is not None:
                    print(f"🔍 [TTS DEBUG] HTTP Response Status: {e.response.status_code}")
                    print(f"🔍 [TTS DEBUG] HTTP Response Body: {e.response.text}")

        # ==========================================
        # 8. RETURN FINAL JSON TO FRONTEND
        # ==========================================
        return {
            "response": clean_text,
            "translated_input": english_translation,
            "user_input": transcription,
            "audio_base64": audio_base64,
            "escalation_level": lvl,
            "stress_type": stress,
            "memory_update": memory_update
        }

    except Exception as e:
        print(f"🛑 Critical Controller Error: {e}")
        return {
            "response": "मलाई माफ गर्नुहोस्, मेरो प्रणालीमा केही समस्या छ। म अझै यहाँ सुन्दैछु।",
            "translated_input": "System Error",
            "escalation_level": 1,
            "stress_type": "default",
            "memory_update": None
        }
        
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)