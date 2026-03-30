import { ArrowRight, Briefcase, Search, TrendingUp, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: '#f7f6f3' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display:ital@0;1&display=swap');

        .hero-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 64px 24px 80px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        @media (max-width: 768px) {
          .hero-wrap { grid-template-columns: 1fr; gap: 40px; padding: 48px 20px 64px; }
          .hero-right { order: -1; }
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
        .hero-h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(42px, 5vw, 64px);
          line-height: 1.08;
          color: #1a1816;
          margin: 0 0 20px;
          letter-spacing: -0.02em;
        }
        .hero-h1 em {
          font-style: italic;
          color: #c9b99a;
        }
        .brand-mark {
          display: inline-block;
          position: relative;
        }
        .brand-mark::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 0; right: 0;
          height: 3px;
          background: #c9b99a;
          border-radius: 2px;
          opacity: 0.6;
        }
        .hero-p {
          font-size: 15px;
          line-height: 1.7;
          color: #6b6966;
          max-width: 440px;
          margin: 0 0 32px;
        }
        .stats-row {
          display: flex;
          gap: 32px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }
        .stat-item { display: flex; flex-direction: column; }
        .stat-num {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          color: #1a1816;
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 11px;
          font-weight: 500;
          color: #9b9590;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .stat-divider {
          width: 1px;
          height: 40px;
          background: #e4e3e1;
          align-self: center;
        }
        .cta-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }
        .btn-primary-hero {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 24px;
          background: #1a1816;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          transition: background 0.18s, transform 0.15s;
        }
        .btn-primary-hero:hover { background: #2f2c29; transform: translateY(-1px); }
        .btn-primary-hero .arrow { transition: transform 0.2s; }
        .btn-primary-hero:hover .arrow { transform: translateX(3px); }
        .btn-outline-hero {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 22px;
          background: #fff;
          color: #3d3b38;
          border: 1px solid #e4e3e1;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          transition: border-color 0.18s, color 0.18s, transform 0.15s;
        }
        .btn-outline-hero:hover { border-color: #1a1816; color: #1a1816; transform: translateY(-1px); }
        .trust-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #9b9590;
          font-weight: 500;
        }
        .trust-dot { width: 3px; height: 3px; border-radius: 50%; background: #d4d1cc; }

        /* Right side */
        .hero-right { position: relative; }
        .img-frame {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          aspect-ratio: 4/5;
          max-height: 520px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.14);
        }
        .img-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.6s ease;
        }
        .img-frame:hover img { transform: scale(1.04); }
        .img-frame::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(26,24,22,0.35) 0%, transparent 50%);
          pointer-events: none;
        }

        /* Floating cards */
        .float-card {
          position: absolute;
          background: #fff;
          border: 1px solid #ebebeb;
          border-radius: 14px;
          padding: 12px 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 2;
          backdrop-filter: blur(8px);
        }
        .float-card-1 {
          top: -16px;
          right: -16px;
          min-width: 180px;
        }
        .float-card-2 {
          bottom: 32px;
          left: -20px;
          min-width: 160px;
        }
        .float-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .float-num {
          font-family: 'DM Serif Display', serif;
          font-size: 16px;
          color: #1a1816;
          line-height: 1;
        }
        .float-sub {
          font-size: 10px;
          color: #9b9590;
          font-weight: 500;
          letter-spacing: 0.04em;
          margin-top: 2px;
        }
        .deco-ring {
          position: absolute;
          bottom: -32px;
          right: -32px;
          width: 180px; height: 180px;
          border-radius: 50%;
          border: 1.5px solid #e4e3e1;
          z-index: 0;
          pointer-events: none;
        }
        .deco-ring-inner {
          position: absolute;
          bottom: -8px;
          right: -8px;
          width: 120px; height: 120px;
          border-radius: 50%;
          border: 1px solid #ebebeb;
          z-index: 0;
          pointer-events: none;
        }
        .hero-section-bg {
          background: #f7f6f3;
          position: relative;
          overflow: hidden;
        }
        .hero-section-bg::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(to right, #1a1816 0%, #c9b99a 50%, #1a1816 100%);
        }
      `}</style>

      <div className="hero-section-bg">
        <div className="hero-wrap">

          {/* ── LEFT ── */}
          <div>
            <div className="eyebrow">
              <Sparkles size={10} />
              Nepal's Career Platform
            </div>

            <h1 className="hero-h1">
              Find Your<br />
              <em>Dream Role</em> at{" "}
              <span className="brand-mark">PCareer</span>
            </h1>

            <p className="hero-p">
              Discover opportunities, track applications, and grow your career — all in one platform built to work for you, not against you.
            </p>

            {/* Stats */}
            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-num">99K+</span>
                <span className="stat-label">Active Jobs</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-num">11K+</span>
                <span className="stat-label">Companies</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-num">70K+</span>
                <span className="stat-label">Job Seekers</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="cta-row">
              <Link href="/jobs" className="btn-primary-hero">
                <Search size={15} />
                Browse Jobs
                <ArrowRight size={15} className="arrow" />
              </Link>
              <Link href="/about" className="btn-outline-hero">
                <Briefcase size={15} />
                Learn More
              </Link>
            </div>

            {/* Trust */}
            <div className="trust-row">
              <div className="trust-item">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#9b9590" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Free to use
              </div>
              <div className="trust-dot" />
              <div className="trust-item">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#9b9590" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Verified employers
              </div>
              <div className="trust-dot" />
              <div className="trust-item">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#9b9590" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Secured platform
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="hero-right">
            <div className="deco-ring" />
            <div className="deco-ring-inner" />

            <div className="img-frame">
              <img src="/image2.jpg" alt="Career opportunities" />
            </div>

            {/* Floating card — top right */}
            <div className="float-card float-card-1">
              <div className="float-icon" style={{ background: '#f3f2f0' }}>
                <TrendingUp size={16} color="#1a1816" />
              </div>
              <div>
                <div className="float-num">2,400+</div>
                <div className="float-sub">New this week</div>
              </div>
            </div>

            {/* Floating card — bottom left */}
            <div className="float-card float-card-2">
              <div className="float-icon" style={{ background: '#f3f2f0' }}>
                <MapPin size={16} color="#1a1816" />
              </div>
              <div>
                <div className="float-num">Nationwide</div>
                <div className="float-sub">Remote & on-site</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
