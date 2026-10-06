"""
===============================================================================
FARMAYE FASTAPI BACKEND (backend/main.py)
===============================================================================
FastAPI server handling cashew maturity image prediction, CORS, file validation,
and model execution.
===============================================================================
"""

import os
from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from model_service import predict, USE_MOCK

app = FastAPI(
    title="FarmEye Cashew Maturity AI API",
    description="Backend API for classifying cashew fruit maturity using AI deep learning.",
    version="1.0.0"
)

# -----------------------------------------------------------------------------
# CORS CONFIGURATION
# -----------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from Vite dev server / any origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# CONSTANTS & VALIDATION
# -----------------------------------------------------------------------------
MAX_FILE_SIZE = 8 * 1024 * 1024  # 8 MB max limit
ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


@app.get("/")
def read_root():
    return {
        "name": "FarmEye API",
        "status": "online",
        "mock_mode": USE_MOCK,
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "FarmEye Cashew AI Backend",
        "mock_mode": USE_MOCK
    }


@app.post("/predict")
async def predict_cashew(file: UploadFile = File(...)):
    """
    POST /predict
    Receives an uploaded cashew image and returns maturity classification:
    - label: "mature" | "not_mature" | "uncertain"
    - confidence: float (0.0 to 1.0)
    - message: str
    """
    # 1. Validate file presence
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image file provided."
        )

    # 2. Validate file extension and MIME type
    filename = file.filename or ""
    file_ext = os.path.splitext(filename.lower())[1]

    if file_ext and file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{file_ext}'. Allowed formats: JPG, JPEG, PNG, WEBP."
        )

    if file.content_type and file.content_type not in ALLOWED_MIME_TYPES and file.content_type != "application/octet-stream":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid content type '{file.content_type}'. Allowed types: JPEG, PNG, WEBP."
        )

    # 3. Read bytes & validate max file size (8 MB limit)
    contents = await file.read()
    file_size = len(contents)

    if file_size > MAX_FILE_SIZE:
        size_mb = round(file_size / (1024 * 1024), 2)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size ({size_mb} MB) exceeds the maximum limit of 8 MB."
        )

    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    # 4. Process image and generate prediction
    try:
        result = predict(contents)
        return JSONResponse(status_code=200, content=result)
    except Exception as e:
        print(f"[FarmEye Backend Error] Exception during prediction: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process image: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
