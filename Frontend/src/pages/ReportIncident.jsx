import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ShieldAlert,
    FileText,
    Send,
    CheckCircle,
    Copy,
    ArrowLeft,
    Link2,
    ImagePlus,
    X
} from 'lucide-react';
import { submitReport } from '../api/reports_api';

// ── Language toggle (identical to Home.jsx) ───────────────────────────────────
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
const ReportIncident = () => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        incidentType: '',
        platform: '',
        description: '',
        offenderLink: '',
    });
    const [screenshots, setScreenshots] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [submittedCode, setSubmittedCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef(null);

    const handleScreenshotChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const combined = [...screenshots, ...files].slice(0, 5);
        setScreenshots(combined);
        setPreviews(combined.map((f) => URL.createObjectURL(f)));
        e.target.value = '';
    };

    const removeScreenshot = (index) => {
        const updated = screenshots.filter((_, i) => i !== index);
        setScreenshots(updated);
        setPreviews(updated.map((f) => URL.createObjectURL(f)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.incidentType || !formData.platform || !formData.description) return;
        setLoading(true);
        try {
            const payload = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                if (val) payload.append(key, val);
            });
            screenshots.forEach((file) => payload.append('screenshots', file));
            const response = await submitReport(payload);
            setSubmittedCode(response.caseCode);
        } catch (error) {
            console.error('Submission failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(submittedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ── Success View ────────────────────────────────────────────────────────
    if (submittedCode) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0b0813] p-6 text-center font-['Quicksand']">
                <LangToggle />
                <div className="max-w-md rounded-[40px] border-2 border-[#10b981] bg-[#1a1425] p-10 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                    <CheckCircle className="mx-auto mb-6 text-[#10b981]" size={64} />
                    <h2 className="mb-4 text-3xl font-black text-white uppercase italic">
                        {t('report.success_title')}
                    </h2>
                    <p className="mb-8 font-medium text-[#907aa9]">
                        {t('report.success_desc')}
                        <span className="block mt-2 text-[#ff4b91] font-bold text-sm">
                            {t('report.success_warning')}
                        </span>
                    </p>

                    <div className="group relative mb-8">
                        <div className="rounded-2xl border border-white/10 bg-[#0b0813] p-5 text-2xl font-black tracking-[0.2em] text-[#ff4b91]">
                            {submittedCode}
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0b0813] shadow-lg transition-transform hover:scale-110 active:scale-90"
                            title={t('report.copy_btn_copied')}
                        >
                            {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                        </button>
                    </div>

                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex items-center justify-center gap-2 mx-auto text-[#907aa9] hover:text-white font-black uppercase text-xs tracking-widest transition-colors"
                    >
                        <ArrowLeft size={14} /> {t('report.back_btn')}
                    </button>
                </div>
            </div>
        );
    }

    // ── Form View ────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#0b0813] p-8 font-['Quicksand'] text-white">
            <LangToggle />
            <div className="mx-auto max-w-3xl">

                {/* Header */}
                <div className="mb-12 flex items-center gap-4 border-l-4 border-[#ff4b91] pl-6">
                    <ShieldAlert size={40} className="text-[#ff4b91]" />
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tight">
                            {t('report.title')}
                        </h1>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#907aa9]">
                            {t('report.subtitle')}
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-8 rounded-[40px] border border-white/5 bg-[#1a1425] p-10 shadow-2xl"
                >
                    {/* Row 1: Type + Platform */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="ml-2 text-xs font-black uppercase tracking-widest text-[#907aa9]">
                                {t('report.abuse_type_label')}
                            </label>
                            <select
                                required
                                className="w-full rounded-2xl border border-white/10 bg-[#0b0813] p-4 text-sm outline-none transition-all focus:border-[#ff4b91]"
                                value={formData.incidentType}
                                onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
                            >
                                <option value="">{t('report.abuse_type_placeholder')}</option>
                                <option value="doxxing">{t('report.abuse_types.doxxing')}</option>
                                <option value="impersonation">{t('report.abuse_types.impersonation')}</option>
                                <option value="harassment">{t('report.abuse_types.harassment')}</option>
                                <option value="images">{t('report.abuse_types.images')}</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="ml-2 text-xs font-black uppercase tracking-widest text-[#907aa9]">
                                {t('report.platform_label')}
                            </label>
                            <input
                                required
                                type="text"
                                placeholder={t('report.platform_placeholder')}
                                className="w-full rounded-2xl border border-white/10 bg-[#0b0813] p-4 text-sm outline-none transition-all focus:border-[#ff4b91]"
                                value={formData.platform}
                                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Offender Link */}
                    <div className="space-y-2">
                        <label className="ml-2 text-xs font-black uppercase tracking-widest text-[#907aa9]">
                            {t('report.offender_link_label')}{' '}
                            <span className="normal-case font-medium text-white/30">
                                {t('report.offender_link_optional')}
                            </span>
                        </label>
                        <div className="relative">
                            <Link2
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#907aa9] pointer-events-none"
                            />
                            <input
                                type="url"
                                placeholder={t('report.offender_link_placeholder')}
                                className="w-full rounded-2xl border border-white/10 bg-[#0b0813] pl-10 pr-4 py-4 text-sm outline-none transition-all focus:border-[#ff4b91]"
                                value={formData.offenderLink}
                                onChange={(e) => setFormData({ ...formData, offenderLink: e.target.value })}
                            />
                        </div>
                        <p className="ml-2 text-[11px] text-white/25 font-medium">
                            {t('report.offender_link_hint')}
                        </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="ml-2 text-xs font-black uppercase tracking-widest text-[#907aa9]">
                            {t('report.description_label')}
                        </label>
                        <textarea
                            required
                            rows="5"
                            placeholder={t('report.description_placeholder')}
                            className="w-full resize-none rounded-2xl border border-white/10 bg-[#0b0813] p-4 text-sm outline-none transition-all focus:border-[#ff4b91]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Screenshot Upload */}
                    <div className="space-y-3">
                        <label className="ml-2 text-xs font-black uppercase tracking-widest text-[#907aa9]">
                            {t('report.screenshots_label')}{' '}
                            <span className="normal-case font-medium text-white/30">
                                {t('report.screenshots_optional')}
                            </span>
                        </label>

                        {/* Previews */}
                        {previews.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {previews.map((src, i) => (
                                    <div key={i} className="relative group">
                                        <img
                                            src={src}
                                            alt={`screenshot-${i + 1}`}
                                            className="h-24 w-24 rounded-2xl object-cover border border-white/10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeScreenshot(i)}
                                            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#ff4b91] text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {screenshots.length < 5 && (
                            <>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpg,image/jpeg,image/png,image/gif,image/webp"
                                    multiple
                                    className="hidden"
                                    onChange={handleScreenshotChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/10 bg-[#0b0813] p-5 text-sm font-bold text-[#907aa9] transition-all hover:border-[#ff4b91]/50 hover:text-[#ff4b91]"
                                >
                                    <ImagePlus size={20} />
                                    {previews.length === 0
                                        ? t('report.screenshots_upload_btn')
                                        : `${t('report.screenshots_add_more')} (${screenshots.length} / 5)`}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-6 md:flex-row">
                        <div className="flex items-center gap-3 text-xs font-bold text-[#907aa9]">
                            <FileText size={16} className="text-[#ff4b91]" />
                            {t('report.anonymity_note')}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-3 rounded-2xl bg-[#ff4b91] px-10 py-4 text-sm font-black transition-all shadow-[0_8px_30px_rgba(255,75,145,0.3)] hover:-translate-y-1 hover:bg-[#ff4b91]/90 disabled:opacity-50 uppercase tracking-wide"
                        >
                            {loading
                                ? t('report.processing')
                                : <><Send size={18} /> {t('report.submit_btn')}</>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportIncident;