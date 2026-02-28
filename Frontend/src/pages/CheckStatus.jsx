import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Loader2, ShieldCheck, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { getReportStatus } from '../api/reports_api';
import { useNavigate } from 'react-router-dom';

// ── Language toggle (same as Home.jsx & ReportIncident.jsx) ───────────────────
const LangToggle = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  return (
    <div style={{
      position: 'fixed', top: 20, right: 24, zIndex: 9999,
      display: 'flex', alignItems: 'center',
      background: 'rgba(11,8,19,0.85)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 100, padding: 4,
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      fontFamily: "'Quicksand', sans-serif",
      gap: 2,
    }}>
      <button
        onClick={() => i18n.changeLanguage('en')}
        style={{
          padding: '7px 16px', borderRadius: 100, border: 'none', cursor: 'pointer',
          fontWeight: 800, fontSize: 12, letterSpacing: '0.05em',
          transition: 'all 0.2s',
          background: !isBn ? 'linear-gradient(135deg,#ff4b91,#8b5cf6)' : 'transparent',
          color: !isBn ? '#fff' : 'rgba(255,255,255,0.35)',
        }}
      >EN</button>
      <button
        onClick={() => i18n.changeLanguage('bn')}
        style={{
          padding: '7px 16px', borderRadius: 100, border: 'none', cursor: 'pointer',
          fontWeight: 800, fontSize: 12, letterSpacing: '0.05em',
          transition: 'all 0.2s',
          background: isBn ? 'linear-gradient(135deg,#ff4b91,#8b5cf6)' : 'transparent',
          color: isBn ? '#fff' : 'rgba(255,255,255,0.35)',
        }}
      >বাংলা</button>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const CheckStatus = () => {
  const { t } = useTranslation();
  const [caseCode, setCaseCode] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!caseCode.trim()) return;

    setLoading(true);
    setError('');
    setReport(null);

    try {
      const response = await getReportStatus(caseCode.trim().toUpperCase());
      setReport(response.data);
    } catch (err) {
      setError(t('status.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0813] p-8 font-['Quicksand'] text-white">
      <LangToggle />
      <div className="mx-auto max-w-2xl mt-12">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-[#ff4b91]/10 border border-[#ff4b91]/20 mb-4">
            <Search size={32} className="text-[#ff4b91]" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            {t('status.title')}
          </h1>
          <p className="text-[#907aa9] font-bold text-sm mt-2">
            {t('status.subtitle')}
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="relative group">
            <input
              type="text"
              placeholder={t('status.placeholder')}
              className="w-full bg-[#1a1425] border-2 border-white/5 p-5 rounded-3xl outline-none focus:border-[#ff4b91] transition-all text-xl font-black tracking-widest placeholder:tracking-normal placeholder:font-medium"
              value={caseCode}
              onChange={(e) => setCaseCode(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#ff4b91] hover:bg-[#ff4b91]/90 p-3.5 rounded-2xl transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Search size={24} />}
            </button>
          </div>
          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-400 font-bold text-sm px-4">
              <AlertCircle size={16} /> {error}
            </div>
          )}
        </form>

        {/* Result Card */}
        {report && (
          <div className="animate-[fadeUp_0.5s_ease-out_both] bg-[#1a1425] border border-[#ff4b91]/20 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <ShieldCheck size={120} className="text-[#ff4b91]" />
            </div>

            <div className="space-y-6 relative z-10">
              {/* Status */}
              <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                <div className="bg-[#10b981]/10 p-3 rounded-2xl">
                  <Clock className="text-[#10b981]" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#907aa9] uppercase tracking-widest">
                    {t('status.current_status')}
                  </p>
                  <p className="text-2xl font-black text-[#10b981]">{report.status}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-black text-[#3e324d] uppercase tracking-widest mb-1">
                    {t('status.type_label')}
                  </p>
                  <p className="font-bold text-white uppercase">{report.incidentType}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-[#3e324d] uppercase tracking-widest mb-1">
                    {t('status.reported_on')}
                  </p>
                  <p className="font-bold text-white">
                    {new Date(report.createdAt).toLocaleDateString('en-US')}
                  </p>
                </div>
              </div>

              {/* Note */}
              <div className="bg-[#0b0813] p-4 rounded-2xl text-sm text-[#907aa9] leading-relaxed border border-white/5">
                <strong>{t('status.note_label')}</strong> {t('status.note_text')}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="mt-12 flex items-center gap-2 mx-auto text-[#3e324d] hover:text-[#ff4b91] font-black uppercase text-xs tracking-widest transition-all"
        >
          <ArrowLeft size={16} /> {t('status.go_back')}
        </button>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CheckStatus;