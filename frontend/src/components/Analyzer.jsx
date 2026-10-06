import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  X, 
  Sparkles, 
  FileImage, 
  RefreshCw, 
  AlertCircle,
  CheckCircle2,
  ScanLine
} from 'lucide-react';
import { CameraCapture } from './CameraCapture';
import { ResultCard } from './ResultCard';

export const Analyzer = ({ onSaveToHistory, showToast }) => {
  const fileInputRef = useRef(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const validateAndSetFile = (file) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      showToast('Invalid file format. Please upload JPG, PNG, or WEBP images.', 'error');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showToast(`File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds 8 MB limit.`, 'error');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setAnalysisResult(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setAnalysisResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCameraCapture = (file, dataUrl) => {
    setSelectedFile(file);
    setPreviewUrl(dataUrl);
    setAnalysisResult(null);
  };

  const handleRunAnalysis = async () => {
    if (!selectedFile) {
      showToast('Please select or capture an image first.', 'warning');
      return;
    }

    setAnalyzing(true);
    setAnalysisProgress('Preprocessing cashew image...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Simulated step delays for smooth scan experience
      const stepTimer1 = setTimeout(() => {
        setAnalysisProgress('Running neural feature extraction...');
      }, 700);

      const stepTimer2 = setTimeout(() => {
        setAnalysisProgress('Evaluating cashew receptacle maturity...');
      }, 1400);

      // Perform API call
      const response = await fetch('/predict', {
        method: 'POST',
        body: formData,
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      
      setAnalysisResult(data);
      showToast('Analysis complete!', 'success');

      // Save to localStorage history
      if (onSaveToHistory) {
        onSaveToHistory({
          id: Date.now(),
          thumbnail: previewUrl,
          label: data.label,
          confidence: data.confidence,
          message: data.message,
          timestamp: new Date().toISOString(),
        });
      }

    } catch (err) {
      console.error('Prediction API Error:', err);
      showToast(err.message || 'Failed to analyze image. Ensure backend is running.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <section id="analyzer" className="py-16 md:py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Section Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ScanLine className="w-3.5 h-3.5 text-emerald-400" />
            <span>Diagnostic Portal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Analyze Cashew Maturity
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Drag & drop your photo, select a file, or snap a live picture using your device camera.
          </p>
        </div>

        {/* Main Interaction Card */}
        {!analysisResult ? (
          <div className="glass-card rounded-2xl border border-white/10 p-6 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
            
            {/* Hidden Input File Element */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Dropzone or Preview Container */}
            {!previewUrl ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-950/30 scale-[1.01]'
                    : 'border-white/15 bg-[#0B0F0E]/50 hover:border-emerald-500/40 hover:bg-[#121816]'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="max-w-sm mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                    <Upload className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-base font-semibold text-white">
                      Drag & drop your cashew image here
                    </p>
                    <p className="text-xs text-slate-400">
                      Supports JPG, JPEG, PNG, WEBP (Max 8 MB)
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-400 transition-colors shadow-md"
                    >
                      Browse files
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCameraModal(true);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      <span>Use Camera</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Image Selected Preview & Scanner Overlay */
              <div className="space-y-6">
                <div className="relative max-w-md mx-auto aspect-square rounded-2xl overflow-hidden bg-black border border-white/10 shadow-xl group">
                  <img
                    src={previewUrl}
                    alt="Cashew Preview"
                    className="w-full h-full object-cover"
                  />

                  {/* Laser Scanning Bar Overlay during analysis */}
                  {analyzing && (
                    <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px] pointer-events-none">
                      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#22C55E] animate-laser-scan" />
                    </div>
                  )}

                  {/* Top Floating Actions */}
                  {!analyzing && (
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        onClick={handleRemoveImage}
                        className="p-2 rounded-xl bg-black/70 hover:bg-black text-slate-300 hover:text-white border border-white/20 transition-all backdrop-blur-md"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Progress Status Bar */}
                {analyzing && (
                  <div className="max-w-md mx-auto space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{analysisProgress}</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 animate-pulse w-full" />
                    </div>
                  </div>
                )}

                {/* Analyze Button */}
                {!analyzing && (
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={handleRunAnalysis}
                      className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Sparkles className="w-5 h-5 text-emerald-100" />
                      <span>Analyze Cashew Maturity</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Privacy Note */}
            <p className="text-xs text-slate-400 pt-2">
              Privacy guarantee: Uploaded images are processed in real-time for diagnostic analysis and are never saved on our servers.
            </p>
          </div>
        ) : (
          /* Result View */
          <ResultCard
            result={analysisResult}
            imagePreview={previewUrl}
            onReset={handleRemoveImage}
          />
        )}

        {/* Camera Capture Modal */}
        {showCameraModal && (
          <CameraCapture
            onCapture={handleCameraCapture}
            onClose={() => setShowCameraModal(false)}
          />
        )}

      </div>
    </section>
  );
};
