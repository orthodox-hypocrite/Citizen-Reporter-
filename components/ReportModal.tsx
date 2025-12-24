
import React, { useState, useRef } from 'react';
import { analyzeCivicIssue } from '../services/geminiService';
import { AIAnalysisResult, IssueCategory, GeoLocation } from '../types';

interface ReportModalProps {
  onClose: () => void;
  onSubmit: (data: {
    image: string;
    description: string;
    location: GeoLocation;
    aiResult: AIAnalysisResult;
  }) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [location, setLocation] = useState<GeoLocation>({ 
    lat: 40.7128, 
    lng: -74.0060, 
    address: "Detecting location..." 
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setStep(2);
        // Simulate GPS fetch
        setTimeout(() => {
          setLocation({
            lat: 40.7128 + (Math.random() - 0.5) * 0.01,
            lng: -74.0060 + (Math.random() - 0.5) * 0.01,
            address: "Near 240 Broadway, New York, NY"
          });
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image || !description.trim()) {
      alert("Please provide a brief description.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeCivicIssue(image, description);
      setAiResult(result);
      setStep(3);
    } catch (error: any) {
      console.error("AI Analysis failed", error);
      
      // Fallback for when AI fails - don't leave the user stuck!
      const fallbackResult: AIAnalysisResult = {
        category: IssueCategory.OTHER,
        severity: 5,
        confidence: 0,
        verificationStatus: false,
        estimatedImpact: "AI Analysis unavailable. Manual triage requested."
      };
      setAiResult(fallbackResult);
      setStep(3);
      
      if (error.message?.includes("entity was not found")) {
        alert("API Key configuration error. The report will be submitted for manual verification.");
      } else {
        alert("AI analysis took too long. We've switched to manual reporting mode.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (!image || !aiResult) return;
    onSubmit({
      image,
      description,
      location,
      aiResult
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Report Issue</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 rounded-full transition-colors">
            <i className="fas fa-times text-slate-500"></i>
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {step === 1 && (
            <div className="text-center space-y-6 py-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative border-4 border-dashed border-slate-200 rounded-[2.5rem] p-12 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <i className="fas fa-camera text-white text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-black text-slate-800">Visual Evidence</h3>
                  <p className="text-sm text-slate-500 mt-2 font-medium">Take a photo or upload from gallery to start AI verification.</p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <i className="fas fa-microchip text-8xl text-blue-600"></i>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <p className="text-xs text-slate-400 font-medium italic">
                <i className="fas fa-shield-alt mr-1"></i>
                All reports are geo-tagged for precision tracking.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="aspect-video rounded-3xl overflow-hidden bg-slate-100 relative shadow-inner">
                <img src={image!} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setStep(1)}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-slate-800 px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-white transition-colors"
                >
                  <i className="fas fa-redo mr-2"></i> Retake
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase block tracking-widest">Location Tag</span>
                    <span className="text-sm font-bold text-slate-700">{location.address}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Description</label>
                  <textarea 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                    placeholder="E.g., Pothole about 2 feet wide, hazardous for cyclists..."
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !description.trim()}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all ${
                  isAnalyzing || !description.trim() 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 active:scale-[0.98]'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin"></i> Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-brain"></i> AI Analysis & Verify
                  </>
                )}
              </button>
            </div>
          )}

          {step === 3 && aiResult && (
            <div className="space-y-6">
              {aiResult.verificationStatus ? (
                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl flex gap-4 items-center">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
                    <i className="fas fa-check text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-black text-emerald-800 leading-tight">Legitimacy Verified</h4>
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-tight">Classified as: {aiResult.category.replace('_', ' ')}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-100 p-5 rounded-3xl flex gap-4 items-center">
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-100">
                    <i className="fas fa-exclamation-triangle text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-black text-amber-800 leading-tight">Uncertain AI Confidence</h4>
                    <p className="text-xs text-amber-600 font-bold uppercase tracking-tight">Manual Verification Pending</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase font-black tracking-widest mb-2">Severity Impact</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-black ${aiResult.severity > 7 ? 'text-red-500' : 'text-blue-500'}`}>
                      {aiResult.severity}
                    </span>
                    <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-700 ${aiResult.severity > 7 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${aiResult.severity * 10}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase font-black tracking-widest mb-2">AI Confidence</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-700">{aiResult.confidence}%</span>
                    <i className={`fas fa-circle text-[8px] ${aiResult.confidence > 90 ? 'text-emerald-500' : 'text-amber-500'}`}></i>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100 relative overflow-hidden">
                 <div className="relative z-10">
                   <span className="text-[10px] text-blue-500 block uppercase font-black tracking-widest mb-2">AI Summary</span>
                   <p className="text-sm text-slate-700 font-bold leading-relaxed italic">"{aiResult.estimatedImpact}"</p>
                 </div>
                 <i className="fas fa-quote-right absolute -bottom-2 -right-2 text-6xl text-blue-500/5"></i>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl transition-all"
                >
                  Edit Report
                </button>
                <button 
                  onClick={handleSubmit}
                  className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-200 active:scale-[0.98]"
                >
                  Submit Official Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
