import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, FileText, ChevronRight, PlayCircle, AlertCircle, Layers } from 'lucide-react';

const SERIES_PATHS = ['/scenerio', '#', '#'];
const SERIES_COLORS = ['#ff4b91', '#a78bfa', '#10b981'];

// ── Language Toggle ──
const LangToggle = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  return (
    <div style={{
      position: 'fixed', top: 20, right: 24, zIndex: 9999,
      display: 'flex', alignItems: 'center',
      background: 'rgba(16,13,32,0.85)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 100, padding: 4, gap: 2,
    }}>
      <button
        onClick={() => i18n.changeLanguage('en')}
        style={{
          padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer',
          fontWeight: 800, fontSize: 11, letterSpacing: '0.05em', transition: 'all 0.2s',
          background: !isBn ? 'linear-gradient(135deg,#ff4b91,#7c3aed)' : 'transparent',
          color: !isBn ? '#fff' : 'rgba(255,255,255,0.3)',
        }}
      >EN</button>
      <button
        onClick={() => i18n.changeLanguage('bn')}
        style={{
          padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer',
          fontWeight: 800, fontSize: 11, transition: 'all 0.2s',
          background: isBn ? 'linear-gradient(135deg,#ff4b91,#7c3aed)' : 'transparent',
          color: isBn ? '#fff' : 'rgba(255,255,255,0.3)',
        }}
      >বাংলা</button>
    </div>
  );
};

export default function SeriesFeed() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const series = t('scenarios.series', { returnObjects: true });

  return (
    <div className="min-h-screen bg-[#0b0813] text-white font-['Quicksand'] py-16 px-6">
      <LangToggle />

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-24 flex flex-col items-center text-center px-6">
        <div className="w-12 h-1 bg-[#ff4b91] mb-6 rounded-full" />
        <div className="flex items-center justify-center gap-3 mb-2">
          <Layers size={28} className="text-[#ff4b91]" />
          <h1 className="text-5xl font-black tracking-tight uppercase">
            {t('scenarios.title_main')}<span className="text-[#ff4b91]">{t('scenarios.title_accent')}</span>
          </h1>
        </div>
        <p className="text-[#907aa9] text-sm font-bold uppercase tracking-[0.2em] max-w-md">
          {t('scenarios.subtitle')}
        </p>
      </div>

      {/* Series List */}
      <div className="max-w-3xl mx-auto relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#ff4b91] via-[#a78bfa] to-[#1a1425] -translate-x-1/2 opacity-10 z-0 hidden md:block" />

        <div className="space-y-20 relative z-10">
          {series.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center gap-10 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Content Card */}
              <div className="flex-1 w-full">
                <div
                  className={`p-8 rounded-[32px] bg-[#0b0813] border transition-all duration-500 group cursor-pointer
                    ${item.status === 'Ready'
                      ? 'border-[#ff4b91]/40 shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:border-[#ff4b91] hover:bg-[#1a1425]'
                      : 'border-white/5 opacity-40 grayscale'}`}
                  onClick={() => SERIES_PATHS[index] !== '#' && navigate(SERIES_PATHS[index])}
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black tracking-[0.15em] uppercase py-1.5 px-3 bg-[#ff4b91]/10 text-[#ff4b91] rounded-lg border border-[#ff4b91]/20">
                      {item.difficulty}
                    </span>
                    <div className="flex items-center gap-2 text-[#907aa9] text-[10px] font-bold uppercase">
                      <FileText size={12} /> {t('scenarios.case_file')}
                    </div>
                  </div>

                  <h3 className="text-3xl font-black mb-1 tracking-tight">{item.title}</h3>
                  <p className="text-[#ff4b91] text-[11px] font-black mb-5 uppercase tracking-widest opacity-80">{item.subtitle}</p>
                  <p className="text-[#907aa9] text-[15px] leading-relaxed mb-8 font-medium italic">
                    "{item.description}"
                  </p>

                  {item.status === 'Ready' ? (
                    <div className="flex items-center gap-2 text-white font-black text-xs group-hover:gap-4 transition-all uppercase tracking-[0.2em] pt-4 border-t border-white/5">
                      {t('scenarios.start_btn')} <ChevronRight size={16} className="text-[#ff4b91]" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[#3e324d] font-black text-xs uppercase tracking-widest pt-4 border-t border-white/5">
                      <Lock size={14} /> {t('scenarios.restricted')}
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline Node */}
              <div className="relative flex items-center justify-center shrink-0">
                <div className={`w-14 h-14 rounded-2xl rotate-45 border-2 flex items-center justify-center bg-[#0b0813] z-20 transition-all duration-500
                  ${item.status === 'Ready' ? 'border-[#ff4b91] shadow-[0_0_15px_rgba(255,75,145,0.3)]' : 'border-[#1a1425]'}`}>
                  <div className="-rotate-45">
                    {item.status === 'Ready' ? (
                      <PlayCircle size={24} className="text-[#ff4b91]" />
                    ) : (
                      <Lock size={20} className="text-[#1a1425]" />
                    )}
                  </div>
                </div>
                <span className="absolute -bottom-8 text-xs font-black text-[#3e324d] uppercase tracking-widest">
                  {t('scenarios.part')} 0{index + 1}
                </span>
              </div>

              <div className="flex-1 hidden md:block" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-32 max-w-lg mx-auto p-8 rounded-2xl bg-[#1a1425]/30 border border-white/5 text-center">
        <div className="flex justify-center mb-4 text-[#ff4b91] opacity-50"><AlertCircle size={30} /></div>
        <p className="text-[#907aa9] text-sm font-semibold leading-relaxed">
          {t('scenarios.unlock_note')}
        </p>
      </div>
    </div>
  );
}