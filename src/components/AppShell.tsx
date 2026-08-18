// Part of the unreached prototype dashboard, kept for reference -- see README "Status of this repository".
import { Bell, Menu, Search, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { modules } from '../app/modules'
import { APP_EVENTS, clearAccessToken, STORAGE_KEYS } from '../lib/api'

// Static demo content for this prototype dashboard (see README "Status of this repository").
const DEMO_TENANT = { name: '이피씨전자(주)', line: 'PCB/PCBA · SMT' }
const DEMO_ADMIN_LABEL = '관리자'
const DEMO_ADMIN_AVATAR_INITIAL = '관'
const DEMO_NOTIFICATION_COUNT = 7
const DEMO_TODAY_LABEL = '2026.08.10 월요일'

export function AppShell() {
  const [open, setOpen] = useState(false)
  function handleLogout() {
    clearAccessToken()
    sessionStorage.removeItem(STORAGE_KEYS.demoMode)
    window.dispatchEvent(new Event(APP_EVENTS.logout))
  }
  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-label="주요 메뉴">
        <div className="brand">
          <span className="brand-mark"><img src="/assets/ondrift.png" alt="" /></span>
          <span><strong>Ondrift</strong><small>Manufacturing Control Tower</small></span>
          <button className="icon-button mobile-close" onClick={() => setOpen(false)} aria-label="메뉴 닫기"><X size={20} /></button>
        </div>
        <div className="tenant"><span className="tenant-dot" /><span><strong>{DEMO_TENANT.name}</strong><small>{DEMO_TENANT.line}</small></span></div>
        <nav className="module-nav">
          {modules.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)}>
              <Icon size={18} aria-hidden="true" /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="sidebar-footer" onClick={handleLogout} aria-label="로그아웃"><span className="avatar">{DEMO_ADMIN_AVATAR_INITIAL}</span><span><strong>{DEMO_ADMIN_LABEL}</strong><small>클릭하여 로그아웃</small></span><span className="online" aria-label="온라인" /></button>
      </aside>
      {open && <button className="backdrop" aria-label="메뉴 닫기" onClick={() => setOpen(false)} />}
      <div className="workspace">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setOpen(true)} aria-label="메뉴 열기"><Menu size={21} /></button>
          <label className="global-search"><Search size={18} aria-hidden="true" /><span className="sr-only">통합 검색</span><input placeholder="프로젝트, LOT, Serial 통합 검색" /></label>
          <div className="top-actions"><button className="icon-button notification" aria-label={`알림 ${DEMO_NOTIFICATION_COUNT}개`}><Bell size={19} /><span>{DEMO_NOTIFICATION_COUNT}</span></button><span className="today">{DEMO_TODAY_LABEL}</span></div>
        </header>
        <main id="main-content"><Outlet /></main>
      </div>
    </div>
  )
}
