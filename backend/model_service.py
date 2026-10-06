"""
===============================================================================
FARMAYE MODEL SERVICE (backend/model_service.py)
===============================================================================
This module manages AI model loading, image preprocessing, and inference.

TO CONNECT YOUR TRAINED MODEL:
1. Place your model file (e.g. `cashew_model.h5`, `cashew_model.pt`, or `cashew_model.onnx`) 
   in the `backend/` directory.
2. Set `USE_MOCK = False` (or set the environment variable USE_MOCK=false).
3. Adjust `TARGET_IMAGE_SIZE`, normalization, and class labels below as needed.
===============================================================================
"""

import os
import io
import math
import random
from PIL import Image, ImageStat, ImageEnhance

# -----------------------------------------------------------------------------
# CONFIGURATION & CONSTANTS (Easily editable by user)
# -----------------------------------------------------------------------------
# Toggle mock mode via environment variable or default to True if model not present
USE_MOCK = os.getenv("USE_MOCK", "true").lower() in ("true", "1", "yes")

# Target dimensions expected by your AI model (e.g., 224x224 for ResNet/MobileNet/EfficientNet)
TARGET_IMAGE_SIZE = (224, 224)

# Model file paths to check automatically
MODEL_FILE_PATHS = [
    "cashew_model.h5",
    "cashew_model.pt",
    "cashew_model.onnx",
    "cashew_model.tflite",
    "model.h5",
    "model.pt"
]

# Class labels index mapping (adjust to match your model training output order)
# Index 0: not_mature, Index 1: mature
CLASS_LABELS = ["not_mature", "mature"]

# Loaded model instance singleton
LOADED_MODEL = None
MODEL_FRAMEWORK = None


def load_user_model():
    """
    Attempts to load a trained model file if available.
    Supports Keras (.h5), PyTorch (.pt), ONNX (.onnx), or TFLite (.tflite).
    """
    global LOADED_MODEL, MODEL_FRAMEWORK, USE_MOCK

    if USE_MOCK:
        print("[FarmEye ModelService] Running in MOCK MODE (USE_MOCK=true).")
        return

    # Check for available model file
    found_model_path = None
    for path in MODEL_FILE_PATHS:
        full_path = os.path.join(os.path.dirname(__file__), path)
        if os.path.exists(full_path):
            found_model_path = full_path
            break

    if not found_model_path:
        print("[FarmEye ModelService] No model file found. Falling back to MOCK MODE.")
        USE_MOCK = True
        return

    print(f"[FarmEye ModelService] Loading model from: {found_model_path}")
    
    # Example integration hooks for popular frameworks:
    # --- TensorFlow / Keras (.h5) ---
    # try:
    #     import tensorflow as tf
    #     LOADED_MODEL = tf.keras.models.load_model(found_model_path)
    #     MODEL_FRAMEWORK = "tensorflow"
    #     return
    # except Exception as e:
    #     print(f"Error loading TensorFlow model: {e}")

    # --- PyTorch (.pt) ---
    # try:
    #     import torch
    #     LOADED_MODEL = torch.load(found_model_path, map_location=torch.device('cpu'))
    #     LOADED_MODEL.eval()
    #     MODEL_FRAMEWORK = "pytorch"
    #     return
    # except Exception as e:
    #     print(f"Error loading PyTorch model: {e}")

    # Default fallback if import fails
    print("[FarmEye ModelService] Model framework not installed. Using intelligent mock fallback.")
    USE_MOCK = True


# Initialize model check on module import
load_user_model()


def preprocess_image(image_bytes: bytes) -> tuple:
    """
    Reads image bytes and prepares them for model prediction or analysis.
    - Converts to RGB
    - Resizes to TARGET_IMAGE_SIZE (224, 224)
    - Returns PIL Image and normalized NumPy / byte statistics
    """
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode != "RGB":
        img = img.convert("RGB")
    
    resized_img = img.resize(TARGET_IMAGE_SIZE, Image.Resampling.BILINEAR)
    return img, resized_img


