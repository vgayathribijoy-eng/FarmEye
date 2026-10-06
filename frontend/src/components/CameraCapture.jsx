import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, AlertTriangle, Check, SwitchCamera } from 'lucide-react';

export const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' or 'user'
  const [loading, setLoading] = useState(true);

  const startCamera = async (mode) => {
    setLoading(true);
    setErrorMsg(null);
    
    // Stop existing stream if any
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      const constraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setLoading(false);
    } catch (err) {
      console.error('Camera access error:', err);
      setErrorMsg(
        'Camera access was denied or is not supported by your browser. Please allow camera permissions in your settings or select an image file to upload.'
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    startCamera(facingMode);

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const handleTakeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);
  };

  const handleConfirmCaptured = () => {
    if (!capturedImage) return;

    // Convert Data URL to File object
    fetch(capturedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `cashew_camera_${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });
        onCapture(file, capturedImage);
        onClose();
      })
      .catch((err) => console.error('Blob conversion error:', err));
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const toggleCameraFacing = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#121816] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0B0F0E]">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Capture Cashew Photo</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport / Error Body */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center space-y-4 max-w-md">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{errorMsg}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-400 transition-colors"
              >
                Close & Browse Files
              </button>
            </div>
          ) : capturedImage ? (
            /* Freeze-frame captured preview */
            <img
              src={capturedImage}
              alt="Captured Cashew"
              className="w-full h-full object-contain"
            />
          ) : (
            /* Live Video Stream */
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Target Alignment Framing Guide */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-56 h-56 border-2 border-dashed border-emerald-400/70 rounded-2xl flex flex-col justify-between p-2 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  <span className="text-[10px] uppercase font-bold text-emerald-300 bg-black/60 px-2 py-0.5 rounded self-center backdrop-blur-sm">
                    Position Cashew Apple & Nut Here
                  </span>
                </div>
              </div>

              {loading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                </div>
              )}
            </>
          )}

          {/* Hidden Canvas for Drawing Frame */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls Bar */}
        {!errorMsg && (
          <div className="px-5 py-4 border-t border-white/10 bg-[#0B0F0E] flex items-center justify-between">
            {capturedImage ? (
              <>
                <button
                  onClick={handleRetake}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retake</span>
                </button>

                <button
                  onClick={handleConfirmCaptured}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Use This Photo</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleCameraFacing}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  title="Switch Camera"
                >
                  <SwitchCamera className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Flip Camera</span>
                </button>

                <button
                  onClick={handleTakeSnapshot}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-xl shadow-emerald-500/30 transition-transform active:scale-95 disabled:opacity-50"
                >
                  <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
                  <span>Capture Photo</span>
                </button>

                <div className="w-16" /> {/* Spacer */}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
