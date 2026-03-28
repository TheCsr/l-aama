import os
from fastapi import FastAPI, UploadFile, File
from groq import Groq
from dotenv import load_dotenv
import json

load_dotenv()
app = FastAPI()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """
You are Sathi, an empathetic AI therapeutic companion.
Analyze the user's input and respond in STRICT JSON format.
JSON Schema:
{
  "response": "Your empathetic spoken response",
  "escalation_level": 1, 2, or 3 (3 is a crisis),
  "stress_type": "anxiety", "overstimulation", "fatigue", "clarity", "meditation", or "emergency"
}
"""

@app.post("/chat/voice")
async def process_voice(file: UploadFile = File(...)):
    try:
        temp_filename = f"temp_{file.filename}"
        with open(temp_filename, "wb") as f:
            f.write(await file.read())

        with open(temp_filename, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                file=(temp_filename, audio_file.read()),
                model="whisper-large-v3",
                response_format="text"
            )

        
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": transcription}
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )

        # 4. Clean up and return
        os.remove(temp_filename)
        return json.loads(chat_completion.choices[0].message.content)

    except Exception as e:
        print(f"Error: {e}")
        return {
            "response": "I'm listening, but I'm having a little trouble thinking. I'm still here with you.",
            "escalation_level": 1,
            "stress_type": "default"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)