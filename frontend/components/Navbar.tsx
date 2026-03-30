"use client"

import Link from "next/link"
import { useState } from "react"
import { Briefcase, Home, Info, LogOut, Menu, User, X, ChevronDown } from "lucide-react"
import { UseAppData } from "@/context/AppContext"

const navLinks = [
  { href: "/", label: "Home", icon: <Home size={14} /> },
  { href: "/jobs", label: "Jobs", icon: <Briefcase size={14} /> },
  { href: "/about", label: "About", icon: <Info size={14} /> },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const { isAuth, logoutUser, user, loading } = UseAppData()

  const logoutHandler = () => { logoutUser(); setAvatarOpen(false) }

  return (
    <nav style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display:ital@0;1&display=swap');

        .nb-root {
          position: sticky;
          top: 0;
          z-index: 50;
          height: 60px;
          background: rgba(247,246,243,0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #ebebeb;
          box-shadow: 0 1px 0 rgba(0,0,0,0.04);
        }
        .nb-inner {
          max-width: 1100px;
          margin: 0 auto;
          height: 100%;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* Logo */
        .nb-logo {
          display: flex;
          align-items: center;
          gap: 1px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .nb-logo-p {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: #1a1816;
          line-height: 1;
        }
        .nb-logo-career {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          font-style: italic;
          color: #c9b99a;
          line-height: 1;
        }
        .nb-logo:hover .nb-logo-p { color: #2f2c29; }

        /* Desktop nav links */
        .nb-links {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .nb-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #6b6966;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
        }
        .nb-link:hover { background: #f0efed; color: #1a1816; }
        .nb-link.active { color: #1a1816; font-weight: 600; }

        /* Right actions */
        .nb-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        /* Sign in btn */
        .nb-signin-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 18px;
          background: #1a1816;
          color: #fff;
          border: none;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          transition: background 0.15s;
        }
        .nb-signin-btn:hover { background: #2f2c29; }

        /* Avatar button */
        .nb-avatar-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px 4px 4px;
          border: 1px solid #e4e3e1;
          border-radius: 999px;
          background: #fff;
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s;
          font-family: inherit;
        }
        .nb-avatar-trigger:hover { border-color: #1a1816; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .nb-avatar-img {
          width: 28px; height: 28px;
          border-radius: 50%;
          object-fit: cover;
          background: #f3f2f0;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; color: #1a1816;
          overflow: hidden; flex-shrink: 0;
        }
        .nb-avatar-name {
          font-size: 13px;
          font-weight: 500;
          color: #1a1816;
          max-width: 80px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Avatar dropdown */
        .nb-popover-wrap { position: relative; }
        .nb-popover {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 220px;
          background: #fff;
          border: 1px solid #ebebeb;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          z-index: 100;
          overflow: hidden;
          animation: nbPop 0.18s cubic-bezier(0.32, 0.72, 0, 1);
        }
        @keyframes nbPop { from { opacity:0; transform: translateY(-6px) scale(0.98) } to { opacity:1; transform: translateY(0) scale(1) } }
        .nb-pop-header {
          padding: 14px 16px 12px;
          border-bottom: 1px solid #f0efed;
        }
        .nb-pop-name { font-size: 13px; font-weight: 600; color: #1a1816; margin-bottom: 2px; }
        .nb-pop-email { font-size: 11px; color: #9b9590; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .nb-pop-body { padding: 8px; }
        .nb-pop-item {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 100%;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #3d3b38;
          text-decoration: none;
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s, color 0.15s;
          text-align: left;
        }
        .nb-pop-item:hover { background: #f3f2f0; color: #1a1816; }
        .nb-pop-item.danger { color: #dc2626; }
        .nb-pop-item.danger:hover { background: #fef2f2; color: #dc2626; }
        .nb-pop-divider { height: 1px; background: #f0efed; margin: 4px 8px; }

        /* Mobile hamburger */
        .nb-hamburger {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid #e4e3e1;
          border-radius: 9px;
          background: transparent;
          cursor: pointer;
          color: #3d3b38;
          transition: all 0.15s;
        }
        .nb-hamburger:hover { background: #f3f2f0; border-color: #1a1816; color: #1a1816; }

        /* Mobile drawer */
        .nb-mobile-overlay {
          position: fixed; inset: 0;
          background: rgba(26,24,22,0.3);
          backdrop-filter: blur(4px);
          z-index: 40;
          animation: nbFadeIn 0.18s ease;
        }
        @keyframes nbFadeIn { from { opacity:0 } to { opacity:1 } }
        .nb-mobile-drawer {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: 280px;
          background: #fff;
          z-index: 41;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 32px rgba(0,0,0,0.12);
          animation: nbDrawerIn 0.25s cubic-bezier(0.32, 0.72, 0, 1);
        }
        @keyframes nbDrawerIn { from { transform: translateX(-100%) } to { transform: translateX(0) } }
        .nb-drawer-header {
          padding: 20px 20px 16px;
          border-bottom: 1px solid #f0efed;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nb-drawer-body { padding: 12px; flex: 1; overflow-y: auto; }
        .nb-drawer-footer { padding: 12px; border-top: 1px solid #f0efed; }
        .nb-mobile-link {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: #3d3b38;
          text-decoration: none;
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
          margin-bottom: 2px;
          transition: background 0.15s, color 0.15s;
          text-align: left;
        }
        .nb-mobile-link:hover { background: #f3f2f0; color: #1a1816; }
        .nb-mobile-link.danger { color: #dc2626; }
        .nb-mobile-link.danger:hover { background: #fef2f2; }

        .nb-mobile-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 10px;
          background: #f7f6f3;
          border: 1px solid #ebebeb;
          margin-bottom: 12px;
        }
        .nb-mobile-user-name { font-size: 13px; font-weight: 600; color: #1a1816; }
        .nb-mobile-user-email { font-size: 11px; color: #9b9590; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        @media (min-width: 768px) {
          .nb-mobile-only { display: none !important; }
        }
        @media (max-width: 767px) {
          .nb-desktop-only { display: none !important; }
        }
      `}</style>

      <div className="nb-root">
        <div className="nb-inner">

          {/* Logo */}
          <Link href="/" className="nb-logo">
            <span className="nb-logo-p">P</span>
            <span className="nb-logo-career">Career</span>
          </Link>

          {/* Desktop Nav */}
          <div className="nb-links nb-desktop-only">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="nb-link">
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="nb-actions nb-desktop-only">
            {!loading && (
              isAuth ? (
                <div className="nb-popover-wrap">
                  <button
                    className="nb-avatar-trigger"
                    onClick={() => setAvatarOpen(o => !o)}
                  >
                    <div className="nb-avatar-img">
                      {user?.profile_pic
                        ? <img src={user.profile_pic as string} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span>{user?.name?.charAt(0).toUpperCase()}</span>
                      }
                    </div>
                    <span className="nb-avatar-name">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown size={12} color="#9b9590" />
                  </button>

                  {avatarOpen && (
                    <>
                      <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setAvatarOpen(false)} />
                      <div className="nb-popover">
                        <div className="nb-pop-header">
                          <p className="nb-pop-name">{user?.name}</p>
                          <p className="nb-pop-email">{user?.email}</p>
                        </div>
                        <div className="nb-pop-body">
                          <Link href="/account" className="nb-pop-item" onClick={() => setAvatarOpen(false)}>
                            <User size={14} /> My Profile
                          </Link>
                          <div className="nb-pop-divider" />
                          <button className="nb-pop-item danger" onClick={logoutHandler}>
                            <LogOut size={14} /> Log Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/login" className="nb-signin-btn">
                  <User size={13} /> Sign In
                </Link>
              )
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="nb-hamburger nb-mobile-only"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div className="nb-mobile-overlay nb-mobile-only" onClick={() => setIsOpen(false)} />
          <div className="nb-mobile-drawer nb-mobile-only">
            <div className="nb-drawer-header">
              <Link href="/" className="nb-logo" onClick={() => setIsOpen(false)}>
                <span className="nb-logo-p">P</span>
                <span className="nb-logo-career">Career</span>
              </Link>
              <button
                className="nb-hamburger"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>

            <div className="nb-drawer-body">
              {isAuth && user && (
                <div className="nb-mobile-user">
                  <div className="nb-avatar-img">
                    {user.profile_pic
                      ? <img src={user.profile_pic as string} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span>{user.name?.charAt(0).toUpperCase()}</span>
                    }
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p className="nb-mobile-user-name">{user.name}</p>
                    <p className="nb-mobile-user-email">{user.email}</p>
                  </div>
                </div>
              )}

              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="nb-mobile-link" onClick={() => setIsOpen(false)}>
                  {link.icon} {link.label}
                </Link>
              ))}

              {isAuth && (
                <Link href="/account" className="nb-mobile-link" onClick={() => setIsOpen(false)}>
                  <User size={14} /> My Profile
                </Link>
              )}
            </div>

            <div className="nb-drawer-footer">
              {isAuth ? (
                <button
                  className="nb-mobile-link danger"
                  style={{ width: '100%' }}
                  onClick={() => { logoutHandler(); setIsOpen(false) }}
                >
                  <LogOut size={14} /> Log Out
                </button>
              ) : (
                <Link href="/login" className="nb-signin-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsOpen(false)}>
                  <User size={13} /> Sign In
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  )
}

export default Navbar
