import { ArrowRight, LockKeyhole, UserRound } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { login } from '../../lib/api'

export function LoginPage({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('ondrift-admin')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setLoading(true)
    try { await login(username, password); onAuthenticated() }
    catch (reason) { setError(reason instanceof Error ? reason.message : '로그인에 실패했습니다.') }
    finally { setLoading(false) }
  }
  function enterDemo() { sessionStorage.setItem('ondrift_demo_mode', 'true'); onAuthenticated() }
  return <main className="login-page">
    <section className="login-brand"><div className="login-copy"><span className="login-logo"><img src="/assets/ondrift.png" alt="Ondrift" /> Ondrift</span><span className="eyebrow">EEC MANUFACTURING CLOUD</span><h1>흩어진 제조 흐름을<br />하나의 맥락으로.</h1><p>영업, 설계, 조달, 생산, 품질과 출하를 프로젝트 Digital Thread로 연결합니다.</p><div className="login-process"><span>수주</span><i /><span>설계</span><i /><span>조달</span><i /><span>생산</span><i /><span>품질</span></div></div></section>
    <section className="login-form-wrap"><form className="login-form" onSubmit={submit}><div><span className="eyebrow">SECURE ACCESS</span><h2>Control Tower 로그인</h2><p>발급받은 데모 계정으로 접속하세요.</p></div>
      <label><span>아이디</span><div><UserRound size={17} /><input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></div></label>
      <label><span>비밀번호</span><div><LockKeyhole size={17} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></div></label>
      {error && <div className="login-error" role="alert">{error}</div>}
      <button className="login-submit" disabled={loading}>{loading ? '인증 중…' : <>로그인 <ArrowRight size={17} /></>}</button>
      <button type="button" className="demo-enter" onClick={enterDemo}>API 없이 데모 화면 둘러보기</button>
      <small className="security-note">세션 토큰은 현재 브라우저 탭에만 보관됩니다.</small>
    </form></section>
  </main>
}
