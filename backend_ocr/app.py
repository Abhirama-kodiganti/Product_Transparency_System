from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import easyocr
import numpy as np
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the EasyOCR reader
# This happens only once when the server starts
try:
    logging.info("Loading EasyOCR model...")
    reader = easyocr.Reader(['en'], gpu=False)
    logging.info("EasyOCR model loaded successfully.")
except Exception as e:
    logging.error(f"Error loading EasyOCR model: {e}")
    reader = None

@app.route('/upload', methods=['POST'])
def upload():
    if reader is None:
        return jsonify({"error": "EasyOCR model is not available."}), 500

    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected for uploading"}), 400

    try:
        logging.info("Receiving and processing uploaded image...")
        # Read the image file from the request
        np_img = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        if image is None:
            return jsonify({"error": "Could not decode image"}), 400

        # Use EasyOCR to read text
        results = reader.readtext(image, paragraph=False)
        texts = [text for (_, text, _) in results]
        logging.info(f"Detected texts: {texts}")

        return jsonify({"text": texts})

    except Exception as e:
        logging.error(f"Error processing image: {e}")
        return jsonify({"error": "Failed to process image"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ok",
        "ocr_model_loaded": reader is not None
    })

if __name__ == '__main__':
    print("Starting Python OCR server on port 3000...")
    app.run(debug=False, host='0.0.0.0', port=3000) 