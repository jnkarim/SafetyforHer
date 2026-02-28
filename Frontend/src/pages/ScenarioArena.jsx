import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  RotateCcw, UserCircle2, Lightbulb, AlertTriangle, HelpCircle, 
  MessageCircle, EyeOff, Shield, XCircle, CheckCircle, RefreshCw 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveProgress, completeScenario } from '../api/scenarios_api';

import imgIntro    from '../assets/scenerios/doxxing/scene-selfie.jpg';
import imgThreat   from '../assets/scenerios/doxxing/scene-threat.png';
import imgDanger   from '../assets/scenerios/doxxing/scene-danger.png';
import imgDecision from '../assets/scenerios/doxxing/scene-decision.jpg';
import imgSafe     from '../assets/scenerios/doxxing/scene-safe.png';

const SLUG = 'doxxing';

// Non-translatable mappings (images, colors, icons stay in code)
const SCENE_IMAGES = {
  intro: imgIntro, threat: imgThreat, decision: imgDecision,
  bad_engage: imgDanger, bad_ignore: imgDanger, good: imgSafe,
};
const SCENE_ACCENT = {
  intro: '#f59e0b', threat: '#f97316', decision: '#a78bfa',
  bad_engage: '#ef4444', bad_ignore: '#f97316', good: '#10b981',
};
const SCENE_INFO_ICON = {
  intro: 'lightbulb', threat: 'alert', decision: 'help',
  bad_engage: 'xcircle', bad_ignore: 'alert', good: 'check',
};

// ── Language Toggle ──
const LangToggle = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: 'rgba(10,0,30,0.8)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 100, padding: 4, gap: 2,
    }}>
      <button
        onClick={() => i18n.changeLanguage('en')}
        style={{
          padding: '5px 12px', borderRadius: 100, border: 'none', cursor: 'pointer',
          fontWeight: 800, fontSize: 11, letterSpacing: '0.05em', transition: 'all 0.2s',
          background: !isBn ? 'linear-gradient(135deg,#ff4b91,#7c3aed)' : 'transparent',
          color: !isBn ? '#fff' : 'rgba(255,255,255,0.3)',
        }}
      >EN</button>
      <button
        onClick={() => i18n.changeLanguage('bn')}
        style={{
          padding: '5px 12px', borderRadius: 100, border: 'none', cursor: 'pointer',
          fontWeight: 800, fontSize: 11, transition: 'all 0.2s',
          background: isBn ? 'linear-gradient(135deg,#ff4b91,#7c3aed)' : 'transparent',
          color: isBn ? '#fff' : 'rgba(255,255,255,0.3)',
        }}
      >বাংলা</button>
    </div>
  );
};

function Icon({ name, size = 16, color, className }) {
  const props = { size, color, className, strokeWidth: 2 };
  const map = {
    lightbulb: <Lightbulb {...props} />, alert:   <AlertTriangle {...props} />,
    help:      <HelpCircle {...props} />, message: <MessageCircle {...props} />,
    eyeoff:    <EyeOff {...props} />,    shield:  <Shield {...props} />,
    xcircle:   <XCircle {...props} />,   check:   <CheckCircle {...props} />,
    retry:     <RefreshCw {...props} />,
  };
  return map[name] || null;
}

