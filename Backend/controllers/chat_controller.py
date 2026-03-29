import os
import json
import httpx
import base64
from datetime import datetime
from fastapi import UploadFile
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
elevenlabs_key = os.getenv("ELEVENLABS_API_KEY")

# Chandan's local LLM endpoint (Ngrok)
CHANDAN_ENDPOINT = "https://ungiving-organismic-elizbeth.ngrok-free.dev/chat"

# Directory for markdown memory files
MEMORY_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "user_memory")

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

PROFILE_UPDATE_PROMPT = """
You are a profile-builder for a mental health companion app.
Given the current user profile and a new conversation exchange, update the profile.
Extract and retain ONLY important, lasting facts about the user such as:
- Name, age, gender, location
- Occupation, education, living situation
- Family details (married, children, relationships)
- Recurring mental health themes (anxiety, loneliness, grief, etc.)
- Key life events mentioned (migration, job loss, bereavement, etc.)
- Hobbies, coping mechanisms, support systems
- Cultural context

Rules:
- Output ONLY the updated profile in clean markdown (bullet points under headings).
- Merge new info into existing profile — do not duplicate.
- Remove nothing unless contradicted by new info.
- If the exchange reveals nothing new, return the existing profile unchanged.
- Keep it concise.
"""

# --- MARKDOWN MEMORY HELPERS ---

def get_user_dir(device_token: str) -> str:
    """Get or create the user's memory directory."""
    user_dir = os.path.join(MEMORY_DIR, device_token)
    os.makedirs(os.path.join(user_dir, "diary"), exist_ok=True)
    return user_dir

def load_user_profile(device_token: str) -> str:
    """Load the user's profile markdown. Returns empty string if none exists."""
    profile_path = os.path.join(get_user_dir(device_token), "profile.md")
    if os.path.exists(profile_path):
        with open(profile_path, "r") as f:
            return f.read()
    return ""

def save_to_diary(device_token: str, user_msg: str, ai_response: str, english_input: str, escalation_level: int, stress_type: str):
    """Append a conversation exchange to today's diary file."""
    user_dir = get_user_dir(device_token)
    today = datetime.now().strftime("%Y-%m-%d")
    diary_path = os.path.join(user_dir, "diary", f"{today}.md")

    timestamp = datetime.now().strftime("%H:%M:%S")
    is_new_file = not os.path.exists(diary_path)

    with open(diary_path, "a") as f:
        if is_new_file:
            f.write(f"# Conversation Diary — {today}\n\n")
        f.write(f"## [{timestamp}] Exchange\n")
        f.write(f"**Escalation Level:** {escalation_level} | **Stress Type:** {stress_type}\n\n")
        f.write(f"**User (original):** {user_msg}\n\n")
        f.write(f"**User (English):** {english_input}\n\n")
        f.write(f"**Sathi:** {ai_response}\n\n")
        f.write("---\n\n")

def update_user_profile(device_token: str, english_input: str, ai_response: str):
    """Ask the LLM to extract key user facts and update the profile."""
    current_profile = load_user_profile(device_token)

    prompt = (
        f"{PROFILE_UPDATE_PROMPT}\n\n"
        f"## Current Profile\n{current_profile if current_profile else '(No profile yet)'}\n\n"
        f"## New Exchange\nUser: {english_input}\nAI: {ai_response}\n\n"
        f"## Updated Profile (output this only):"
    )

    try:
        res = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You extract user profile information from conversations."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.1
        )
        updated_profile = res.choices[0].message.content.strip()
        if updated_profile:
            profile_path = os.path.join(get_user_dir(device_token), "profile.md")
            with open(profile_path, "w") as f:
                f.write(updated_profile)
    except Exception as e:
        print(f"Profile update failed (non-critical): {e}")

def get_recent_diary_context(device_token: str, max_exchanges: int = 3) -> str:
    """Load the last few exchanges from today's diary for conversation context."""
    user_dir = get_user_dir(device_token)
    today = datetime.now().strftime("%Y-%m-%d")
    diary_path = os.path.join(user_dir, "diary", f"{today}.md")

    if not os.path.exists(diary_path):
        return ""

    with open(diary_path, "r") as f:
        content = f.read()

    # Split by exchange separators and take the last N
    exchanges = content.split("---")
    recent = exchanges[-(max_exchanges + 1):-1] if len(exchanges) > 1 else []
    return "\n".join(recent).strip()


# --- MAIN VOICE PROCESSING ---

async def process_voice_interaction(file: UploadFile, device_token: str = "default_user") -> dict:
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
        # 4. LOAD USER MEMORY FOR CONTEXT
        # ==========================================
        user_profile = load_user_profile(device_token)
        diary_context = get_recent_diary_context(device_token)

        memory_block = ""
        if user_profile:
            memory_block += f"\n\n[User Profile — important background about this person]\n{user_profile}\n"
        if diary_context:
            memory_block += f"\n\n[Recent conversation history from today]\n{diary_context}\n"

        # ==========================================
        # 5. MAIN LLM LOGIC (Chandan -> Groq Fallback)
        # ==========================================
        try:
            payload = {
                "text": transcription,
                "source_lang": "npi_Deva",
                "device_token": device_token
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
            print(f"Chandan's server unreachable ({type(e).__name__}). Falling back to Groq Cloud...")

            # Inject memory into the system prompt for the fallback LLM
            enhanced_prompt = SYSTEM_PROMPT + memory_block

            cloud_res = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": enhanced_prompt},
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
        # 6. SAVE TO DIARY & UPDATE PROFILE
        # ==========================================
        save_to_diary(device_token, transcription, clean_text, english_translation, lvl, stress)
        update_user_profile(device_token, english_translation, clean_text)

        # ==========================================
        # 7. ELEVENLABS AUDIO GENERATION
        # ==========================================
        audio_base64 = None
        if elevenlabs_key:
            voice_id = "21m00Tcm4TlvDq8ikWAM"
            tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": elevenlabs_key
            }

            payload = {
                "text": clean_text,
                "model_id": "eleven_multilingual_v2",
                "voice_settings": {
                    "stability": 0.45,
                    "similarity_boost": 0.75
                }
            }

            try:
                print("Generating soothing voice via ElevenLabs...")
                async with httpx.AsyncClient() as http_client:
                    tts_response = await http_client.post(tts_url, json=payload, headers=headers, timeout=15.0)
                    tts_response.raise_for_status()

                    audio_base64 = base64.b64encode(tts_response.content).decode('utf-8')
                    print("ElevenLabs Audio Generated Successfully!")
            except Exception as e:
                print(f"ElevenLabs generation failed: {e}")

        # ==========================================
        # 8. RETURN FINAL JSON TO FRONTEND
        # ==========================================
        return {
            "response": clean_text,
            "translated_input": english_translation,
            "audio_base64": audio_base64,
            "escalation_level": lvl,
            "stress_type": stress
        }

    except Exception as e:
        print(f"Critical Controller Error: {e}")
        return {
            "response": "मलाई माफ गर्नुहोस्, मेरो प्रणालीमा केही समस्या छ। म अझै यहाँ सुन्दैछु।",
            "translated_input": "System Error",
            "escalation_level": 1,
            "stress_type": "default"
        }

    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
