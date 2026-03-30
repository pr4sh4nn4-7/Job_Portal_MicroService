import Link from "next/link";
import { ArrowRight, Target, Users, Zap, Globe } from "lucide-react";

const values = [
  {
    icon: <Target size={18} />,
    title: "Mission-Driven",
    body: "Every feature we build serves one goal — getting the right people into the right roles, faster.",
  },
  {
    icon: <Users size={18} />,
    title: "People First",
    body: "We treat job seekers and recruiters as partners, not just users. Their success is our success.",
  },
  {
    icon: <Zap size={18} />,
    title: "Built for Speed",
    body: "From search to offer letter, we remove every unnecessary step in the hiring journey.",
  },
  {
    icon: <Globe size={18} />,
    title: "Nepal-Native",
    body: "Built specifically for the Nepali job market — with local insight, local partners, and local ambition.",
  },
];

const About = () => {
  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: '#f7f6f3' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display:ital@0;1&display=swap');

        .about-hero {
          max-width: 1100px;
          margin: 0 auto;
          padding: 72px 24px 80px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        @media (max-width: 768px) {
          .about-hero { grid-template-columns: 1fr; gap: 40px; padding: 48px 20px 64px; }
        }

        .section-card {
          background: #fff;
          border: 1px solid #ebebeb;
          border-radius: 20px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.04);
        }

        .eyebrow {
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
        .about-h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(36px, 4.5vw, 54px);
          line-height: 1.1;
          color: #1a1816;
          letter-spacing: -0.02em;
          margin: 0 0 20px;
        }
        .about-h1 em {
          font-style: italic;
          color: #c9b99a;
        }
        .about-p {
          font-size: 15px;
          line-height: 1.75;
          color: #6b6966;
          margin: 0 0 32px;
        }
        .img-frame {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.12);
          aspect-ratio: 1/1;
        }
        .img-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }
        .img-frame:hover img { transform: scale(1.03); }
        .img-frame::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(26,24,22,0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .img-badge {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px);
          border: 1px solid #ebebeb;
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          z-index: 2;
        }
        .badge-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: #1a1816;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c9b99a;
          flex-shrink: 0;
        }
        .badge-num {
          font-family: 'DM Serif Display', serif;
          font-size: 18px;
          color: #1a1816;
          line-height: 1;
        }
        .badge-sub {
          font-size: 10px;
          color: #9b9590;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-top: 2px;
        }

        /* Values */
        .values-section {
          background: #fff;
          border-top: 1px solid #ebebeb;
          border-bottom: 1px solid #ebebeb;
          padding: 72px 24px;
        }
        .values-inner { max-width: 1100px; margin: 0 auto; }
        .values-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 16px;
        }
        .value-card {
          background: #fafafa;
          border: 1px solid #ebebeb;
          border-radius: 16px;
          padding: 24px;
          transition: box-shadow 0.2s ease, transform 0.18s ease, border-color 0.18s;
        }
        .value-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.07);
          transform: translateY(-2px);
          border-color: #d4d1cc;
        }
        .value-icon {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: #1a1816;
          color: #c9b99a;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .value-title {
          font-size: 15px;
          font-weight: 600;
          color: #1a1816;
          margin: 0 0 8px;
        }
        .value-body {
          font-size: 13px;
          line-height: 1.65;
          color: #6b6966;
          margin: 0;
        }

        /* CTA */
        .cta-section {
          background: #1a1816;
          position: relative;
          overflow: hidden;
          padding: 80px 24px;
        }
        .cta-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          mask-image: linear-gradient(to right, transparent, black 30%, black 70%, transparent);
        }
        .cta-section::after {
          content: '';
          position: absolute;
          top: -120px; right: -80px;
          width: 360px; height: 360px;
          border-radius: 50%;
          border: 1px solid rgba(201,185,154,0.12);
          pointer-events: none;
        }
        .cta-inner {
          position: relative;
          z-index: 1;
          max-width: 640px;
          margin: 0 auto;
          text-align: center;
        }
        .cta-h2 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(32px, 4vw, 50px);
          color: #fff;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 16px;
        }
        .cta-h2 em { font-style: italic; color: #c9b99a; }
        .cta-p {
          font-size: 15px;
          color: #6b6966;
          line-height: 1.65;
          margin: 0 0 36px;
        }
        .cta-btn {
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
          text-decoration: none;
          transition: background 0.18s, transform 0.15s;
          letter-spacing: 0.01em;
        }
        .cta-btn:hover { background: #d4c8b0; transform: translateY(-1px); }
        .cta-btn .arrow { transition: transform 0.2s; }
        .cta-btn:hover .arrow { transform: translateX(3px); }
        .cta-trust {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-top: 24px;
          flex-wrap: wrap;
        }
        .cta-trust-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #5a5753;
          font-weight: 500;
        }
        .cta-trust-dot { width: 3px; height: 3px; border-radius: 50%; background: #3d3b38; }

        .section-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9b9590;
          margin-bottom: 12px;
        }
        .section-h2 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 3vw, 40px);
          color: #1a1816;
          letter-spacing: -0.02em;
          margin: 0;
          line-height: 1.15;
        }
        .section-h2 em { font-style: italic; color: #c9b99a; }
      `}</style>

      {/* ── MISSION ── */}
      <div>
        <div className="about-hero">
          {/* Image */}
          <div className="img-frame">
            <img src="/about.png" alt="About PCareer" />
            <div className="img-badge">
              <div className="badge-icon">
                <Users size={16} />
              </div>
              <div>
                <div className="badge-num">70K+</div>
                <div className="badge-sub">Job seekers</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="eyebrow">Our Story</div>
            <h1 className="about-h1">
              Our Mission<br />
              at <em>PCareer</em>
            </h1>
            <p className="about-p">
              At PCareer, we're dedicated to revolutionizing the job search experience. Our mission is to create meaningful connections between talented individuals and forward-thinking companies, fostering growth and success for both.
            </p>
            <p className="about-p" style={{ marginBottom: 0 }}>
              We believe every person deserves work that fulfills them, and every company deserves a team that drives them forward. That belief shapes everything we build.
            </p>
          </div>
        </div>
      </div>

      {/* ── VALUES ── */}
      <div className="values-section">
        <div className="values-inner">
          <div className="values-header">
            <p className="section-label">What we stand for</p>
            <h2 className="section-h2">
              Built on <em>principles</em> that matter
            </h2>
          </div>
          <div className="values-grid">
            {values.map(v => (
              <div key={v.title} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <p className="value-title">{v.title}</p>
                <p className="value-body">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="cta-section">
        <div className="cta-inner">
          <p className="section-label" style={{ color: '#5a5753' }}>Start today</p>
          <h2 className="cta-h2">
            Ready to find your<br />
            <em>dream role?</em>
          </h2>
          <p className="cta-p">
            Join thousands of successful job seekers on PCareer — Nepal's most trusted career platform.
          </p>
          <Link href="/jobs" className="cta-btn">
            Get Started
            <ArrowRight size={15} className="arrow" />
          </Link>
          <div className="cta-trust">
            <div className="cta-trust-item">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#5a5753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Free to use
            </div>
            <div className="cta-trust-dot" />
            <div className="cta-trust-item">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#5a5753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Verified employers
            </div>
            <div className="cta-trust-dot" />
            <div className="cta-trust-item">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#5a5753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Secured platform
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
