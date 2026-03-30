"use client";
import React, { useState, useRef } from "react";
import {
  FileText, Upload, CheckCircle2, AlertTriangle,
  TrendingUp, Loader2, ArrowRight, FileCheck, Zap, X
} from "lucide-react";
import axios from "axios";
import { ResumeAnalysisResponse } from "@/type";
import { toast } from "react-toastify";

const getScoreColor = (score: number) => {
  if (score >= 80) return "#16a34a";
  if (score >= 60) return "#d97706";
  return "#dc2626";
};
const getScoreBg = (score: number) => {
  if (score >= 80) return { bg: "#f0fdf4", border: "#bbf7d0" };
  if (score >= 60) return { bg: "#fffbeb", border: "#fde68a" };
  return { bg: "#fef2f2", border: "#fecaca" };
};
const getPriorityStyle = (priority: string) => {
  if (priority === "high") return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
  if (priority === "medium") return { bg: "#fffbeb", color: "#d97706", border: "#fde68a" };
  return { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" };
};

const ResumeAnalyzer = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ResumeAnalysisResponse | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") { toast.error("Please upload a PDF file"); return; }
    if (selectedFile.size > 5 * 1024 * 1024) { toast.error("File size should be less than 5MB"); return; }
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    if (dropped.type !== "application/pdf") { toast.error("Please upload a PDF file"); return; }
    if (dropped.size > 5 * 1024 * 1024) { toast.error("File size should be less than 5MB"); return; }
    setFile(dropped);
  };

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const analyzeResume = async () => {
    if (!file) { toast.error("Please upload a resume"); return; }
    setLoading(true);
    try {
      const base64 = await convertToBase64(file);
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_UTILS_SERVICE}/resume-analyzer`, { pdfBase64: base64 });
      setResponse(data.data);
      toast.success("Resume analyzed successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setFile(null); setResponse(null); setOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display:ital@0;1&display=swap');

        /* ── Banner ── */
        .ra-section {
          background: #f7f6f3;
          border-top: 1px solid #ebebeb;
          border-bottom: 1px solid #ebebeb;
          padding: 88px 24px;
          position: relative;
          overflow: hidden;
        }
        .ra-section::before {
          content: '';
          position: absolute;
          top: -80px; left: 50%;
          transform: translateX(-50%);
          width: 700px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(201,185,154,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .ra-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; text-align: center; }
        .ra-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 14px;
          border-radius: 999px;
          background: #1a1816;
          color: #c9b99a;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .ra-h2 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(34px, 4vw, 50px);
          line-height: 1.1;
          color: #1a1816;
          letter-spacing: -0.02em;
          margin: 0 0 16px;
        }
        .ra-h2 em { font-style: italic; color: #c9b99a; }
        .ra-p { font-size: 15px; color: #6b6966; line-height: 1.7; margin: 0 0 32px; }
        .ra-trigger-btn {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 14px 28px; background: #1a1816; color: #fff;
          border: none; border-radius: 12px; font-size: 14px; font-weight: 700;
          cursor: pointer; font-family: inherit; text-decoration: none;
          transition: background 0.18s, transform 0.15s; letter-spacing: 0.01em;
        }
        .ra-trigger-btn:hover { background: #2f2c29; transform: translateY(-1px); }
        .ra-trigger-btn .arrow { transition: transform 0.2s; }
        .ra-trigger-btn:hover .arrow { transform: translateX(3px); }

        /* ── Overlay / Modal ── */
        .ra-overlay {
          position: fixed; inset: 0;
          background: rgba(26,24,22,0.6); backdrop-filter: blur(6px);
          z-index: 50; display: flex; align-items: center; justify-content: center;
          padding: 20px; animation: raFadeIn 0.2s ease;
        }
        @keyframes raFadeIn { from { opacity: 0 } to { opacity: 1 } }
        .ra-modal {
          background: #fff; border-radius: 24px; width: 100%; max-width: 700px;
          max-height: 88vh; overflow-y: auto;
          box-shadow: 0 32px 80px rgba(0,0,0,0.25);
          animation: raSlideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1);
        }
        @keyframes raSlideUp { from { opacity:0; transform: translateY(24px) } to { opacity:1; transform: translateY(0) } }
        .ra-modal-header {
          padding: 28px 28px 20px;
          border-bottom: 1px solid #f0efed;
          display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
          position: sticky; top: 0; background: #fff; z-index: 2;
        }
        .ra-modal-title {
          font-family: 'DM Serif Display', serif;
          font-size: 22px; color: #1a1816; margin: 0 0 4px;
        }
        .ra-modal-sub { font-size: 13px; color: #9b9590; margin: 0; }
        .ra-close {
          width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e4e3e1;
          background: transparent; cursor: pointer; display: flex;
          align-items: center; justify-content: center; color: #6b6966;
          transition: all 0.15s; flex-shrink: 0;
        }
        .ra-close:hover { background: #f3f2f0; color: #1a1816; border-color: #1a1816; }
        .ra-modal-body { padding: 24px 28px 28px; }

        /* Upload zone */
        .ra-dropzone {
          border: 2px dashed #e4e3e1; border-radius: 16px;
          padding: 48px 24px; text-align: center; cursor: pointer;
          transition: border-color 0.18s, background 0.18s;
          margin-bottom: 16px;
        }
        .ra-dropzone:hover, .ra-dropzone.drag-over {
          border-color: #1a1816; background: #f7f6f3;
        }
        .ra-dropzone.has-file { border-color: #16a34a; background: #f0fdf4; border-style: solid; }
        .ra-upload-icon {
          width: 64px; height: 64px; border-radius: 16px;
          background: #f3f2f0; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px; transition: background 0.18s;
        }
        .ra-dropzone:hover .ra-upload-icon, .ra-dropzone.drag-over .ra-upload-icon { background: #1a1816; }
        .ra-dropzone:hover .ra-upload-icon svg, .ra-dropzone.drag-over .ra-upload-icon svg { color: #fff !important; }
        .ra-dropzone.has-file .ra-upload-icon { background: #dcfce7; }
        .ra-file-name { font-size: 14px; font-weight: 600; color: #1a1816; margin-bottom: 4px; }
        .ra-file-sub { font-size: 12px; color: #9b9590; }
        .ra-success-row { display: flex; align-items: center; justify-content: center; gap: 6px; color: #16a34a; font-size: 13px; font-weight: 500; margin-top: 10px; }

        /* Buttons */
        .ra-primary-btn {
          width: 100%; padding: 13px; background: #1a1816; color: #fff;
          border: none; border-radius: 12px; font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: inherit; display: flex;
          align-items: center; justify-content: center; gap: 8px;
          transition: background 0.15s, opacity 0.15s;
        }
        .ra-primary-btn:hover:not(:disabled) { background: #2f2c29; }
        .ra-primary-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .ra-ghost-btn {
          width: 100%; padding: 12px; background: transparent; color: #6b6966;
          border: 1px solid #e4e3e1; border-radius: 10px; font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: inherit; transition: all 0.15s;
        }
        .ra-ghost-btn:hover { border-color: #1a1816; color: #1a1816; }

        /* Response */
        .ra-score-ring-wrap { text-align: center; padding: 28px; border-radius: 20px; margin-bottom: 20px; }
        .ra-score-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #9b9590; margin-bottom: 8px; }
        .ra-score-num { font-family: 'DM Serif Display', serif; font-size: 72px; line-height: 1; margin-bottom: 4px; }
        .ra-score-sub { font-size: 13px; color: #9b9590; }

        .ra-summary-box {
          background: #f7f6f3; border: 1px solid #e4e3e1;
          border-radius: 14px; padding: 16px; margin-bottom: 20px;
          font-size: 13px; color: #4a4845; line-height: 1.65;
        }
        .ra-block-title {
          font-family: 'DM Serif Display', serif; font-size: 17px;
          color: #1a1816; margin: 0 0 14px;
          display: flex; align-items: center; gap: 10px;
        }
        .ra-block-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: #f3f2f0; color: #1a1816;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ra-breakdown-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        @media (max-width: 480px) { .ra-breakdown-grid { grid-template-columns: 1fr; } }
        .ra-breakdown-card {
          border: 1px solid #ebebeb; border-radius: 12px; padding: 14px; background: #fafafa;
        }
        .ra-breakdown-key { font-size: 12px; font-weight: 600; color: #1a1816; text-transform: capitalize; margin-bottom: 4px; }
        .ra-breakdown-score { font-family: 'DM Serif Display', serif; font-size: 22px; margin-bottom: 4px; }
        .ra-breakdown-feedback { font-size: 11px; color: #9b9590; line-height: 1.5; }

        .ra-strengths-box {
          background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 14px; padding: 16px 18px; margin-bottom: 20px;
        }
        .ra-strength-item { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: #1a1816; margin-bottom: 8px; line-height: 1.55; }
        .ra-strength-item:last-child { margin-bottom: 0; }

        .ra-suggestion-card {
          border: 1px solid #ebebeb; border-radius: 12px; padding: 16px;
          margin-bottom: 10px; background: #fafafa; transition: border-color 0.18s;
        }
        .ra-suggestion-card:hover { border-color: #d4d1cc; }
        .ra-suggestion-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
        .ra-suggestion-cat { font-size: 13px; font-weight: 600; color: #1a1816; }
        .ra-priority-badge {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; padding: 3px 10px;
          border-radius: 999px; border: 1px solid; flex-shrink: 0;
        }
        .ra-meta-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: #9b9590; margin-bottom: 3px; display: block; }
        .ra-meta-val { font-size: 13px; color: #4a4845; line-height: 1.55; margin-bottom: 10px; }
        .ra-meta-val:last-child { margin-bottom: 0; }
        .ra-divider { height: 1px; background: #f0efed; margin: 20px 0; }
      `}</style>

      {/* ── Banner ── */}
      <div className="ra-section">
        <div className="ra-inner">
          <div className="ra-eyebrow">
            <FileCheck size={10} />
            AI-Powered ATS Analysis
          </div>
          <h2 className="ra-h2">
            Optimize Your Resume<br />
            for <em>ATS Success</em>
          </h2>
          <p className="ra-p">
            Get instant feedback on your resume's compatibility with Applicant Tracking Systems and land more interviews.
          </p>
          <button className="ra-trigger-btn" onClick={() => setOpen(true)}>
            <FileText size={15} />
            Analyze My Resume
            <ArrowRight size={15} className="arrow" />
          </button>
        </div>
      </div>

      {/* ── Modal ── */}
      {open && (
        <div className="ra-overlay" onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div className="ra-modal">

            {/* Header */}
            <div className="ra-modal-header">
              <div>
                <p className="ra-modal-title">
                  {response ? 'Resume Analysis' : 'Upload Your Resume'}
                </p>
                <p className="ra-modal-sub">
                  {response
                    ? `Here's how your resume performs against ATS systems`
                    : 'PDF format only · Max 5MB · Instant AI feedback'}
                </p>
              </div>
              <button className="ra-close" onClick={resetDialog}><X size={14} /></button>
            </div>

            <div className="ra-modal-body">
              {!response ? (
                <>
                  {/* Drop zone */}
                  <div
                    className={`ra-dropzone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <div className="ra-upload-icon">
                      {file
                        ? <CheckCircle2 size={28} color="#16a34a" />
                        : <Upload size={28} color="#6b6966" />}
                    </div>
                    <p className="ra-file-name">
                      {file ? file.name : 'Drop your resume here or click to browse'}
                    </p>
                    <p className="ra-file-sub">PDF format · Maximum 5MB</p>
                    {file && (
                      <div className="ra-success-row">
                        <CheckCircle2 size={14} /> Ready to analyze
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileSelect} className="hidden" />

                  <button className="ra-primary-btn" onClick={analyzeResume} disabled={loading || !file}>
                    {loading
                      ? <><Loader2 size={15} className="animate-spin" /> Analyzing your resume…</>
                      : <><Zap size={15} /> Analyze Resume</>}
                  </button>
                </>
              ) : (
                <>
                  {/* Score */}
                  <div
                    className="ra-score-ring-wrap"
                    style={{ background: getScoreBg(response.atsScore).bg, border: `1px solid ${getScoreBg(response.atsScore).border}` }}
                  >
                    <p className="ra-score-label">ATS Compatibility Score</p>
                    <p className="ra-score-num" style={{ color: getScoreColor(response.atsScore) }}>
                      {response.atsScore}
                    </p>
                    <p className="ra-score-sub">out of 100</p>
                  </div>

                  {/* Summary */}
                  <div className="ra-summary-box">{response.summary}</div>

                  <div className="ra-divider" />

                  {/* Breakdown */}
                  <p className="ra-block-title">
                    <span className="ra-block-icon"><TrendingUp size={14} /></span>
                    Score Breakdown
                  </p>
                  <div className="ra-breakdown-grid">
                    {Object.entries(response.scoreBreakdown).map(([key, value]) => (
                      <div className="ra-breakdown-card" key={key}>
                        <p className="ra-breakdown-key">{key}</p>
                        <p className="ra-breakdown-score" style={{ color: getScoreColor(value.score) }}>
                          {value.score}%
                        </p>
                        <p className="ra-breakdown-feedback">{value.feedback}</p>
                      </div>
                    ))}
                  </div>

                  <div className="ra-divider" />

                  {/* Strengths */}
                  <p className="ra-block-title">
                    <span className="ra-block-icon"><CheckCircle2 size={14} /></span>
                    What Your Resume Does Well
                  </p>
                  <div className="ra-strengths-box">
                    {response.strengths?.map((s, i) => (
                      <div key={i} className="ra-strength-item">
                        <CheckCircle2 size={14} color="#16a34a" style={{ marginTop: 2, flexShrink: 0 }} />
                        {s}
                      </div>
                    ))}
                  </div>

                  <div className="ra-divider" />

                  {/* Suggestions */}
                  <p className="ra-block-title">
                    <span className="ra-block-icon"><AlertTriangle size={14} /></span>
                    Recommendations
                  </p>
                  {response.suggestions.map((s, i) => {
                    const ps = getPriorityStyle(s.priority);
                    return (
                      <div key={i} className="ra-suggestion-card">
                        <div className="ra-suggestion-header">
                          <p className="ra-suggestion-cat">{s.category}</p>
                          <span
                            className="ra-priority-badge"
                            style={{ background: ps.bg, color: ps.color, borderColor: ps.border }}
                          >
                            {s.priority}
                          </span>
                        </div>
                        <span className="ra-meta-label">Issue</span>
                        <p className="ra-meta-val">{s.issue}</p>
                        <span className="ra-meta-label">Fix</span>
                        <p className="ra-meta-val">{s.recommendation}</p>
                      </div>
                    );
                  })}

                  <div className="ra-divider" />
                  <button className="ra-ghost-btn" onClick={resetDialog}>
                    Analyze Another Resume
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