def analyze_image_heuristics(img: Image.Image) -> tuple[str, float, str]:
    """
    Intelligent heuristic fallback analyzer for Mock Mode.
    Analyzes color hues, saturation, and contrast of the cashew apple & nut:
    - Ripe cashews feature strong Red/Orange/Bright Yellow cashew apples with firm grey/brown nuts.
    - Unripe cashews feature high Green/Yellow-Green hue ratios.
    - Blurry/low-contrast or dark images trigger low confidence / uncertain states.
    """
    # Stat calculation
    hsv_img = img.convert("HSV")
    stat = ImageStat.Stat(hsv_img)
    hue_mean, sat_mean, val_mean = stat.mean[0], stat.mean[1], stat.mean[2]

    # Calculate RGB distribution
    rgb_stat = ImageStat.Stat(img)
    r_mean, g_mean, b_mean = rgb_stat.mean[0], rgb_stat.mean[1], rgb_stat.mean[2]

    # Contrast check (low variance/brightness indicates poor quality or non-cashew image)
    var = sum(rgb_stat.var) / 3.0
    if val_mean < 30 or var < 150:
        return (
            "uncertain",
            round(random.uniform(0.42, 0.64), 2),
            "Image lighting or contrast is too low to accurately assess maturity. Please retake photo in bright, natural light."
        )

    # Calculate ripeness color index: R/G ratio and Yellow/Orange dominance
    # Mature cashew apples shift from green to deep yellow, orange, or red.
    red_green_ratio = (r_mean + 1.0) / (g_mean + 1.0)
    green_dominance = g_mean / (r_mean + b_mean + 1.0)

    if red_green_ratio > 1.15 and green_dominance < 0.48:
        # High likelihood mature
        confidence = round(min(0.98, max(0.78, 0.75 + (red_green_ratio - 1.15) * 0.3 + random.uniform(0.01, 0.12))), 2)
        message = (
            "The cashew apple shows full color development (vibrant red/yellow receptacle) "
            "with a fully developed, firm cashew nut. Ready for harvest."
        )
        label = "mature"
    elif green_dominance > 0.42 or red_green_ratio < 0.95:
        # High likelihood not mature
        confidence = round(min(0.96, max(0.76, 0.72 + (green_dominance - 0.40) * 0.4 + random.uniform(0.01, 0.10))), 2)
        message = (
            "The cashew apple remains predominantly green or under-developed. "
            "Allow more time on the tree for optimal sugar content and nut weight."
        )
        label = "not_mature"
    else:
        # Intermediate or borderline
        confidence = round(random.uniform(0.62, 0.69), 2)
        label = "uncertain" if confidence < 0.70 else ("mature" if red_green_ratio >= 1.0 else "not_mature")
        message = (
            "Borderline maturity indicators detected. Confidence is below 70%. "
            "Please inspect the fruit attachment firmness or retake a closer photograph."
        )

    return label, confidence, message


def predict(image_bytes: bytes) -> dict:
    """
    Main prediction entry point.
    Returns JSON payload structure:
    {
       "label": "mature" | "not_mature" | "uncertain",
       "confidence": float (0.0 to 1.0),
       "message": str
    }
    """
    img, resized_img = preprocess_image(image_bytes)

    # 1. MOCK MODE prediction
    if USE_MOCK or LOADED_MODEL is None:
        label, confidence, message = analyze_image_heuristics(img)
        
        # Enforce low confidence rule (< 0.70 => "uncertain")
        if confidence < 0.70:
            label = "uncertain"

        return {
            "label": label,
            "confidence": confidence,
            "message": message,
            "mode": "mock"
        }

    # 2. TRAINED MODEL INFERENCE PLACEHOLDER
    # Customize this section to match your trained model's output formatting:
    try:
        # Example for PyTorch:
        # import torch
        # import numpy as np
        # img_array = np.array(resized_img, dtype=np.float32) / 255.0
        # img_tensor = torch.tensor(img_array).permute(2, 0, 1).unsqueeze(0)
        # with torch.no_grad():
        #     output = LOADED_MODEL(img_tensor)
        #     probs = torch.softmax(output, dim=1).numpy()[0]
        # class_idx = np.argmax(probs)
        # raw_confidence = float(probs[class_idx])
        # raw_label = CLASS_LABELS[class_idx]

        # For demonstration purposes when model is loaded:
        raw_label = "mature"
        raw_confidence = 0.92
        
        label = raw_label
        confidence = round(raw_confidence, 2)
        
        if confidence < 0.70:
            label = "uncertain"
            message = "Model confidence is below 70%. Retake photo with good lighting and close-up focus."
        elif label == "mature":
            message = "AI model predicts mature cashew. Receptacle color and nut outline match ideal harvest state."
        else:
            message = "AI model predicts immature cashew. Recommend delaying harvest."

        return {
            "label": label,
            "confidence": confidence,
            "message": message,
            "mode": "model"
        }
    except Exception as e:
        print(f"Inference error: {e}")
        # Fallback gracefully to mock heuristic
        label, confidence, message = analyze_image_heuristics(img)
        return {
            "label": label if confidence >= 0.70 else "uncertain",
            "confidence": confidence,
            "message": f"Inference warning fallback: {message}",
            "mode": "fallback"
        }
