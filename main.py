from fastapi import FastAPI,Depends, Form
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

# ตั้งค่าให้เสิร์ฟไฟล์ static จากโฟลเดอร์ "static"
app.mount("/static", StaticFiles(directory="static"), name="static")

# ตั้งค่าโฟลเดอร์ templates
templates = Jinja2Templates(directory="templates")

# Serve หน้า html
@app.get("/")
def serve_index():
    return FileResponse("templates/board.html")

@app.get("/home")
def serve_index():
    return FileResponse("templates/home.html")