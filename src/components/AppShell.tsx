import { Bell, Menu, Search, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { modules } from '../app/modules'
import { clearAccessToken } from '../lib/api'

export function AppShell() {
  const [open, setOpen] = useState(false)
  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-label="주요 메뉴">
        <div className="brand">
          <span className="brand-mark"><img src="/assets/ondrift.png" alt="" /></span>
          <span><strong>Ondrift</strong><small>Manufacturing Control Tower</small></span>
          <button className="icon-button mobile-close" onClick={() => setOpen(false)} aria-label="메뉴 닫기"><X size={20} /></button>
        </div>
        <div className="tenant"><span className="tenant-dot" /><span><strong>이피씨전자(주)</strong><small>PCB/PCBA · SMT</small></span></div>
        <nav className="module-nav">
          {modules.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)}>
              <Icon size={18} aria-hidden="true" /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="sidebar-footer" onClick={() => { clearAccessToken(); sessionStorage.removeItem('ondrift_demo_mode'); window.dispatchEvent(new Event('ondrift:logout')) }} aria-label="로그아웃"><span className="avatar">관</span><span><strong>관리자</strong><small>클릭하여 로그아웃</small></span><span className="online" aria-label="온라인" /></button>
      </aside>
      {open && <button className="backdrop" aria-label="메뉴 닫기" onClick={() => setOpen(false)} />}
      <div className="workspace">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setOpen(true)} aria-label="메뉴 열기"><Menu size={21} /></button>
          <label className="global-search"><Search size={18} aria-hidden="true" /><span className="sr-only">통합 검색</span><input placeholder="프로젝트, LOT, Serial 통합 검색" /></label>
          <div className="top-actions"><button className="icon-button notification" aria-label="알림 7개"><Bell size={19} /><span>7</span></button><span className="today">2026.08.10 월요일</span></div>
        </header>
        <main id="main-content"><Outlet /></main>
      </div>
    </div>
  )
}
