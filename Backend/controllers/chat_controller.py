import os
import json
import httpx
import base64
from fastapi import UploadFile
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
elevenlabs_key = os.getenv("ELEVENLABS_API_KEY")

# Chandan's local LLM endpoint (Ngrok)
CHANDAN_ENDPOINT = "https://ungiving-organismic-elizbeth.ngrok-free.dev/chat"

# --- PROMPTS ---
TRIAGE_PROMPT = """
You are a psychiatric triage assistant. Analyze the user's input (transcribed Nepali).
Output ONLY a JSON object with these keys:
{
  "escalation_level": 1, 2, or 3,
  "stress_type": "anxiety", "overstimulation", "fatigue", "clarity", "meditation", or "emergency"
}
"""

SYSTEM_PROMPT = """
You are Sathi, an empathetic AI therapeutic companion. 
Respond EXCLUSIVELY in the Nepali language (Devanagari script).
Keep responses concise and empathetic. Use ellipses (...) to create natural, thoughtful pauses in the audio.
Output ONLY a JSON object:
{
  "response": "Your empathetic spoken response in Nepali",
  "escalation_level": 1, 2, or 3,
  "stress_type": "anxiety", "overstimulation", "fatigue", "clarity", "meditation", or "emergency"
}
"""

async def process_voice_interaction(file: UploadFile) -> dict:
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
                    {"role": "system", "content": "Translate the following Nepali text to English. Output ONLY the direct English translation."},
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
        # 4. MAIN LLM LOGIC (Chandan -> Groq Fallback)
        # ==========================================
        try:
            payload = {
                "text": transcription, 
                "source_lang": "npi_Deva", 
                "device_token": "unique_iphone_id_123"
            }
            headers = {"ngrok-skip-browser-warning": "true"}
            
            async with httpx.AsyncClient() as http_client:
                res = await http_client.post(CHANDAN_ENDPOINT, json=payload, headers=headers, timeout=12.0)
                res.raise_for_status() 
                
                chandan_data = res.json()
                raw_text = chandan_data.get("response", "म यहाँ छु।")
                clean_text = raw_text.replace("<unk>", "").strip()
                
                if "triage_level" in chandan_data:
                    lvl = chandan_data["triage_level"]

        except Exception as e:
            print(f"⚠️ Chandan's server unreachable ({type(e).__name__}). Falling back to Groq Cloud...")
            
            cloud_res = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT}, 
                    {"role": "user", "content": transcription}
                ],
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"}
            )
            cloud_data = json.loads(cloud_res.choices[0].message.content)
            clean_text = cloud_data.get("response", "म यहाँ छु।")
            
            if "escalation_level" in cloud_data:
                lvl = cloud_data["escalation_level"]
            if "stress_type" in cloud_data:
                stress = cloud_data["stress_type"]

        # ==========================================
        # 5. ELEVENLABS AUDIO GENERATION
        # ==========================================
        audio_base64 = None
        if elevenlabs_key:
            # Voice ID for "Rachel" - a very calm, grounding voice
            voice_id = "21m00Tcm4TlvDq8ikWAM" 
            tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
            
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": elevenlabs_key
            }
            
            payload = {
                "text": clean_text,
                "model_id": "eleven_multilingual_v2", # Enables Nepali
                "voice_settings": {
                    "stability": 0.45,       # Lower = more emotional
                    "similarity_boost": 0.75
                }
            }
            
            try:
                print("Generating soothing voice via ElevenLabs...")
                async with httpx.AsyncClient() as http_client:
                    tts_response = await http_client.post(tts_url, json=payload, headers=headers, timeout=15.0)
                    tts_response.raise_for_status()
                    
                    audio_base64 = base64.b64encode(tts_response.content).decode('utf-8')
                    print("✅ ElevenLabs Audio Generated Successfully!")
            except Exception as e:
                print(f"ElevenLabs generation failed: {e}")

        # ==========================================
        # 6. RETURN FINAL JSON TO FRONTEND
        # ==========================================
        return {
            "response": clean_text,
            "translated_input": english_translation,
            "audio_base64": audio_base64,
            "escalation_level": lvl,
            "stress_type": stress
        }

    except Exception as e:
        print(f"🛑 Critical Controller Error: {e}")
        return {
            "response": "मलाई माफ गर्नुहोस्, मेरो प्रणालीमा केही समस्या छ। म अझै यहाँ सुन्दैछु।",
            "translated_input": "System Error",
            "escalation_level": 1,
            "stress_type": "default"
        }
        
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)