from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
from models.level import Level
import random
import string

app = FastAPI(title="TimeStepper Backend")

# ===========================
# Models
# ===========================
class SolutionRequest(BaseModel):
    user_input: str
    level_id: int

# ===========================
# Level Registry
# ===========================
level_registry: Dict[int, Level] = {}

# Load levels from files
def load_levels():
    level_ids = [1, 2, 3, 4, 5, 6, 7]  # Add levels as per the directories available
    for level_id in level_ids:
        level_registry[level_id] = Level(level_id)

# ===========================
# API Routes
# ===========================
@app.get("/level/{level_id}")
async def get_level(level_id: int):
    level = level_registry.get(level_id)
    if not level:
        raise HTTPException(status_code=404, detail="Level not found")
    return {
        "level": level_id,
        "js_code": level.get_js_challenge()
    }

@app.post("/solve")
async def solve_level(req: SolutionRequest):
    level = level_registry.get(req.level_id)
    if not level:
        raise HTTPException(status_code=404, detail="Level not found")
    if level.verify_solution(req.user_input):
        return {"status": "correct", "message": "You've solved the level!"}
    raise HTTPException(status_code=400, detail="Incorrect. Try again!")

@app.get("/level/{level_id}/hint")
async def get_hint(level_id: int):
    level = level_registry.get(level_id)
    if not level:
        raise HTTPException(status_code=404, detail="Level not found")
    return {"hint": level.get_hint()}

# ===========================
# Startup Event: Load levels
# ===========================
@app.on_event("startup")
async def startup_event():
    load_levels()

# ===========================
# Entry Point
# ===========================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
