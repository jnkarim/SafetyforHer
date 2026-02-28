import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight, MessageSquare, Bot,
  Gamepad2, PhoneCall,
  ChevronRight, Eye, AlertTriangle,
  Globe, Scale
} from 'lucide-react'

const useInView = () => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true) }, { threshold: 0.15 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

const CountUp = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView()
  useEffect(() => {
    if (!inView) return
    const end = parseInt(target)
    if (!end || end <= 0) { setCount(0); return }
    let start = 0
    const duration = 1500, steps = 60
    const increment = Math.ceil(end / steps)
    const stepTime = duration / steps
    const timer = setInterval(() => {
      start += increment
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, stepTime)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span ref={ref}>{count}{suffix}</span>
}

const LangToggle = () => {
  const { i18n } = useTranslation()
  const isBn = i18n.language === 'bn'
  return (
    <div style={{
      position: 'fixed', top: 20, right: 24, zIndex: 9999,
      display: 'flex', alignItems: 'center',
      background: 'rgba(16,13,32,0.85)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 100, padding: 4,
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      fontFamily: "'Syne', sans-serif",
      gap: 2,
    }}>
      <button
        onClick={() => i18n.changeLanguage('en')}
        style={{
          padding: '7px 16px', borderRadius: 100, border: 'none', cursor: 'pointer',
          fontWeight: 800, fontSize: 12, letterSpacing: '0.05em',
          transition: 'all 0.2s',
          background: !isBn ? 'linear-gradient(135deg,#ff3d6e,#8b5cf6)' : 'transparent',
          color: !isBn ? '#fff' : 'rgba(255,255,255,0.35)',
        }}
      >EN</button>
      <button
        onClick={() => i18n.changeLanguage('bn')}
        style={{
          padding: '7px 16px', borderRadius: 100, border: 'none', cursor: 'pointer',
          fontWeight: 800, fontSize: 12, letterSpacing: '0.05em',
          transition: 'all 0.2s',
          background: isBn ? 'linear-gradient(135deg,#ff3d6e,#8b5cf6)' : 'transparent',
          color: isBn ? '#fff' : 'rgba(255,255,255,0.35)',
        }}
      >বাংলা</button>
    </div>
  )
}

export default function Home() {
  const { t } = useTranslation()
  const [activeScenario, setActiveScenario] = useState(null)
  const [scenarioResult, setScenarioResult] = useState(null)

  const handleOption = (idx) => {
    setActiveScenario(idx)
    setScenarioResult(idx === 0 ? 'correct' : idx === 2 ? 'partial' : 'wrong')
  }

  const aiIcons = [<Bot size={28}/>, <Globe size={28}/>, <Eye size={28}/>]
  const aiColors = ['#ff3d6e', '#8b5cf6', '#ff3d6e']

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", background: '#05030d', color: '#f5f0ff', overflowX: 'hidden' }}>
      <LangToggle />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700&display=swap');
        .serif { font-family: 'Fraunces', Georgia, serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.5);opacity:0} }
        @keyframes drift { 0%,100%{transform:translate(0,0) rotate(0deg)} 33%{transform:translate(8px,-12px) rotate(2deg)} 66%{transform:translate(-5px,6px) rotate(-1deg)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}.d4{animation-delay:.4s}
        .drift { animation: drift 8s ease-in-out infinite; }
        .shimmer-text {
          background: linear-gradient(90deg,#ff3d6e,#c084fc,#ff3d6e);
          background-size: 200%;
          -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
          animation: shimmer 3s linear infinite;
        }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); }
        .ticker-wrap { overflow:hidden; white-space:nowrap; }
        .ticker-inner { display:inline-flex; animation:ticker 20s linear infinite; }
        .noise::before { content:''; position:absolute; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E"); pointer-events:none; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .two-col { grid-template-columns: 1fr !important; gap: 40px !important; }
          .types-cards { grid-template-columns: 1fr 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-row { flex-direction: row !important; gap: 20px !important; flex-wrap: wrap; }
          .stats-row > div { flex: 1 1 calc(33% - 16px); min-width: 80px; }
          .legal-timeline { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 20px !important; padding: 0 !important; }
          .legal-timeline-line { display: none !important; }
          .legal-timeline-item { flex-direction: row !important; align-items: flex-start !important; gap: 12px !important; }
          .legal-dot { margin-top: 4px; flex-shrink: 0; }
          .sos-grid { grid-template-columns: 1fr !important; }
          .section-pad { padding: 60px 20px !important; }
          .hero-pad { padding: 100px 20px 60px !important; }
        }
        @media (max-width: 480px) {
          .types-cards { grid-template-columns: 1fr !important; }
          .legal-timeline { grid-template-columns: 1fr !important; }
          .sos-numbers { flex-direction: column !important; }
        }
      `}</style>

      {/* HERO */}
      <section className="noise hero-pad" style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', padding:'80px 24px 60px', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'10%', left:'-10%', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'5%', right:'-5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,61,110,0.12) 0%, transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize:'80px 80px', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:10, maxWidth:1100, margin:'0 auto', width:'100%' }}>
          <div className="hero-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:60, alignItems:'center' }}>
            <div>
              <div className="fade-up" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px', borderRadius:100, background:'rgba(255,61,110,0.1)', border:'1px solid rgba(255,61,110,0.25)', marginBottom:28 }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:'#ff3d6e', display:'block', animation:'pulse-ring 1.5s ease-out infinite' }} />
                <span style={{ fontSize:10, fontWeight:800, letterSpacing:'0.2em', color:'#ff3d6e', textTransform:'uppercase' }}>{t('hero.badge')}</span>
              </div>
              <h1 className="serif fade-up d1" style={{ fontSize:'clamp(2.4rem, 7vw, 5.5rem)', fontWeight:900, lineHeight:0.95, letterSpacing:'-0.02em', marginBottom:24 }}>
                {t('hero.title_line1')}<br />
                <span style={{ fontStyle:'italic', fontWeight:400 }}>{t('hero.title_is')}</span>{' '}
                <span className="shimmer-text">{t('hero.title_line2')}</span>
              </h1>
              <p className="fade-up d2" style={{ fontSize:15, lineHeight:1.75, color:'rgba(245,240,255,0.5)', maxWidth:460, marginBottom:36, fontWeight:400 }}
                dangerouslySetInnerHTML={{ __html: t('hero.desc') }} />
              <div className="fade-up d3" style={{ display:'flex', flexWrap:'wrap', gap:12, marginBottom:48 }}>
                <a href="#" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 28px', borderRadius:16, background:'linear-gradient(135deg,#ff3d6e,#8b5cf6)', color:'#fff', fontWeight:800, fontSize:13, textDecoration:'none', boxShadow:'0 0 40px rgba(255,61,110,0.3)' }}>
                  {t('hero.cta_help')} <ArrowRight size={15} />
                </a>
                <a href="#" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 28px', borderRadius:16, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(245,240,255,0.7)', fontWeight:700, fontSize:13, textDecoration:'none' }}>
                  {t('hero.cta_learn')}
                </a>
              </div>
              <div className="fade-up d4 stats-row" style={{ display:'flex', gap:32, paddingTop:28, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                {[
                  { n:'66', suf:'%', label: t('hero.stat1_label') },
                  { n:'99', suf:'%', label: t('hero.stat2_label') },
                  { n:'24', suf:'/7', label: t('hero.stat3_label') },
                ].map((s,i) => (
                  <div key={i}>
                    <div className="serif" style={{ fontSize:'2rem', fontWeight:900, color:'#fff', lineHeight:1 }}><CountUp target={s.n} suffix={s.suf} /></div>
                    <div style={{ fontSize:10, color:'rgba(245,240,255,0.35)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', marginTop:4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="fade-up d3" style={{ position:'relative' }}>
              <div className="drift" style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,#ff3d6e,#8b5cf6)', opacity:0.15, filter:'blur(20px)' }} />
              <div style={{ borderRadius:32, padding:32, background:'rgba(16,13,32,0.9)', border:'1px solid rgba(255,255,255,0.08)', backdropFilter:'blur(20px)', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, right:0, width:200, height:200, background:'radial-gradient(circle, rgba(255,61,110,0.08), transparent 70%)', pointerEvents:'none' }} />
                <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:100, background:'rgba(139,92,246,0.12)', border:'1px solid rgba(139,92,246,0.2)', marginBottom:20 }}>
                  <Scale size={11} color="#8b5cf6" />
                  <span style={{ fontSize:10, fontWeight:800, color:'#8b5cf6', letterSpacing:'0.15em', textTransform:'uppercase' }}>{t('hero.quote_source')}</span>
                </div>
                <p className="serif" style={{ fontSize:17, fontWeight:700, color:'#fff', lineHeight:1.6, marginBottom:24, fontStyle:'italic' }}>{t('hero.quote')}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {t('hero.abuse_types', { returnObjects: true }).map((item, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ width:6, height:6, borderRadius:'50%', background: i%2===0 ? '#ff3d6e' : '#8b5cf6', flexShrink:0 }} />
                      <span style={{ fontSize:13, color:'rgba(245,240,255,0.65)', fontWeight:600 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div style={{ background:'linear-gradient(90deg,#ff3d6e,#8b5cf6)', padding:'14px 0', overflow:'hidden' }}>
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...Array(2)].map((_,i) => (
              <span key={i} style={{ display:'inline-flex' }}>
                {t('ticker', { returnObjects: true }).map((text, j) => (
                  <span key={j} style={{ fontSize:11, fontWeight:800, letterSpacing:'0.2em', color:'rgba(255,255,255,0.9)', paddingRight:60, whiteSpace:'nowrap' }}>◆ {text}</span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* GLOBAL STATISTICS */}
      <section className="section-pad" style={{ background:'#fef9f0', color:'#05030d', padding:'80px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <p style={{ fontSize:10, fontWeight:800, letterSpacing:'0.25em', color:'#ff3d6e', textTransform:'uppercase', marginBottom:12 }}>{t('stats.section_label')}</p>
            <h2 className="serif" style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:900, lineHeight:0.95, letterSpacing:'-0.02em' }}>
              {t('stats.title_line1')}<br /><span style={{ fontStyle:'italic' }}>{t('stats.title_line2')}</span>
            </h2>
          </div>
          <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:4 }}>
            {t('stats.items', { returnObjects: true }).map((s, i) => (
              <div key={i} className="card-hover" style={{ padding:28, background: i===0 ? '#05030d' : i===4 ? 'linear-gradient(135deg,#ff3d6e,#8b5cf6)' : '#f5eee3', borderRadius:0 }}>
                <div className="serif" style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:900, color: i===0||i===4 ? '#fff' : i%2===0 ? '#ff3d6e' : '#8b5cf6', marginBottom:8, lineHeight:1 }}>{s.pct}</div>
                <div style={{ fontSize:12, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color: i===0 ? 'rgba(255,255,255,0.6)' : i===4 ? 'rgba(255,255,255,0.7)' : 'rgba(5,3,13,0.5)', marginBottom:8 }}>{s.type}</div>
                <div style={{ fontSize:12, lineHeight:1.6, color: i===0 ? 'rgba(255,255,255,0.4)' : i===4 ? 'rgba(255,255,255,0.8)' : 'rgba(5,3,13,0.55)', fontWeight:400 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TYPES */}
      <section className="section-pad" style={{ background:'#05030d', padding:'80px 24px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative', zIndex:2 }}>
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
            <div>
              <p style={{ fontSize:10, fontWeight:800, letterSpacing:'0.25em', color:'#ff3d6e', textTransform:'uppercase', marginBottom:16 }}>{t('types.section_label')}</p>
              <h2 className="serif" style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:900, lineHeight:0.95, letterSpacing:'-0.02em', marginBottom:20 }}>
                {t('types.title_line1')}<br /><span style={{ fontStyle:'italic', color:'rgba(245,240,255,0.5)' }}>{t('types.title_line2')}</span>
              </h2>
              <p style={{ fontSize:14, color:'rgba(245,240,255,0.4)', lineHeight:1.7, maxWidth:380 }}>{t('types.desc')}</p>
            </div>
            <div className="types-cards" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {t('types.items', { returnObjects: true }).map((item, i) => (
                <div key={i} style={{ padding:'14px 16px', borderRadius:14, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', transition:'all 0.2s', cursor:'default' }}
                     onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,61,110,0.3)'; e.currentTarget.style.background='rgba(255,61,110,0.05)' }}
                     onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; e.currentTarget.style.background='rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize:20, marginBottom:6 }}>{item.icon}</div>
                  <div style={{ fontSize:12, fontWeight:800, color:'#fff', marginBottom:3 }}>{item.title}</div>
                  <div style={{ fontSize:11, color:'rgba(245,240,255,0.35)', lineHeight:1.4 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI GUARDIAN */}
      <section className="section-pad" style={{ background:'#fef9f0', color:'#05030d', padding:'80px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:16, marginBottom:52 }}>
            <div>
              <p style={{ fontSize:10, fontWeight:800, letterSpacing:'0.25em', color:'#ff3d6e', textTransform:'uppercase', marginBottom:12 }}>{t('ai.section_label')}</p>
              <h2 className="serif" style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:900, lineHeight:0.95, letterSpacing:'-0.02em', fontStyle:'italic' }}>{t('ai.title')}</h2>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', borderRadius:100, background:'rgba(255,61,110,0.08)', border:'1px solid rgba(255,61,110,0.15)' }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'#ff3d6e', display:'block', animation:'pulse-ring 1.5s ease-out infinite' }} />
              <span style={{ fontSize:10, fontWeight:800, color:'#ff3d6e', letterSpacing:'0.15em', textTransform:'uppercase' }}>{t('ai.active')}</span>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:16 }}>
            {t('ai.cards', { returnObjects: true }).map((card, i) => (
              <div key={i} className="card-hover" style={{ padding:32, borderRadius:28, background:'#f5eee3', border:'2px solid transparent', transition:'all 0.25s', cursor:'pointer' }}
                   onMouseEnter={e => { e.currentTarget.style.borderColor=aiColors[i]; e.currentTarget.style.background='#fff' }}
                   onMouseLeave={e => { e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.background='#f5eee3' }}>
                <div style={{ color:aiColors[i], marginBottom:20 }}>{aiIcons[i]}</div>
                <h3 style={{ fontSize:16, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:10, fontStyle:'italic' }}>{card.title}</h3>
                <p style={{ fontSize:13, color:'rgba(5,3,13,0.55)', lineHeight:1.7, marginBottom:16 }}>{card.desc}</p>
                <span style={{ fontSize:10, fontWeight:800, padding:'4px 12px', borderRadius:100, letterSpacing:'0.1em', textTransform:'uppercase', background:`${aiColors[i]}18`, color:aiColors[i] }}>{card.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCENARIO ARENA */}
      <section className="section-pad" style={{ background:'#05030d', padding:'80px 24px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:0, top:0, width:500, height:'100%', background:'radial-gradient(ellipse at 100% 50%, rgba(255,61,110,0.07), transparent 70%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative', zIndex:2 }}>
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:60, alignItems:'center' }}>
            <div>
              <div style={{ width:48, height:3, borderRadius:4, background:'linear-gradient(90deg,#ff3d6e,#8b5cf6)', marginBottom:24 }} />
              <p style={{ fontSize:10, fontWeight:800, letterSpacing:'0.25em', color:'#ff3d6e', textTransform:'uppercase', marginBottom:16 }}>{t('scenario.section_label')}</p>
              <h2 className="serif" style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:900, lineHeight:0.95, letterSpacing:'-0.02em', marginBottom:28, fontStyle:'italic' }}>{t('scenario.title')}</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:32 }}>
                {t('scenario.points', { returnObjects: true }).map((s, i) => (
                  <div key={i} style={{ display:'flex', gap:14 }}>
                    <span style={{ fontSize:11, fontWeight:800, color:'rgba(255,61,110,0.5)', fontFamily:'monospace', flexShrink:0, marginTop:2 }}>0{i+1}</span>
                    <p style={{ fontSize:13, color:'rgba(245,240,255,0.5)', lineHeight:1.7 }}>{s}</p>
                  </div>
                ))}
              </div>
              <button style={{ display:'inline-flex', alignItems:'center', gap:8, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.15em', fontSize:11, color:'#ff3d6e', background:'none', border:'none', cursor:'pointer' }}>
                {t('scenario.enter_btn')} <Gamepad2 size={16} />
              </button>
            </div>
            <div>
              <div style={{ borderRadius:32, padding:28, background:'#100d20', border:'1px solid rgba(255,255,255,0.07)', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, right:0, width:200, height:200, background:'radial-gradient(circle, rgba(255,61,110,0.06), transparent 70%)', pointerEvents:'none' }} />
                <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:8, background:'rgba(255,61,110,0.1)', border:'1px solid rgba(255,61,110,0.2)', marginBottom:20 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'#ff3d6e' }} />
                  <span style={{ fontSize:10, fontWeight:800, color:'#ff3d6e', letterSpacing:'0.15em', textTransform:'uppercase' }}>{t('scenario.live_badge')}</span>
                </div>
                <p className="serif" style={{ fontSize:16, fontWeight:700, color:'#fff', lineHeight:1.6, marginBottom:20, fontStyle:'italic' }}>{t('scenario.question')}</p>
                {scenarioResult && (
                  <div style={{ padding:'12px 16px', borderRadius:12, marginBottom:16,
                    background: scenarioResult==='correct' ? 'rgba(34,197,94,0.1)' : scenarioResult==='partial' ? 'rgba(234,179,8,0.1)' : 'rgba(255,61,110,0.1)',
                    border:`1px solid ${scenarioResult==='correct' ? 'rgba(34,197,94,0.3)' : scenarioResult==='partial' ? 'rgba(234,179,8,0.3)' : 'rgba(255,61,110,0.3)'}`,
                    fontSize:12, fontWeight:600,
                    color: scenarioResult==='correct' ? '#4ade80' : scenarioResult==='partial' ? '#fbbf24' : '#ff3d6e' }}>
                    {t(`scenario.result_${scenarioResult}`)}
                  </div>
                )}
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {t('scenario.options', { returnObjects: true }).map((opt, i) => (
                    <div key={i} onClick={() => handleOption(i)} style={{
                      display:'flex', alignItems:'center', gap:12, padding:'14px 16px', borderRadius:16, cursor:'pointer', transition:'all 0.2s',
                      background: activeScenario===i ? (i===0 ? 'rgba(34,197,94,0.08)' : i===2 ? 'rgba(234,179,8,0.08)' : 'rgba(255,61,110,0.08)') : 'rgba(255,255,255,0.04)',
                      border:`1px solid ${activeScenario===i ? (i===0 ? 'rgba(34,197,94,0.4)' : i===2 ? 'rgba(234,179,8,0.4)' : 'rgba(255,61,110,0.4)') : 'rgba(255,255,255,0.06)'}`
                    }}>
                      <span style={{ width:28, height:28, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900, background:'rgba(255,61,110,0.1)', color:'#ff3d6e', flexShrink:0 }}>{i+1}</span>
                      <span style={{ fontSize:13, fontWeight:600, color:'rgba(245,240,255,0.65)' }}>{opt}</span>
                      <ChevronRight size={13} style={{ marginLeft:'auto', color:'rgba(255,255,255,0.2)', flexShrink:0 }} />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
                  <span style={{ fontSize:11, color:'rgba(245,240,255,0.2)', fontFamily:'monospace' }}>{t('scenario.counter')}</span>
                  <span style={{ fontSize:11, fontWeight:800, color:'#ff3d6e' }}>{t('scenario.tag')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEGAL FRAMEWORK */}
      <section className="section-pad" style={{ background:'#fef9f0', color:'#05030d', padding:'80px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <p style={{ fontSize:10, fontWeight:800, letterSpacing:'0.25em', color:'#ff3d6e', textTransform:'uppercase', marginBottom:12 }}>{t('legal.section_label')}</p>
            <h2 className="serif" style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:900, lineHeight:0.95, letterSpacing:'-0.02em' }}>
              {t('legal.title_line1')}<br /><span style={{ fontStyle:'italic' }}>{t('legal.title_line2')}</span>
            </h2>
          </div>
          <div style={{ position:'relative', padding:'0 20px' }}>
            <div className="legal-timeline-line" style={{ position:'absolute', top:28, left:20, right:20, height:3, background:'linear-gradient(90deg,#ff3d6e,#8b5cf6)', borderRadius:4 }} />
            <div className="legal-timeline" style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:0, position:'relative', zIndex:2 }}>
              {t('legal.laws', { returnObjects: true }).map((law, i) => (
                <div key={i} className="legal-timeline-item" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                  <div className="legal-dot" style={{ width:20, height:20, borderRadius:'50%', background: i%2===0 ? '#ff3d6e' : '#8b5cf6', border:'3px solid #fef9f0', flexShrink:0 }} />
                  <div style={{ textAlign:'center', padding:'0 4px' }}>
                    <div style={{ fontSize:11, fontWeight:800, color:'#05030d', lineHeight:1.3, marginBottom:4 }}>{law.title}</div>
                    <div style={{ fontSize:10, fontWeight:600, color: i%2===0 ? '#ff3d6e' : '#8b5cf6', textTransform:'uppercase', letterSpacing:'0.05em' }}>{law.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop:40, padding:28, borderRadius:24, background:'#05030d', border:'2px solid rgba(255,61,110,0.2)' }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start', flexWrap:'wrap' }}>
              <AlertTriangle size={20} color="#ff3d6e" style={{ flexShrink:0, marginTop:2 }} />
              <p style={{ fontSize:13, color:'rgba(245,240,255,0.8)', lineHeight:1.7, fontWeight:500 }}
                dangerouslySetInnerHTML={{ __html: t('legal.notice') }} />
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY + SOS */}
      <section className="section-pad" style={{ background:'#05030d', padding:'80px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <p style={{ fontSize:10, fontWeight:800, letterSpacing:'0.25em', color:'#ff3d6e', textTransform:'uppercase', marginBottom:12 }}>{t('community.section_label')}</p>
            <h2 className="serif" style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:900, lineHeight:0.95, letterSpacing:'-0.02em', color:'#fff' }}>
              {t('community.title_line1')}<br /><span style={{ fontStyle:'italic', color:'rgba(245,240,255,0.45)' }}>{t('community.title_line2')}</span>
            </h2>
          </div>
          <div className="sos-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(340px, 1fr))', gap:20 }}>
            <div className="card-hover" style={{ borderRadius:36, padding:40, background:'#100d20', border:'1px solid rgba(255,255,255,0.07)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, right:0, width:200, height:200, background:'radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)', pointerEvents:'none' }} />
              <MessageSquare size={28} color="#c084fc" style={{ marginBottom:20 }} />
              <h3 className="serif" style={{ fontSize:'1.8rem', color:'#fff', fontStyle:'italic', fontWeight:700, marginBottom:12 }}>{t('community.feed_title')}</h3>
              <p style={{ fontSize:13, color:'rgba(245,240,255,0.4)', lineHeight:1.7, marginBottom:24 }}>{t('community.feed_desc')}</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:28 }}>
                {t('community.feed_tags', { returnObjects: true }).map((tag) => (
                  <span key={tag} style={{ fontSize:10, fontWeight:800, padding:'4px 12px', borderRadius:100, background:'rgba(192,132,252,0.1)', color:'#c084fc', letterSpacing:'0.05em' }}>#{tag}</span>
                ))}
              </div>
              <a href="#" style={{ display:'inline-flex', alignItems:'center', gap:8, fontSize:11, fontWeight:800, color:'#c084fc', letterSpacing:'0.15em', textTransform:'uppercase', textDecoration:'none' }}>
                {t('community.feed_btn')} <ArrowRight size={14} />
              </a>
            </div>
            <div style={{ borderRadius:36, padding:40, background:'linear-gradient(135deg,#ff3d6e,#c2185b)', boxShadow:'0 24px 60px rgba(255,61,110,0.25)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, right:0, opacity:0.1 }}><PhoneCall size={140} color="#fff" /></div>
              <div style={{ position:'relative', zIndex:2 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px', borderRadius:100, background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.2)', marginBottom:24 }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:'#fff', animation:'pulse-ring 1.2s ease-out infinite' }} />
                  <span style={{ fontSize:10, fontWeight:800, color:'#fff', letterSpacing:'0.2em', textTransform:'uppercase' }}>{t('community.sos_badge')}</span>
                </div>
                <h3 className="serif" style={{ fontSize:'1.8rem', color:'#fff', fontStyle:'italic', fontWeight:700, marginBottom:12 }}>{t('community.sos_title')}</h3>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:1.7, marginBottom:28 }}>{t('community.sos_desc')}</p>
                <div className="sos-numbers" style={{ display:'flex', flexWrap:'wrap', gap:12, marginBottom:28 }}>
                  {t('community.sos_numbers', { returnObjects: true }).map((s) => (
                    <div key={s.n} style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.2)', padding:'12px 20px', borderRadius:16 }}>
                      <span className="serif" style={{ fontSize:'1.5rem', fontWeight:900, color:'#fff' }}>{s.n}</span>
                      <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.7)', textTransform:'uppercase', letterSpacing:'0.1em' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <a href="tel:999" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#fff', color:'#ff3d6e', fontWeight:900, fontSize:13, padding:'12px 24px', borderRadius:16, textDecoration:'none', boxShadow:'0 8px 30px rgba(0,0,0,0.2)' }}>
                  <PhoneCall size={15} /> {t('community.sos_btn')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}