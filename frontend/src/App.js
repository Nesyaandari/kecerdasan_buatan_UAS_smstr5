import React, { useState } from 'react';
import { Activity, Heart, Scale, TrendingUp, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const ObesityPredictionSystem = () => {
  const [formData, setFormData] = useState({
    Gender: '',
    Age: '',
    Height: '',
    Weight: '',
    family_history_with_overweight: '',
    FAVC: '',
    FCVC: '',
    NCP: '',
    CAEC: '',
    SMOKE: '',
    CH2O: '',
    SCC: '',
    FAF: '',
    TUE: '',
    CALC: '',
    MTRANS: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['Gender', 'Age', 'Height', 'Weight', 'family_history_with_overweight',
      'FAVC', 'FCVC', 'NCP', 'CAEC', 'SMOKE', 'CH2O', 'SCC',
      'FAF', 'TUE', 'CALC', 'MTRANS'];

    for (let field of required) {
      if (!formData[field]) {
        return false;
      }
    }
    return true;
  };

  const predictObesity = async () => {
    if (!validateForm()) {
      setError('Mohon lengkapi semua field!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.status === 'success') {
        setPrediction(data);
      } else {
        setError(data.error || 'Terjadi kesalahan saat prediksi');
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server. Pastikan Flask API berjalan di http://localhost:5000');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Gender: '', Age: '', Height: '', Weight: '',
      family_history_with_overweight: '', FAVC: '', FCVC: '',
      NCP: '', CAEC: '', SMOKE: '', CH2O: '', SCC: '',
      FAF: '', TUE: '', CALC: '', MTRANS: ''
    });
    setPrediction(null);
    setError(null);
  };

  const getRiskColor = (riskLevel) => {
    const colors = {
      'normal': '#10B981',
      'low': '#3B82F6',
      'moderate': '#F59E0B',
      'high': '#EF4444',
      'very_high': '#DC2626',
      'extreme': '#991B1B'
    };
    return colors[riskLevel] || '#6B7280';
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', minHeight: '100vh', backgroundColor: '#F0F9FF' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1E40AF', color: 'white', padding: '24px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
          <Activity size={36} />
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '700' }}>Sistem Prediksi Obesitas</h1>
        </div>
        <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>Random Forest Machine Learning - Akurasi Tinggi</p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>

        {/* Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#DBEAFE', padding: '20px', borderRadius: '12px', border: '2px solid #3B82F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Scale size={24} color="#1E40AF" />
              <h3 style={{ margin: 0, color: '#1E40AF', fontSize: '18px' }}>Random Forest ML</h3>
            </div>
            <p style={{ margin: 0, color: '#1E3A8A', fontSize: '14px' }}>Algoritma ensemble learning dengan akurasi optimal untuk prediksi obesitas</p>
          </div>

          <div style={{ backgroundColor: '#D1FAE5', padding: '20px', borderRadius: '12px', border: '2px solid #10B981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Heart size={24} color="#059669" />
              <h3 style={{ margin: 0, color: '#059669', fontSize: '18px' }}>16 Variabel Gaya Hidup</h3>
            </div>
            <p style={{ margin: 0, color: '#065F46', fontSize: '14px' }}>Analisis komprehensif berdasarkan kebiasaan makan dan aktivitas fisik</p>
          </div>

          <div style={{ backgroundColor: '#E0E7FF', padding: '20px', borderRadius: '12px', border: '2px solid #6366F1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <TrendingUp size={24} color="#4338CA" />
              <h3 style={{ margin: 0, color: '#4338CA', fontSize: '18px' }}>7 Kategori Klasifikasi</h3>
            </div>
            <p style={{ margin: 0, color: '#3730A3', fontSize: '14px' }}>Dari Insufficient Weight hingga Obesity Type III</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ backgroundColor: '#FEE2E2', border: '2px solid #EF4444', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertCircle size={24} color="#DC2626" />
              <p style={{ margin: 0, color: '#991B1B', fontWeight: '500' }}>{error}</p>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '3px solid #3B82F6', marginBottom: '32px' }}>
          <h2 style={{ color: '#1E40AF', marginBottom: '24px', fontSize: '24px', fontWeight: '600', textAlign: 'center' }}>
            Input Data Untuk Prediksi ML
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1E40AF', fontWeight: '500' }}>Gender</label>
              <select name="Gender" value={formData.Gender} onChange={handleInputChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #BFDBFE', fontSize: '14px' }}>
                <option value="">Pilih</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1E40AF', fontWeight: '500' }}>Age (tahun)</label>
              <input type="number" name="Age" value={formData.Age} onChange={handleInputChange} placeholder="Contoh: 25"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #BFDBFE', fontSize: '14px' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1E40AF', fontWeight: '500' }}>Height (meter)</label>
              <input type="number" step="0.01" name="Height" value={formData.Height} onChange={handleInputChange} placeholder="Contoh: 1.70"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #BFDBFE', fontSize: '14px' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1E40AF', fontWeight: '500' }}>Weight (kg)</label>
              <input type="number" step="0.1" name="Weight" value={formData.Weight} onChange={handleInputChange} placeholder="Contoh: 65"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #BFDBFE', fontSize: '14px' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1E40AF', fontWeight: '500' }}>Family History Overweight</label>
              <select name="family_history_with_overweight" value={formData.family_history_with_overweight} onChange={handleInputChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #BFDBFE', fontSize: '14px' }}>
                <option value="">Pilih</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1E40AF', fontWeight: '500' }}>FAVC (High Caloric Food)</label>
              <select name="FAVC" value={formData.FAVC} onChange={handleInputChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #BFDBFE', fontSize: '14px' }}>
                <option value="">Pilih</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1E40AF', fontWeight: '500' }}>FCVC (Vegetables Frequency)</label>
              <select name="FCVC" value={formData.FCVC} onChange={handleInputChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #BFDBFE', fontSize: '14px' }}>
                <option value="">Pilih</option>
                <option value="1">1 - Never</option>
                <option value="2">2 - Sometimes</option>
                <option value="3">3 - Always</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1E40AF', fontWeight: '500' }}>NCP (Main Meals)</label>
              <select name="NCP" value={formData.NCP} onChange={handleInputChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #BFDBFE', fontSize: '14px' }}>
                <option value="">Pilih</option>
                <option value="1">1 meal</option>
                <option value="2">2 meals</option>
                <option value="3">3 meals</option>
                <option value="4">4+ meals</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1E40AF', fontWeight: '500' }}>CAEC (Food Between Meals)</label>
              <select name="CAEC" value={formData.CAEC} onChange={handleInputChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #BFDBFE', fontSize: '14px' }}>
                <option value="">Pilih</option>
                <option value="no">No</option>
                <option value="Sometimes">Sometimes</option>
                <option value="Frequently">Frequently</option>
                <option value="Always">Always</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1E40AF', fontWeight: '500' }}>SMOKE</label>
              <select name="SMOKE" value={formData.SMOKE} onChange={handleInputChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #BFDBFE', fontSize: '14px' }}>
                <option value="">Pilih</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1E40AF', fontWeight: '500' }}>CH2O (Water Consumption/day)</label>
              <select name="CH2O" value={formData.CH2O} onChange={handleInputChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #BFDBFE', fontSize: '14px' }}>
                <option value="">Pilih</option>
                <option value="1">Less than 1L</option>
                <option value="2">1-2 liters</option>
                <option value="3">More than 2L</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1E40AF', fontWeight: '500' }}>SCC (Calorie Monitoring)</label>
              <select name="SCC" value={formData.SCC} onChange={handleInputChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #BFDBFE', fontSize: '14px' }}>
                <option value="">Pilih</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1E40AF', fontWeight: '500' }}>FAF (Physical Activity/week)</label>
              <select name="FAF" value={formData.FAF} onChange={handleInputChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #BFDBFE', fontSize: '14px' }}>
                <option value="">Pilih</option>
                <option value="0">0 days</option>
                <option value="1">1-2 days</option>
                <option value="2">3-4 days</option>
                <option value="3">5+ days</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1E40AF', fontWeight: '500' }}>TUE (Technology Use/day hours)</label>
              <select name="TUE" value={formData.TUE} onChange={handleInputChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #BFDBFE', fontSize: '14px' }}>
                <option value="">Pilih</option>
                <option value="0">0-2 hours</option>
                <option value="1">3-5 hours</option>
                <option value="2">More than 5 hours</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1E40AF', fontWeight: '500' }}>CALC (Alcohol Consumption)</label>
              <select name="CALC" value={formData.CALC} onChange={handleInputChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #BFDBFE', fontSize: '14px' }}>
                <option value="">Pilih</option>
                <option value="no">No</option>
                <option value="Sometimes">Sometimes</option>
                <option value="Frequently">Frequently</option>
                <option value="Always">Always</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1E40AF', fontWeight: '500' }}>MTRANS (Transportation)</label>
              <select name="MTRANS" value={formData.MTRANS} onChange={handleInputChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #BFDBFE', fontSize: '14px' }}>
                <option value="">Pilih</option>
                <option value="Walking">Walking</option>
                <option value="Bike">Bike</option>
                <option value="Motorbike">Motorbike</option>
                <option value="Automobile">Automobile</option>
                <option value="Public_Transportation">Public Transportation</option>
              </select>
            </div>

          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px', justifyContent: 'center' }}>
            <button onClick={predictObesity} disabled={loading}
              style={{ backgroundColor: loading ? '#9CA3AF' : '#10B981', color: 'white', padding: '14px 32px', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {loading ? <><Loader size={20} className="spin" /> Processing...</> : 'Prediksi dengan ML'}
            </button>
            <button onClick={resetForm}
              style={{ backgroundColor: '#6B7280', color: 'white', padding: '14px 32px', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
              Reset
            </button>
          </div>
        </div>

        {/* Result Section */}
        {prediction && prediction.status === 'success' && (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '3px solid #10B981' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto 16px' }} />
              <h2 style={{ color: '#059669', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Hasil Prediksi Machine Learning</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>

              <div style={{ backgroundColor: '#DBEAFE', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ color: '#1E40AF', fontSize: '16px', marginBottom: '8px' }}>Kategori Prediksi</h3>
                <p style={{ fontSize: '24px', fontWeight: '700', color: getRiskColor(prediction.risk_level), margin: '8px 0' }}>
                  {prediction.prediction.class.replace(/_/g, ' ')}
                </p>
              </div>

              <div style={{ backgroundColor: '#D1FAE5', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ color: '#059669', fontSize: '16px', marginBottom: '8px' }}>Confidence Score</h3>
                <p style={{ fontSize: '48px', fontWeight: '700', color: '#059669', margin: '8px 0' }}>
                  {(prediction.prediction.confidence * 100).toFixed(1)}%
                </p>
              </div>

              <div style={{ backgroundColor: '#E0E7FF', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ color: '#4338CA', fontSize: '16px', marginBottom: '8px' }}>BMI Calculated</h3>
                <p style={{ fontSize: '48px', fontWeight: '700', color: '#4338CA', margin: '8px 0' }}>
                  {prediction.prediction.bmi}
                </p>
                <p style={{ color: '#3730A3', fontSize: '14px' }}>kg/m²</p>
              </div>

            </div>

            <div style={{ marginTop: '24px', backgroundColor: '#FEF3C7', padding: '20px', borderRadius: '12px', border: '2px solid #F59E0B' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <AlertCircle size={24} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h3 style={{ color: '#D97706', fontSize: '18px', marginBottom: '8px', fontWeight: '600' }}>Rekomendasi Kesehatan</h3>
                  <p style={{ color: '#78350F', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{prediction.recommendation}</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px', backgroundColor: '#F3F4F6', padding: '20px', borderRadius: '12px' }}>
              <h3 style={{ color: '#374151', fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>Probabilitas Semua Kelas:</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {Object.entries(prediction.probabilities).map(([className, prob]) => (
                  <div key={className} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #D1D5DB' }}>
                    <span style={{ fontSize: '13px', color: '#4B5563' }}>{className.replace(/_/g, ' ')}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>{(prob * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      <div style={{ backgroundColor: '#1E40AF', color: 'white', padding: '24px', textAlign: 'center', marginTop: '48px' }}>
        <p style={{ margin: 0, fontSize: '14px' }}>© 2025 Sistem Prediksi Obesitas | Random Forest Machine Learning</p>
      </div>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ObesityPredictionSystem;