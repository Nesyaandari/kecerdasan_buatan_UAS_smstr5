# app.py - Flask Backend untuk Prediksi Obesitas

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import json

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

# Load model dan preprocessing objects
print("Loading model...")
model = joblib.load('models/obesity_model.pkl')
scaler = joblib.load('models/scaler.pkl')
label_encoders = joblib.load('models/label_encoders.pkl')
target_encoder = joblib.load('models/target_encoder.pkl')

# Load metadata
with open('models/model_metadata.json', 'r') as f:
    metadata = json.load(f)

print("✓ Model loaded successfully!")
print(f"Model Accuracy: {metadata['accuracy']:.4f}")

# Mapping untuk rekomendasi
RECOMMENDATIONS = {
    'Insufficient_Weight': 'Tingkatkan asupan kalori dan nutrisi seimbang. Konsumsi makanan bergizi tinggi protein. Konsultasikan dengan ahli gizi untuk program penambahan berat badan yang sehat.',
    'Normal_Weight': 'Pertahankan pola makan sehat dan aktivitas fisik rutin minimal 150 menit per minggu. Lanjutkan gaya hidup sehat Anda!',
    'Overweight_Level_I': 'Kurangi kalori harian sekitar 500 kcal, tingkatkan aktivitas fisik menjadi 200 menit per minggu, konsumsi lebih banyak sayuran dan protein rendah lemak.',
    'Overweight_Level_II': 'Segera kurangi berat badan 5-10% dalam 6 bulan. Konsultasi dengan ahli gizi untuk program penurunan berat badan terstruktur. Tingkatkan aktivitas fisik intensitas sedang.',
    'Obesity_Type_I': 'Butuh intervensi medis. Konsultasi dengan dokter dan ahli gizi. Program penurunan berat badan intensif dengan target 5-10% dalam 6 bulan. Pertimbangkan konseling perilaku.',
    'Obesity_Type_II': 'Kondisi serius! Segera konsultasi dengan tim medis (dokter, ahli gizi, psikolog). Mungkin butuh intervensi farmakologis. Program komprehensif dengan monitoring ketat.',
    'Obesity_Type_III': 'Kondisi sangat serius! Segera konsultasi dengan spesialis obesitas. Pertimbangkan program penurunan berat badan intensif, terapi farmakologis, atau opsi bedah bariatrik jika diindikasikan.'
}

@app.route('/')
def home():
    return jsonify({
        'message': 'Obesity Prediction API',
        'status': 'running',
        'model_accuracy': metadata['accuracy'],
        'version': '1.0'
    })

@app.route('/model-info')
def model_info():
    return jsonify({
        'features': metadata['features'],
        'classes': metadata['classes'],
        'accuracy': metadata['accuracy'],
        'precision': metadata['precision'],
        'recall': metadata['recall'],
        'f1_score': metadata['f1_score'],
        'cv_mean': metadata['cv_mean'],
        'cv_std': metadata['cv_std'],
        'best_params': metadata['best_params']
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.json
        
        # Validasi input
        required_fields = metadata['features']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing field: {field}',
                    'status': 'error'
                }), 400
        
        # Prepare input data
        input_data = pd.DataFrame([data])
        
        # Encode categorical variables
        for col in label_encoders.keys():
            if col in input_data.columns:
                try:
                    input_data[col] = label_encoders[col].transform(input_data[col])
                except ValueError as e:
                    return jsonify({
                        'error': f'Invalid value for {col}',
                        'status': 'error'
                    }), 400
        
        # Ensure correct column order
        input_data = input_data[metadata['features']]
        
        # Scale features
        input_scaled = scaler.transform(input_data)
        
        # Predict
        prediction_encoded = model.predict(input_scaled)[0]
        prediction_proba = model.predict_proba(input_scaled)[0]
        
        # Decode prediction
        prediction_class = target_encoder.inverse_transform([prediction_encoded])[0]
        
        # Get confidence score
        confidence = float(np.max(prediction_proba))
        
        # Get all class probabilities
        class_probabilities = {}
        for i, class_name in enumerate(metadata['classes']):
            class_probabilities[class_name] = float(prediction_proba[i])
        
        # Calculate BMI for additional info
        bmi = float(data['Weight']) / (float(data['Height']) ** 2)
        
        # Get recommendation
        recommendation = RECOMMENDATIONS.get(prediction_class, 'Konsultasikan dengan tenaga kesehatan profesional.')
        
        # Response
        response = {
            'status': 'success',
            'prediction': {
                'class': prediction_class,
                'confidence': confidence,
                'bmi': round(bmi, 2)
            },
            'probabilities': class_probabilities,
            'recommendation': recommendation,
            'risk_level': get_risk_level(prediction_class)
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

def get_risk_level(prediction_class):
    """Get risk level based on prediction class"""
    risk_mapping = {
        'Insufficient_Weight': 'low',
        'Normal_Weight': 'normal',
        'Overweight_Level_I': 'moderate',
        'Overweight_Level_II': 'moderate',
        'Obesity_Type_I': 'high',
        'Obesity_Type_II': 'very_high',
        'Obesity_Type_III': 'extreme'
    }
    return risk_mapping.get(prediction_class, 'unknown')

@app.route('/health')
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Flask API Server Starting...")
    print("="*60)
    print(f"Model Accuracy: {metadata['accuracy']:.4f}")
    print(f"Number of features: {len(metadata['features'])}")
    print(f"Number of classes: {len(metadata['classes'])}")
    print("\nAPI Endpoints:")
    print("  GET  / - Home")
    print("  GET  /model-info - Model Information")
    print("  POST /predict - Make Prediction")
    print("  GET  /health - Health Check")
    print("\nServer running on http://localhost:5000")
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)