export default function ScenarioArena() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [sceneId, setSceneId] = useState('intro');
  const [visibleLines, setVisible] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fading, setFading] = useState(false);

  const scenes     = t('arena.scenes', { returnObjects: true });
  const scene      = scenes[sceneId] || scenes.intro;
  const accentColor = SCENE_ACCENT[sceneId]   || '#f59e0b';
  const sceneImage  = SCENE_IMAGES[sceneId]   || imgIntro;
  const infoIcon    = SCENE_INFO_ICON[sceneId] || 'lightbulb';
  const allLinesIn  = visibleLines >= scene.narration.length;

  // Re-run narration animation on scene change OR language change
  useEffect(() => {
    setVisible(0);
    setShowInfo(false);
    const timers = scene.narration.map((_, i) =>
      setTimeout(() => setVisible(i + 1), 500 + i * 900)
    );
    return () => timers.forEach(clearTimeout);
  }, [sceneId, i18n.language]);

  const goTo = async (choice) => {
    if (fading || saving) return;
    if (user) {
      setSaving(true);
      try {
        await saveProgress(SLUG, { sceneId, choiceLabel: choice.label, next: choice.next });
        if (choice.next === 'final') await completeScenario(SLUG, sceneId === 'good');
      } catch (e) { console.error(e); }
      finally { setSaving(false); }
    }
    setFading(true);
    setTimeout(() => {
      setSceneId(choice.next);
      setFading(false);
      window.scrollTo({ top: 0 });
    }, 300);
  };

  const getChoiceClass = (style) => {
    const base = "px-7 py-3.5 rounded-full font-extrabold text-[15px] flex items-center gap-2 transition-all duration-250 hover:-translate-y-1 hover:scale-[1.03] hover:brightness-110 active:translate-y-0 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed";
    const styles = {
      primary: "bg-[#ffd700] text-[#1a0045] shadow-[0_8px_24px_rgba(255,215,0,0.4)]",
      safe:    "bg-[#10b981] text-white shadow-[0_8px_24px_rgba(16,185,129,0.4)]",
      warning: "bg-[#f97316] text-white shadow-[0_8px_24px_rgba(249,115,22,0.4)]",
      danger:  "bg-[#ef4444] text-white shadow-[0_8px_24px_rgba(239,68,68,0.4)]",
      retry:   "bg-[#a78bfa1a] text-[#c4b5fd] border border-[#a78bfa66]",
    };
    return `${base} ${styles[style] || styles.primary}`;
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(145deg,#0e0028_0%,#1a0045_45%,#0b001e_100%)] text-white font-['Quicksand',_system-ui,_sans-serif] relative flex flex-col pb-12 overflow-x-hidden">
      
      {/* STARS */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-55" 
           style={{ backgroundImage: `radial-gradient(1px 1px at 12% 22%, white, transparent), radial-gradient(1px 1px at 38% 68%, white, transparent), radial-gradient(1px 1px at 62% 15%, white, transparent), radial-gradient(1px 1px at 80% 80%, white, transparent)`, backgroundSize: '220px 220px' }} />

      {/* TOP BAR */}
      <div className="sticky top-0 z-50 flex items-center justify-between gap-3 px-7 py-2.5 bg-[#0a001ee0] backdrop-blur-[18px] border-b border-white/10">
        <button
          onClick={() => navigate('/scenarios')}
          className="bg-white/10 border border-white/10 text-white/60 rounded-lg px-3.5 py-1.5 text-xs font-bold cursor-pointer transition-all hover:bg-white/20"
        >
          {t('arena.back')}
        </button>

        <div className="text-[11px] font-extrabold tracking-[0.2em] text-[#ff4b91] uppercase hidden sm:block">
          {t('arena.top_label')}
        </div>

        <div className="flex items-center gap-3">
          <LangToggle />
          <div
            className="text-[11px] font-extrabold px-3 py-1 rounded-full border shrink-0 tracking-widest"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor, borderColor: `${accentColor}45` }}
          >
            Ch. {scene.chapterNum}
          </div>
        </div>
      </div>

      {/* CHAPTER HEADER */}
      <div className="text-center px-6 pt-7 pb-3.5 relative z-10">
        <div className="text-[#ffd700] text-[15px] font-extrabold tracking-[0.18em] uppercase mb-1.5 [text-shadow:0_0_14px_rgba(255,215,0,0.45)]">
          {t('arena.chapter')} {scene.chapterNum}:
        </div>
        <h1 className="text-[27px] font-black m-0 [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]" style={{ color: accentColor }}>
          {scene.title}
        </h1>
      </div>

      {/* MAIN LAYOUT */}
      <div className={`flex flex-col md:flex-row gap-8 max-w-[1160px] mx-auto px-7 py-2 w-full items-start relative z-10 box-border transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'}`}>

        {/* SIDEBAR */}
        <div className="w-full md:w-[190px] shrink-0 flex flex-col items-center">
          <div 
            className="cursor-pointer text-center select-none outline-none tap-highlight-transparent p-1"
            onClick={() => setShowInfo(v => !v)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setShowInfo(v => !v)}
          >
            <div className="text-[#ffd700] font-extrabold text-lg mb-2.5 [text-shadow:0_0_12px_rgba(255,215,0,0.5)]">
              {t('arena.click_here')}
            </div>
            <div className={`w-28 h-28 rounded-full border-[3.5px] border-[#ffd700] flex items-center justify-center mx-auto transition-all duration-250 ${showInfo ? 'bg-[#ffd70033] shadow-[0_0_36px_rgba(255,215,0,0.65),0_0_70px_rgba(255,215,0,0.3)]' : 'bg-[#ffd70014] shadow-[0_0_20px_rgba(255,215,0,0.3)]'}`}>
              <UserCircle2 size={62} color="#ffd700" strokeWidth={1.5} />
            </div>
            <div className="text-[#ffd700] font-bold text-[13px] mt-2.5 leading-[1.45] [text-shadow:0_0_10px_rgba(255,215,0,0.4)]">
              {t('arena.for_info')}
            </div>
          </div>

          {showInfo && (
            <div className="animate-[fadeUp_0.5s_ease-out_both] bg-[#050014e6] p-4 rounded-[14px] mt-4 border border-[#ffd70059] w-full box-border shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <div className="text-[#ffd700] font-extrabold mb-1.5 text-[13px] flex items-center gap-[7px]">
                <Icon name={infoIcon} size={15} color="#ffd700" />
                {scene.infoBox.label}
              </div>
              <div className="text-[13px] leading-[1.65] text-white/85">{scene.infoBox.text}</div>
            </div>
          )}
        </div>

        {/* STAGE */}
        <div className="flex-1 flex flex-col gap-5.5 w-full">
          <div className="relative rounded-[18px] overflow-hidden border-2 border-[#ff4b9166] shadow-[0_0_40px_rgba(255,75,145,0.15),0_20px_60px_rgba(0,0,0,0.7)]">
            <img src={sceneImage} alt={scene.title} className="w-full block h-auto object-contain transition-opacity duration-500" />

            {/* Narration bubbles */}
            <div className="absolute right-4.5 top-1/2 -translate-y-1/2 flex flex-col justify-center gap-3.5 max-w-[295px] z-[5]">
              {scene.narration.map((line, i) => (
                <div key={i} 
                     className={`bg-white/95 backdrop-blur-xl text-[#1a0045] px-4 py-3 rounded-[14px] text-sm leading-[1.6] border-l-4 border-l-[#ff4b91] shadow-[0_6px_28px_rgba(0,0,0,0.4)] relative transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]
                     ${visibleLines > i ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[18px]'}
                     ${line.startsWith('"') || line.startsWith('\u201c') ? 'italic font-bold' : 'font-semibold'}`}>
                  <div className="absolute -left-[11px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-[11px] border-r-white/95" />
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Choices */}
          {allLinesIn && (
            <div className="animate-[fadeUp_0.5s_ease-out_both] flex gap-4 justify-center flex-wrap">
              {scene.choices.map((choice, i) => (
                <button
                  key={i}
                  disabled={saving}
                  className={getChoiceClass(choice.style)}
                  onClick={() => goTo(choice)}
                >
                  {choice.icon && <Icon name={choice.icon} size={18} />}
                  {choice.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}