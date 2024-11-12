from fastapi import FastAPI,Depends, Form, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# กำหนดให้สามารถร้องขอจากทุก origin ได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # สามารถใช้ "*" สำหรับทุก origin หรือจะกำหนดเป็นลิสต์เฉพาะ URL
    allow_credentials=True,
    allow_methods=["*"],  # หรือจะกำหนดเป็นลิสต์ของ HTTP methods ที่อนุญาต
    allow_headers=["*"],  # หรือกำหนดเป็นลิสต์ของ headers ที่อนุญาต
)

# ตั้งค่าให้เสิร์ฟไฟล์ static จากโฟลเดอร์ "static"
app.mount("/static", StaticFiles(directory="static"), name="static")

# ตั้งค่าโฟลเดอร์ templates
templates = Jinja2Templates(directory="templates")

# Serve หน้า html
@app.get("/")
def serve_index():
    return FileResponse("templates/board.html")

@app.get("/home")
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@app.get("/score")
async def home(request: Request):
    return templates.TemplateResponse("score.html", {"request": request})

@app.get("/goal")
async def goal(request: Request):
    return templates.TemplateResponse("goal.html", {"request": request})

@app.get("/lobby")
async def serve_lobby(request: Request, room_id: str):
    return templates.TemplateResponse("lobby.html", {"request": request, "room_id": room_id})

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List   
import random

# ตัวอย่างการเก็บข้อมูลห้องและผู้เล่นในหน่วยความจำ (Memory Storage)
rooms: Dict[str, List[str]] = {}  # rooms[room_id] = [player1, player2, ...]

# กำหนดจำนวนผู้เล่นสูงสุดต่อห้อง
MAX_PLAYERS = 4

# Model สำหรับสร้างและเข้าห้อง
class RoomRequest(BaseModel):
    player_name: str

# กำหนดจำนวนผู้เล่นสูงสุดต่อห้อง
MAX_PLAYERS = 4

# Model สำหรับสร้างและเข้าห้อง
class RoomRequest(BaseModel):
    player_name: str

# สร้างห้องใหม่
@app.post("/create_room")
async def create_room(request: RoomRequest):
    # สร้างรหัสห้องแบบสุ่ม
    room_id = str(random.randint(10000, 99999))
    
    # ตรวจสอบว่าห้องนี้มีอยู่แล้วหรือไม่
    while room_id in rooms:
        room_id = str(random.randint(10000, 99999))
    
    # เพิ่มผู้เล่นคนแรกเข้าห้อง
    rooms[room_id] = [request.player_name]
    
    return {"room_id": room_id, "message": "Room created successfully"}

# เข้าร่วมห้องที่มีอยู่
@app.post("/join_room/{room_id}")
async def join_room(room_id: str, request: RoomRequest):
    if room_id not in rooms:
        raise HTTPException(status_code=404, detail="Room not found")
    
    if len(rooms[room_id]) >= MAX_PLAYERS:
        raise HTTPException(status_code=400, detail="Room is full")
    
    # เพิ่มผู้เล่นใหม่ในห้อง
    rooms[room_id].append(request.player_name)
    
    return {"message": f"{request.player_name} joined room {room_id} successfully"}

# ดึงข้อมูลผู้เล่นในห้อง
@app.get("/lobby/{room_id}")
async def get_lobby(room_id: str):
    if room_id not in rooms:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # ส่งรายชื่อผู้เล่นในห้อง (ไม่เกิน 4 คน)
    return {"players": rooms[room_id][:MAX_PLAYERS]}

@app.post("/leave_room/{room_id}")
async def leave_room(room_id: str, request: RoomRequest):
    # ตรวจสอบว่าห้องมีอยู่หรือไม่
    if room_id not in rooms:
        raise HTTPException(status_code=404, detail="Room not found")

    # ตรวจสอบว่าผู้เล่นอยู่ในห้องหรือไม่
    if request.player_name not in rooms[room_id]:
        raise HTTPException(status_code=404, detail="Player not in room")

    # ลบผู้เล่นออกจากห้อง
    rooms[room_id].remove(request.player_name)

    # ถ้าไม่มีผู้เล่นเหลือในห้องนี้แล้ว ให้ลบห้อง
    if len(rooms[room_id]) == 0:
        del rooms[room_id]

    return {"message": f"{request.player_name} left room {room_id} successfully"}

