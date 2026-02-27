import React, { useState } from 'react';
import {
    ShieldAlert,
    FileText,
    Send,
    CheckCircle,
    Copy,
    ArrowLeft
} from 'lucide-react';
import { submitReport } from '../api/reports_api';

const ReportIncident = () => {
    const [formData, setFormData] = useState({
        incidentType: '',
        platform: '',
        description: '',
    });
    const [submittedCode, setSubmittedCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.incidentType || !formData.platform || !formData.description) return;

        setLoading(true);
        try {
            const response = await submitReport(formData);
            setSubmittedCode(response.caseCode);
        } catch (error) {
            console.error('Submission failed:', error);
            // Optional: Add a toast notification here
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(submittedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Success View
    if (submittedCode) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0b0813] p-6 text-center font-['Quicksand']">
                <div className="max-w-md rounded-[40px] border-2 border-[#10b981] bg-[#1a1425] p-10 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                    <CheckCircle className="mx-auto mb-6 text-[#10b981]" size={64} />
                    <h2 className="mb-4 text-3xl font-black text-white uppercase italic">Report Secured</h2>
                    <p className="mb-8 font-medium text-[#907aa9]">
                        Your identity is safe. Use this secret code to track your case status anonymously.
                        <span className="block mt-2 text-[#ff4b91] font-bold text-sm">Do not lose this code!</span>
                    </p>

                    <div className="group relative mb-8">
                        <div className="rounded-2xl border border-white/10 bg-[#0b0813] p-5 text-2xl font-black tracking-[0.2em] text-[#ff4b91]">
                            {submittedCode}
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0b0813] shadow-lg transition-transform hover:scale-110 active:scale-90"
                        >
                            {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                        </button>
                    </div>

                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex items-center justify-center gap-2 mx-auto text-[#907aa9] hover:text-white font-black uppercase text-xs tracking-widest transition-colors"
                    >
                        <ArrowLeft size={14} /> Back to Safety Hub
                    </button>
                </div>
            </div>
        );
    }

    // Form View
    return (
        <div className="min-h-screen bg-[#0b0813] p-8 font-['Quicksand'] text-white">
            <div className="mx-auto max-w-3xl">

                {/* Header */}
                <div className="mb-12 flex items-center gap-4 border-l-4 border-[#ff4b91] pl-6">
                    <ShieldAlert size={40} className="text-[#ff4b91]" />
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tight">Anonymous Reporting</h1>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#907aa9]">
                            Safe · Private · Encrypted
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-8 rounded-[40px] border border-white/5 bg-[#1a1425] p-10 shadow-2xl"
                >
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="ml-2 text-xs font-black uppercase tracking-widest text-[#907aa9]">
                                Type of Abuse
                            </label>
                            <select
                                required
                                className="w-full rounded-2xl border border-white/10 bg-[#0b0813] p-4 text-sm outline-none transition-all focus:border-[#ff4b91]"
                                value={formData.incidentType}
                                onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                <option value="doxxing">Doxxing / Privacy Leak</option>
                                <option value="impersonation">Impersonation</option>
                                <option value="harassment">Cyber Harassment</option>
                                <option value="images">Image-Based Abuse</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="ml-2 text-xs font-black uppercase tracking-widest text-[#907aa9]">
                                Platform
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Facebook, Discord"
                                className="w-full rounded-2xl border border-white/10 bg-[#0b0813] p-4 text-sm outline-none transition-all focus:border-[#ff4b91]"
                                value={formData.platform}
                                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="ml-2 text-xs font-black uppercase tracking-widest text-[#907aa9]">
                            Detailed Description
                        </label>
                        <textarea
                            required
                            rows="5"
                            placeholder="Describe what happened. Do not include your real name if you wish to remain anonymous."
                            className="w-full resize-none rounded-2xl border border-white/10 bg-[#0b0813] p-4 text-sm outline-none transition-all focus:border-[#ff4b91]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-6 md:flex-row">
                        <div className="flex items-center gap-3 text-xs font-bold text-[#907aa9]">
                            <FileText size={16} className="text-[#ff4b91]" />
                            Anonymity guaranteed by design.
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-3 rounded-2xl bg-[#ff4b91] px-10 py-4 text-sm font-black transition-all shadow-[0_8px_30px_rgba(255,75,145,0.3)] hover:-translate-y-1 hover:bg-[#ff4b91]/90 disabled:opacity-50"
                        >
                            {loading ? (
                                <>PROCESSING...</>
                            ) : (
                                <>
                                    <Send size={18} /> SUBMIT ANONYMOUS REPORT
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportIncident;