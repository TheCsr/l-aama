import ctranslate2
import transformers
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
from langchain_community.chat_message_histories import SQLChatMessageHistory

app = FastAPI()

# --- 1. CONFIGURATION & MODELS ---
# Load NLLB with CTranslate2 (Assumes you ran the conversion command earlier)
translator = ctranslate2.Translator("nllb_ct2", device="cpu")
tokenizer = transformers.AutoTokenizer.from_pretrained("facebook/nllb-200-distilled-600M")

OLLAMA_URL = "http://localhost:11434/api/generate"
DB_CONNECTION = "sqlite:///chat_memory.db"

class ChatRequest(BaseModel):
    text: str
    source_lang: str  # 'mai_Deva' for Maithili, 'bho_Deva' for Bhojpuri
    device_token: str # Unique ID from the mobile app

# --- 2. TRANSLATION HELPER ---
def nllb_translate(text: str, src_lang: str, tgt_lang: str):
    tokenizer.src_lang = src_lang
    source = tokenizer.convert_ids_to_tokens(tokenizer.encode(text))
    results = translator.translate_batch([source], target_prefix=[[tgt_lang]])
    target = results[0].hypotheses[0][1:]
    return tokenizer.decode(tokenizer.convert_tokens_to_ids(target))

# --- 3. THE SMART ENDPOINT ---
@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    try:
        # A. Fetch History (Persistent Memory)
        history = SQLChatMessageHistory(session_id=req.device_token, connection_string=DB_CONNECTION)
        
        # B. Translate Input to English for Reasoning
        english_input = nllb_translate(req.text, req.source_lang, "eng_Latn")
        
        # C. Prepare Context for the LLM
        past_msgs = history.messages[-6:] # Last 3 exchanges
        context = "\n".join([f"{'User' if m.type=='human' else 'AI'}: {m.content}" for m in past_msgs])

        # D. The Triage & Reasoning Prompt
        system_instructions = (
            "You are a Mental Health Triage Expert. Analyze the user's current input and history.\n"
            "ASSIGN A LEVEL:\n"
            "Level 0: Normal daily stress. Action: Continue chatting.\n"
            "Level 1: Moderate stress. Action: Suggest friends/family support.\n"
            "Level 2: Isolation/Niche issues (Students/Immigrants). Action: Suggest community groups.\n"
            "Level 3: Severe/Crisis. Action: Recommend Professional/Doctor/NGO help immediately.\n\n"
            "Respond ONLY in valid JSON format with these keys: "
            "'wellbeing_score' (1-10), 'level' (0-3), 'reasoning' (brief English), 'response' (empathetic English reply)."
        )

        full_prompt = f"{system_instructions}\n\nHistory:\n{context}\nUser: {english_input}\nJSON Response:"

        # E. Call DeepSeek-R1 (with JSON mode enabled)
        ollama_payload = {
            "model": "deepseek-r1:8b",
            "prompt": full_prompt,
            "format": "json",
            "stream": False,
            "options": {"temperature": 0.3}
        }
        
        raw_res = requests.post(OLLAMA_URL, json=ollama_payload).json()
        ai_data = json.loads(raw_res['response'])

        # F. Save English versions to Memory (Best for future context)
        history.add_user_message(english_input)
        history.add_ai_message(ai_data['response'])

        # G. Translate Response back to Regional Language
        final_regional_text = nllb_translate(ai_data['response'], "eng_Latn", req.source_lang)

        # H. Final Return to Mobile App
        return {
            "wellbeing_score": ai_data['wellbeing_score'],
            "triage_level": ai_data['level'],
            "analysis": ai_data['reasoning'], 
            "response": final_regional_text,
            "device_token": req.device_token
        }

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# --- 4. CLEAR HISTORY ENDPOINT ---
@app.post("/clear_history")
async def clear_history(device_token: str):
    history = SQLChatMessageHistory(session_id=device_token, connection_string=DB_CONNECTION)
    history.clear()
    return {"status": "history cleared"}