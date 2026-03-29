import os
import json
import httpx
from fastapi import UploadFile
from groq import Groq
from dotenv import load_dotenv

# Load environment variables (Make sure GROQ_API_KEY is in your .env)
load_dotenv()

# Initialize the Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Chandan's local LLM endpoint (Matches his Mac Mini Ngrok tunnel)
CHANDAN_ENDPOINT = "https://ungiving-organismic-elizbeth.ngrok-free.dev/chat"

# 1. Fast Triage Prompt: Determines the 'Vibe' and Safety Level instantly
TRIAGE_PROMPT = """
You are a psychiatric triage assistant. Analyze the user's input (transcribed Nepali).
Output ONLY a JSON object with these keys:
{
  "escalation_level": 0 (stable), 1 (distressed), 2 (crisis/danger), or 3 (emergency)
  "stress_type": "anxiety", "overstimulation", "fatigue", "clarity", "meditation", or "emergency"
}
"""

# 2. Cloud Fallback Prompt: Used if Chandan's Mac Mini is offline
SYSTEM_PROMPT = """
You are Sathi, an empathetic AI therapeutic companion. 
Your goal is to provide a warm, grounding presence.
Respond EXCLUSIVELY in the Nepali language (Devanagari script).
Keep responses concise and empathetic.
Output ONLY a JSON object:
{
  "response": "Your empathetic spoken response in Nepali",
  "escalation_level": 1, 2, or 3,
  "stress_type": "anxiety", "overstimulation", "fatigue", "clarity", "meditation", or "emergency"
}
"""

async def process_voice_interaction(file: UploadFile) -> dict:
    """
    The main pipeline: Audio -> Text -> Translate -> Triage -> Chandan's LLM -> JSON Response
    """
    temp_filename = f"temp_{file.filename}"
    
    try:
        # 1. Save the audio file locally for processing
        with open(temp_filename, "wb") as f:
            f.write(await file.read())

        # 2. Transcription: Turn Nepali audio into Devanagari text using Whisper
        with open(temp_filename, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                file=(temp_filename, audio_file.read()),
                model="whisper-large-v3",
                response_format="text"
            )
        
        print(f"User (Nepali): {transcription}")

        # =====================================================================
        # NEW: Quick Translate API Call (Nepali -> English)
        # Uses your existing Groq setup for a lightning-fast translation
        # =====================================================================
        try:
            translation_res = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "Translate the following Nepali text to English. Output ONLY the direct English translation, nothing else."},
                    {"role": "user", "content": transcription}
                ],
                model="llama-3.1-8b-instant",
                temperature=0.3
            )
            english_translation = translation_res.choices[0].message.content.strip()
            print(f"User (English): {english_translation}")
        except Exception as trans_err:
            print(f"Translation failed: {trans_err}")
            english_translation = "Translation unavailable"
        # =====================================================================

        # 3. Safety Triage: Run a parallel check on Groq for immediate level scoring
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
        except Exception as triage_err:
            print(f"Triage failed, defaulting to Level 1: {triage_err}")
            lvl, stress = 1, "default"

        # 4. Main Request: Hit Chandan's local LLM for the empathetic Nepali response
        try:
            payload = {
                "text": transcription,
                "source_lang": "npi_Deva",
                "device_token": "unique_iphone_id_123"
            }
            
            async with httpx.AsyncClient() as http_client:
                # 12.0s timeout gives the Mac Mini room to generate text
                res = await http_client.post(CHANDAN_ENDPOINT, json=payload, timeout=12.0)
                res.raise_for_status()
                chandan_data = res.json()
            
            # Clean the response text: Remove <unk> tags and trim whitespace
            raw_text = chandan_data.get("response", "म यहाँ छु।")
            clean_text = raw_text.replace("<unk>", "").strip()

            return {
                "response": clean_text,
                "translated_input": english_translation, # Added to output
                "escalation_level": lvl, 
                "stress_type": stress
            }

        except (httpx.RequestError, httpx.HTTPStatusError) as e:
            # 5. FULL FALLBACK: If Chandan's server is down/unreachable
            print(f"Chandan's server unreachable, falling back to Groq Cloud. Error: {e}")
            
            cloud_res = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": transcription}
                ],
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"}
            )
            cloud_data = json.loads(cloud_res.choices[0].message.content)
            cloud_data["translated_input"] = english_translation # Added to fallback output
            return cloud_data

    except Exception as e:
        print(f"Critical Controller Error: {e}")
        return {
            "response": "मलाई माफ गर्नुहोस्, मेरो प्रणालीमा केही समस्या छ। म अझै यहाँ सुन्दैछु।",
            "translated_input": "Error in processing.",
            "escalation_level": 1,
            "stress_type": "default"
        }
        
    finally:
        # 6. Cleanup: Always delete the audio file to prevent disk bloat
        if os.path.exists(temp_filename):
            os.remove(temp_filename)