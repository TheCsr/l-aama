from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from controllers.chat_controller import (
    process_voice_interaction,
    load_user_profile,
    get_user_dir,
)
from datetime import datetime
import os

class ProfileUpdate(BaseModel):
    profile: str

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/voice")
async def chat_voice_endpoint(
    file: UploadFile = File(...),
    device_token: str = Form("default_user")
):
    return await process_voice_interaction(file, device_token)

@router.get("/profile/{device_token}")
async def get_profile(device_token: str):
    profile = load_user_profile(device_token)
    if not profile:
        return {"profile": None, "message": "No profile built yet"}
    return {"profile": profile}

@router.put("/profile/{device_token}")
async def update_profile(device_token: str, body: ProfileUpdate):
    profile_path = os.path.join(get_user_dir(device_token), "profile.md")
    with open(profile_path, "w") as f:
        f.write(body.profile)
    return {"status": "profile updated"}

@router.get("/diary/{device_token}")
async def get_diary(device_token: str, date: str = None):
    if date is None:
        date = datetime.now().strftime("%Y-%m-%d")
    diary_path = os.path.join(get_user_dir(device_token), "diary", f"{date}.md")
    if not os.path.exists(diary_path):
        return {"diary": None, "message": f"No diary entry for {date}"}
    with open(diary_path, "r") as f:
        return {"date": date, "diary": f.read()}
