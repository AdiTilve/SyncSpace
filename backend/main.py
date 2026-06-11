from fastapi import FastAPI,Request
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from users.router import router as users_router
from users import model
from spaces import model
from auth.router import router as auth_router
from spaces.router import router as spaces_router
from shared.database import engine,Base
from contextlib import asynccontextmanager
from fastapi.middleware.gzip import GZipMiddleware
import os
@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)
app.add_middleware(GZipMiddleware, minimum_size=1000) # Compresses everything over 1KB

origins = os.getenv("ALLOWED_ORIGINS")

if origins:
    ALLOWED_ORIGINS = [o.strip() for o in origins.split(",")]
else:
    ALLOWED_ORIGINS = []
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(StarletteHTTPException)

async def http_exception_handler(request: Request, exc: StarletteHTTPException):

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status_code": exc.status_code,
            "detail": exc.detail
        }
    )

@app.exception_handler(RequestValidationError)

async def validation_exception_handler(request: Request, exc: RequestValidationError):

    return JSONResponse(
        status_code=422,
        content={
            "status_code": 422,
            "detail": "Invalid input data",
            "errors": exc.errors()   # optional but recommended
        }
    )

@app.exception_handler(Exception)

async def global_exception_handler(request: Request, exc: Exception):

    return JSONResponse(
        status_code=500,
        content={
            "status_code": 500,
            "detail": "Internal server error"
        }
    )

app.include_router(users_router,prefix="/users",tags=["Users"])
app.include_router(auth_router,prefix="/auth",tags=["Auth"])
app.include_router(spaces_router, prefix="/spaces",tags=["Spaces"])