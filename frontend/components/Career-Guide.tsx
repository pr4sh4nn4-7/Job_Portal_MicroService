"use client"
import { ICarreerGuidResponse } from "@/type"
import axios from "axios"
import { ArrowRight, BookOpen, Briefcase, Lightbulb, Loader2, Sparkles, Target, TrendingUp, X, Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "react-toastify"

const CareerGuide = () => {
  const [open, setOpen] = useState(false)
  const [skills, setSkills] = useState<string[]>([])
  const [currentSkill, setCurrentSkill] = useState("")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ICarreerGuidResponse | null>(null)

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()])
      setCurrentSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addSkill()
  }

  const getCarrerGuidance = async () => {
    if (skills.length === 0) { toast.error("Please add at least one skill"); return }
    setLoading(true)
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_UTILS_SERVICE}/career`, { skills })
      setResponse(data.data)
      toast.success("Career data successfully generated")
    } catch (err: any) {
      toast.error(err.response.data.message || "Career Guidance Failed")
    } finally {
      setLoading(false)
    }
  }

  const resetDialog = () => {
    setSkills([]); setCurrentSkill(""); setResponse(null); setOpen(false)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display:ital@0;1&display=swap');

        /* ── Section ── */
        .cg-section {
          background: #1a1816;
          position: relative;
          overflow: hidden;
          padding: 88px 24px;
        }
        .cg-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
        }
        .cg-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(201,185,154,0.1);
          pointer-events: none;
        }
        .cg-ring-1 { width: 500px; height: 500px; top: -200px; right: -150px; }
        .cg-ring-2 { width: 300px; height: 300px; top: -100px; right: -50px; }
        .cg-ring-3 { width: 400px; height: 400px; bottom: -200px; left: -120px; }

        .cg-inner {
          position: relative;
          z-index: 1;
          max-width: 680px;
          margin: 0 auto;
          text-align: center;
        }
        .cg-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(201,185,154,0.12);
          border: 1px solid rgba(201,185,154,0.2);
          color: #c9b99a;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .cg-h2 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(36px, 4.5vw, 54px);
          line-height: 1.1;
          color: #fff;
          letter-spacing: -0.02em;
          margin: 0 0 16px;
        }
        .cg-h2 em { font-style: italic; color: #c9b99a; }
        .cg-p {
          font-size: 15px;
          line-height: 1.7;
          color: #6b6966;
          margin: 0 0 36px;
        }
        .cg-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 14px 28px;
          background: #c9b99a;
          color: #1a1816;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.18s, transform 0.15s;
          letter-spacing: 0.01em;
        }
        .cg-trigger-btn:hover { background: #d4c8b0; transform: translateY(-1px); }
        .cg-trigger-btn .arrow { transition: transform 0.2s; }
        .cg-trigger-btn:hover .arrow { transform: translateX(3px); }

        /* ── Modal overlay ── */
        .cg-overlay {
          position: fixed;
          inset: 0;
          background: rgba(26,24,22,0.6);
          backdrop-filter: blur(6px);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: cgFadeIn 0.2s ease;
        }
        @keyframes cgFadeIn { from { opacity: 0 } to { opacity: 1 } }

        .cg-modal {
          background: #fff;
          border-radius: 24px;
          width: 100%;
          max-width: 680px;
          max-height: 88vh;
          overflow-y: auto;
          box-shadow: 0 32px 80px rgba(0,0,0,0.25);
          animation: cgSlideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1);
        }
        @keyframes cgSlideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }

        .cg-modal-header {
          padding: 28px 28px 0;
          position: sticky;
          top: 0;
          background: #fff;
          z-index: 2;
          border-bottom: 1px solid #f0efed;
          padding-bottom: 20px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }
        .cg-modal-title {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: #1a1816;
          margin: 0 0 4px;
        }
        .cg-modal-sub {
          font-size: 13px;
          color: #9b9590;
          margin: 0;
        }
        .cg-close {
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 1px solid #e4e3e1;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b6966;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .cg-close:hover { background: #f3f2f0; color: #1a1816; border-color: #1a1816; }

        .cg-modal-body { padding: 24px 28px 28px; }

        /* Input area */
        .cg-input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        .cg-input {
          flex: 1;
          padding: 11px 14px;
          border: 1px solid #e4e3e1;
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          background: #fafafa;
          color: #1a1816;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .cg-input:focus {
          border-color: #1a1816;
          box-shadow: 0 0 0 3px rgba(26,24,22,0.06);
          background: #fff;
        }
        .cg-input::placeholder { color: #b5b2ac; }
        .cg-add-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 11px 16px;
          background: #1a1816;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          transition: background 0.15s;
        }
        .cg-add-btn:hover { background: #2f2c29; }

        /* Skill chips */
        .cg-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .cg-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 8px 6px 12px;
          border-radius: 999px;
          background: #f3f2f0;
          border: 1px solid #e4e3e1;
          font-size: 13px;
          font-weight: 500;
          color: #3d3b38;
        }
        .cg-chip-remove {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #1a1816;
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: background 0.15s;
          flex-shrink: 0;
        }
        .cg-chip-remove:hover { background: #c0392b; }

        /* Generate btn */
        .cg-generate-btn {
          width: 100%;
          padding: 13px;
          background: #1a1816;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s, opacity 0.15s;
        }
        .cg-generate-btn:hover:not(:disabled) { background: #2f2c29; }
        .cg-generate-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Response styles ── */
        .cg-summary-box {
          background: #f7f6f3;
          border: 1px solid #e4e3e1;
          border-radius: 14px;
          padding: 18px;
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }
        .cg-summary-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: #1a1816;
          color: #c9b99a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .cg-section-title {
          font-size: 14px;
          font-weight: 700;
          color: #1a1816;
          margin: 0 0 6px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cg-section-icon {
          width: 28px; height: 28px;
          border-radius: 8px;
          background: #f3f2f0;
          color: #1a1816;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .cg-block-title {
          font-family: 'DM Serif Display', serif;
          font-size: 16px;
          color: #1a1816;
          margin: 0 0 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cg-job-card {
          border: 1px solid #ebebeb;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 10px;
          transition: border-color 0.18s, box-shadow 0.18s;
          background: #fafafa;
        }
        .cg-job-card:hover { border-color: #1a1816; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .cg-job-title {
          font-size: 14px;
          font-weight: 600;
          color: #1a1816;
          margin: 0 0 10px;
        }
        .cg-meta-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: #9b9590;
          margin-bottom: 3px;
          display: block;
        }
        .cg-meta-val {
          font-size: 13px;
          color: #4a4845;
          line-height: 1.55;
          margin-bottom: 10px;
          display: block;
        }
        .cg-cat-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #c9b99a;
          background: #1a1816;
          display: inline-block;
          padding: 3px 10px;
          border-radius: 999px;
          margin-bottom: 10px;
        }
        .cg-skill-card {
          border: 1px solid #ebebeb;
          border-radius: 10px;
          padding: 14px;
          margin-bottom: 8px;
          background: #fafafa;
        }
        .cg-skill-name {
          font-size: 13px;
          font-weight: 600;
          color: #1a1816;
          margin: 0 0 6px;
        }
        .cg-skill-row {
          font-size: 12px;
          color: #6b6966;
          margin-bottom: 4px;
          line-height: 1.5;
        }
        .cg-skill-row strong { color: #3d3b38; }
        .cg-learning-box {
          background: #1a1816;
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .cg-learning-title {
          font-family: 'DM Serif Display', serif;
          font-size: 16px;
          color: #fff;
          margin: 0 0 14px;
          display: flex;
          align-items: center;
          gap: 9px;
        }
        .cg-learning-point {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 10px;
          font-size: 13px;
          color: #9b9590;
          line-height: 1.6;
        }
        .cg-learning-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #c9b99a;
          margin-top: 7px;
          flex-shrink: 0;
        }
        .cg-reset-btn {
          width: 100%;
          padding: 12px;
          background: transparent;
          color: #6b6966;
          border: 1px solid #e4e3e1;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .cg-reset-btn:hover { border-color: #1a1816; color: #1a1816; }
        .cg-divider { height: 1px; background: #f0efed; margin: 20px 0; }
        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #9b9590;
          margin-bottom: 8px;
        }
      `}</style>

      {/* ── Section ── */}
      <div className="cg-section">
        <div className="cg-ring cg-ring-1" />
        <div className="cg-ring cg-ring-2" />
        <div className="cg-ring cg-ring-3" />

        <div className="cg-inner">
          <div className="cg-eyebrow">
            <Sparkles size={10} />
            AI-Powered Career Guidance
          </div>
          <h2 className="cg-h2">
            Discover Your<br />
            <em>Career Path</em>
          </h2>
          <p className="cg-p">
            Get personalized job recommendations and learning roadmaps based on the skills you already have.
          </p>
          <button className="cg-trigger-btn" onClick={() => setOpen(true)}>
            <Sparkles size={15} />
            Get Career Guidance
            <ArrowRight size={15} className="arrow" />
          </button>
        </div>
      </div>

      {/* ── Modal ── */}
      {open && (
        <div className="cg-overlay" onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div className="cg-modal">

            {/* Header */}
            <div className="cg-modal-header">
              <div>
                <p className="cg-modal-title">
                  {response ? 'Your Career Guide' : 'Tell us your skills'}
                </p>
                <p className="cg-modal-sub">
                  {response
                    ? 'Personalized recommendations based on your profile'
                    : 'Add your skills to receive tailored career recommendations'}
                </p>
              </div>
              <button className="cg-close" onClick={resetDialog}><X size={14} /></button>
            </div>

            <div className="cg-modal-body">
              {!response ? (
                <>
                  <label className="field-label">Add a skill</label>
                  <div className="cg-input-row">
                    <input
                      className="cg-input"
                      placeholder="e.g. React, Node.js, Python…"
                      value={currentSkill}
                      onChange={e => setCurrentSkill(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <button className="cg-add-btn" onClick={addSkill}>
                      <Plus size={14} /> Add
                    </button>
                  </div>

                  {skills.length > 0 && (
                    <>
                      <label className="field-label">Your skills ({skills.length})</label>
                      <div className="cg-chips">
                        {skills.map(s => (
                          <div key={s} className="cg-chip">
                            {s}
                            <button className="cg-chip-remove" onClick={() => removeSkill(s)}>
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <button
                    className="cg-generate-btn"
                    onClick={getCarrerGuidance}
                    disabled={loading || skills.length === 0}
                  >
                    {loading ? (
                      <><Loader2 size={15} className="animate-spin" /> Analyzing your skills…</>
                    ) : (
                      <><Sparkles size={15} /> Generate Career Guidance</>
                    )}
                  </button>
                </>
              ) : (
                <>
                  {/* Summary */}
                  <div className="cg-summary-box">
                    <div className="cg-summary-icon"><Lightbulb size={16} /></div>
                    <div>
                      <p className="cg-section-title">Career Summary</p>
                      <p style={{ fontSize: 13, color: '#4a4845', lineHeight: 1.65, margin: 0 }}>
                        {response.summary}
                      </p>
                    </div>
                  </div>

                  <div className="cg-divider" />

                  {/* Job Options */}
                  <p className="cg-block-title">
                    <span className="cg-section-icon"><Briefcase size={14} /></span>
                    Recommended Career Paths
                  </p>
                  {response.jobOptions.map((job, i) => (
                    <div className="cg-job-card" key={i}>
                      <p className="cg-job-title">{job.title}</p>
                      <span className="cg-meta-label">Responsibilities</span>
                      <span className="cg-meta-val">{job.responsibilities}</span>
                      <span className="cg-meta-label">Why this role?</span>
                      <span className="cg-meta-val" style={{ marginBottom: 0 }}>{job.why}</span>
                    </div>
                  ))}

                  <div className="cg-divider" />

                  {/* Skills to Learn */}
                  <p className="cg-block-title">
                    <span className="cg-section-icon"><TrendingUp size={14} /></span>
                    Skills to Uplift Your Career
                  </p>
                  {response.skillsToLearn.map((category, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <span className="cg-cat-label">{category.category}</span>
                      {category.skills.map((skill, si) => (
                        <div className="cg-skill-card" key={si}>
                          <p className="cg-skill-name">{skill.title}</p>
                          <p className="cg-skill-row"><strong>Why: </strong>{skill.why}</p>
                          <p className="cg-skill-row" style={{ marginBottom: 0 }}><strong>How: </strong>{skill.how}</p>
                        </div>
                      ))}
                    </div>
                  ))}

                  <div className="cg-divider" />

                  {/* Learning Approach */}
                  <div className="cg-learning-box">
                    <p className="cg-learning-title">
                      <BookOpen size={16} color="#c9b99a" />
                      {response.learningApproach.title}
                    </p>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                      {response.learningApproach.points.map((pnt, i) => (
                        <li key={i} className="cg-learning-point">
                          <span className="cg-learning-dot" />
                          <span dangerouslySetInnerHTML={{ __html: pnt }} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="cg-reset-btn" onClick={resetDialog}>
                    Start New Analysis
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CareerGuide
