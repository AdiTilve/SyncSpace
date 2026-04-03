from fastapi import FastAPI
from users.router import router as users_router
from users import model
from auth.router import router as auth_router
from shared.database import engine,Base
app=FastAPI()

@app.on_event("startup")
async def on_startup():
    await create_tables()
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
app.include_router(users_router,prefix="/users",tags=["Users"])
app.include_router(auth_router,prefix="/auth",tags=["Users"])
