import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { ShieldCheck, Code2, Sparkles, Search, Copy, Check, AlertTriangle, Bug, Zap, ChevronRight, Github, ArrowUpRight, Terminal, RefreshCw, FileCode2 } from 'lucide-react'
import './style.css'

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')
const samples = {
  python: `import os\n\nAPI_KEY = "sk_example_hardcoded_secret"\n\ndef run_command(user_input):\n    os.system("echo " + user_input)\n\ntry:\n    run_command(input("Enter a command: "))\nexcept:\n    pass`,
  javascript: `function renderUser(userInput) {\n  const output = document.getElementById('output');\n  output.innerHTML = userInput;\n}\n\nconst token = "my_secret_token_12345";\nrenderUser(new URLSearchParams(location.search).get('name'));`,
  java: `public class Example {\n  public static void main(String[] args) {\n    String password = "admin_password_123";\n    System.out.println("Review me");\n  }\n}`,
  sql: `SELECT * FROM users WHERE name = '" + userInput + "';`
}
function App() {
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState(samples.python)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [health, setHealth] = useState(null)
  const [copied, setCopied] = useState(false)
  useEffect(() => { fetch(`${API}/health`).then(r => r.json()).then(setHealth).catch(() => setHealth({status:'offline'})) }, [])
  const changeLanguage = e => { const lang=e.target.value; setLanguage(lang); setCode(samples[lang] || `// Paste your ${lang} code here\n`); setResult(null) }
  async function review() {
    setError(''); setResult(null)
    if (!code.trim()) { setError('Paste some code first, then run your review.'); return }
    setLoading(true)
    try {
      const res = await fetch(`${API}/review`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({code, language})})
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Review failed. Check that the backend is running.')
      setResult(data)
    } catch (e) { setError(`${e.message}. Start the Flask backend and check VITE_API_URL if needed.`) }
    finally { setLoading(false) }
  }
  async function copyCode() { try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(()=>setCopied(false),1500) } catch { setError('Clipboard access was blocked by the browser.') } }
  const counts = result?.findings?.reduce((a,f)=>{const k=(f.severity||'Info').toLowerCase();a[k]=(a[k]||0)+1;return a},{}) || {}
  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><div className="brand-icon"><Code2 size={22}/></div><div><b>CodeLens</b><small>AI CODE REVIEWER</small></div></div>
      <div className="nav-label">WORKSPACE</div><div className="nav-item active"><Search size={17}/> Code review <span className="nav-dot"/></div><div className="nav-item muted"><ShieldCheck size={17}/> Security scan</div><div className="nav-item muted"><FileCode2 size={17}/> Code quality</div>
      <div className="sidebar-bottom"><div className="secure-card"><div className="secure-icon"><ShieldCheck size={17}/></div><b>Secure by design</b><p>Your code is processed for analysis and is not saved in a database by this demo.</p></div><div className="profile"><div className="avatar">CL</div><div><b>Developer workspace</b><small>Local environment</small></div><span className="status-dot"/></div></div>
    </aside>
    <main className="main"><header className="topbar"><div className="breadcrumb">Workspace <ChevronRight size={14}/> <b>Code review</b></div><div className="top-right"><span className={`connection ${health?.status==='ok'?'online':''}`}><i/>{health?.status==='ok'?'Backend connected':'Checking backend'}</span><a className="github-link" href="https://github.com/new" target="_blank" rel="noreferrer"><Github size={16}/> Repository <ArrowUpRight size={13}/></a></div></header>
      <section className="hero"><div className="eyebrow"><Sparkles size={14}/> INTELLIGENT CODE ANALYSIS</div><h1>Write better code.<br/><span>Ship with confidence.</span></h1><p>Find bugs, uncover security risks, and get clear, actionable improvements — all in one review.</p><div className="hero-pills"><span><Bug size={14}/> Bug detection</span><span><ShieldCheck size={14}/> Security insights</span><span><Zap size={14}/> Quality suggestions</span></div></section>
      <div className="section-heading"><div><h2>Review workspace</h2><p>Paste a snippet and let CodeLens inspect it.</p></div><div className="privacy-tag"><ShieldCheck size={14}/> No code history stored</div></div>
      <section className="workspace"><div className="editor-panel"><div className="panel-top"><div className="file-tab"><span className="file-indicator"/><span>untitled.{language==='javascript'?'js':language==='typescript'?'ts':language==='python'?'py':language==='java'?'java':language==='cpp'?'cpp':language==='csharp'?'cs':language==='sql'?'sql':language}</span><span className="unsaved">●</span></div><div className="editor-actions"><button className="icon-button" onClick={copyCode} title="Copy code">{copied?<Check size={15}/>:<Copy size={15}/>}</button><button className="icon-button" onClick={()=>{setCode('');setResult(null)}} title="Clear code"><RefreshCw size={15}/></button></div></div><div className="editor-toolbar"><label htmlFor="language">LANGUAGE</label><select id="language" value={language} onChange={changeLanguage}><option value="python">Python</option><option value="javascript">JavaScript</option><option value="typescript">TypeScript</option><option value="java">Java</option><option value="c">C</option><option value="cpp">C++</option><option value="csharp">C#</option><option value="go">Go</option><option value="php">PHP</option><option value="ruby">Ruby</option><option value="sql">SQL</option></select><button className="load-sample" onClick={()=>setCode(samples[language] || `// Paste your ${language} code here\n`)}>Load sample</button></div><div className="code-area"><div className="line-numbers">{Array.from({length:Math.max(1,code.split('\n').length)},(_,i)=><span key={i}>{i+1}</span>)}</div><textarea aria-label="Source code editor" spellCheck="false" value={code} onChange={e=>setCode(e.target.value)} placeholder="Paste your code here..." /></div><div className="editor-footer"><span><Terminal size={13}/> {code.split('\n').length} lines</span><span>{code.length.toLocaleString()} characters</span></div><div className="review-action"><div><span className="tiny-lock"><ShieldCheck size={14}/></span><span>Review runs on your configured backend</span></div><button className="review-button" onClick={review} disabled={loading}>{loading?<><RefreshCw className="spin" size={16}/> Analyzing...</>:<><Sparkles size={16}/> Review code <ArrowUpRight size={15}/></>}</button></div>{error&&<div className="error-box"><AlertTriangle size={16}/>{error}</div>}</div>
      <aside className="results-panel"><div className="results-head"><div><span className="results-icon"><Sparkles size={17}/></span><div><h3>Review results</h3><p>{result?'Analysis complete':'Your insights will appear here'}</p></div></div>{result&&<span className={`mode-pill ${result.mode==='ai'?'ai':''}`}>{result.mode==='ai'?'AI REVIEW':result.mode==='static'?'STATIC SCAN':'FALLBACK SCAN'}</span>}</div>
      {!result&&!loading&&<div className="empty-state"><div className="empty-graphic"><div className="graphic-ring ring-one"/><div className="graphic-ring ring-two"/><div className="graphic-center"><Code2 size={28}/></div><span className="float-icon float-a"><Bug size={16}/></span><span className="float-icon float-b"><ShieldCheck size={16}/></span><span className="float-icon float-c"><Sparkles size={16}/></span></div><h4>Ready when you are</h4><p>Your code review will include a quality summary, prioritized findings, and concrete suggestions.</p><div className="empty-checks"><span><Check size={14}/> Potential bugs</span><span><Check size={14}/> Security concerns</span><span><Check size={14}/> Improvement tips</span></div></div>}
      {loading&&<div className="loading-state"><div className="loading-orbit"><Sparkles size={26}/></div><h4>Inspecting your code</h4><p>Checking for common risks and quality improvements...</p><div className="loading-bar"><i/></div></div>}
      {result&&<div className="result-content"><div className="score-card"><div><small>QUALITY SCORE</small><div className="score"><strong>{result.score ?? '—'}</strong><span>/100</span></div></div><div className="score-ring" style={{'--score':`${result.score ?? 0}%`}}><span>{result.score>=80?'Good':result.score>=60?'Fair':'Review'}</span></div></div><p className="summary-text">{result.summary}</p><div className="finding-stats"><div><b className="high-text">{counts.high||0}</b><span>High</span></div><div><b className="medium-text">{counts.medium||0}</b><span>Medium</span></div><div><b className="low-text">{counts.low||0}</b><span>Low</span></div><div><b>{counts.info||0}</b><span>Info</span></div></div><div className="findings-title"><h4>Findings</h4><span>{result.findings?.length||0} items</span></div><div className="findings-list">{(result.findings||[]).map((f,i)=><article className="finding" key={i}><div className="finding-top"><span className={`severity ${(f.severity||'info').toLowerCase()}`}>{f.severity}</span>{f.line&&<span className="line-ref">Line {f.line}</span>}</div><b>{f.title}</b><p>{f.description}</p><div className="suggestion"><strong>Suggested fix</strong><p>{f.suggestion}</p></div></article>)}</div>{result.strengths?.length>0&&<div className="extra-section"><h4><Check size={15}/> Strengths</h4>{result.strengths.map((s,i)=><p key={i}>• {s}</p>)}</div>}{result.improvements?.length>0&&<div className="extra-section"><h4><Zap size={15}/> Next improvements</h4>{result.improvements.map((s,i)=><p key={i}>• {s}</p>)}</div>}<button className="secondary-button" onClick={()=>{setResult(null);setError('')}}>Start a new review <ArrowUpRight size={14}/></button></div>}
      <div className="results-bottom"><span className="status-dot"/> <span>{health?.status==='ok'?(health.ai_enabled?'AI engine configured':'Static scanner active · AI key optional'):'Waiting for backend connection'}</span></div></aside></section>
      <footer className="footer"><span>© 2026 CodeLens · AI-Powered Code Reviewer</span><span>Built for safer, cleaner code <ShieldCheck size={13}/></span></footer>
    </main>
  </div>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)
