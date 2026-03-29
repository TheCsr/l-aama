from fastapi import APIRouter, UploadFile, File
from controllers.chat_controller import process_voice_interaction

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/voice")
async def chat_voice_endpoint(file: UploadFile = File(...)):
    return await process_voice_interaction(file)

