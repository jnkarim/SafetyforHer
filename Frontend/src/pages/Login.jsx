import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react'

const Login = () => {
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const [form, setForm]         = useState({ email: '', password: '' })
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)

  const set = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return setError('Please fill in all fields.')
    setLoading(true)
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-2 font-sans">

      {/* ── LEFT PANEL — hidden on mobile, shown on lg ── */}
      <div className="hidden lg:flex relative bg-[#0b0813] flex-col justify-between p-14 overflow-hidden">

        {/* Background effects */}
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-[#7c3aed]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -left-8 w-80 h-80 rounded-full bg-[#ff4b91]/10 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full border border-white/[0.04] pointer-events-none" />
        <div
          className="absolute top-0 right-0 w-px h-full pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent 10%, rgba(255,75,145,0.3) 45%, rgba(124,58,237,0.3) 65%, transparent 90%)' }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff4b91] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-[#ff4b91]/25">
            <Shield size={19} color="#fff" />
          </div>
          <span className="text-white font-bold text-base tracking-tight">
            Safety<span className="text-[#ff4b91]">forHer</span>
          </span>
        </div>

        {/* Middle copy */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4b91] shadow-[0_0_8px_#ff4b91] animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#ff4b91]">Secure Platform</span>
          </div>
          <h2
            className="text-[2.6rem] leading-[1.12] font-black text-white mb-5 tracking-tight"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Your safety,<br />
            <em className="not-italic text-white/40">our priority.</em>
          </h2>
          <p className="text-sm text-white/35 leading-[1.75] max-w-xs">
            A trusted space to report, document, and protect yourself from digital violence — backed by AI and community support.
          </p>
        </div>

        {/* Trust signals */}
        <div className="relative z-10 flex flex-col gap-3">
          {[
            'End-to-end encrypted sessions',
            'Anonymous by default',
            'BD Cyber Security Ordinance 2024 compliant',
          ].map((t) => (
            <div key={t} className="flex items-center gap-2.5 text-xs text-white/30">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#ff4b91] to-[#7c3aed] opacity-60 flex-shrink-0" />
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 bg-white flex flex-col">

        {/* Mobile-only top bar with logo */}
        <div className="lg:hidden flex items-center gap-3 px-6 py-5 bg-[#0b0813]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff4b91] to-[#7c3aed] flex items-center justify-center shadow-md shadow-[#ff4b91]/25">
            <Shield size={17} color="#fff" />
          </div>
          <span className="text-white font-bold text-sm tracking-tight">
            Safety<span className="text-[#ff4b91]">forHer</span>
          </span>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10 lg:p-14">
          <div className="w-full max-w-sm">

            <h1
              className="text-3xl sm:text-[1.9rem] font-black text-[#0b0813] mb-1.5 tracking-tight"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Sign in
            </h1>
            <p className="text-sm text-[#9ca3af] mb-8">
              Enter your credentials to continue.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#6b7280]">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="you@example.com"
                  autoFocus
                  required
                  className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-3.5 text-sm text-[#0b0813] placeholder:text-[#d1d5db] outline-none transition-all focus:border-[#ff4b91] focus:ring-4 focus:ring-[#ff4b91]/10 focus:bg-white"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#6b7280]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-3.5 pr-11 text-sm text-[#0b0813] placeholder:text-[#d1d5db] outline-none transition-all focus:border-[#ff4b91] focus:ring-4 focus:ring-[#ff4b91]/10 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors p-1"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-medium">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-4 text-white text-sm font-bold tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ff4b91]/30 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #ff4b91, #7c3aed)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#f3f4f6]" />
              <span className="text-[11px] text-[#d1d5db] font-medium">or</span>
              <div className="flex-1 h-px bg-[#f3f4f6]" />
            </div>

            <p className="text-center text-sm text-[#9ca3af]">
              No account?{' '}
              <Link to="/register" className="text-[#7c3aed] font-bold hover:text-[#ff4b91] transition-colors">
                Create one
              </Link>
            </p>

          </div>
        </div>

        {/* Mobile-only footer trust signals */}
        <div className="lg:hidden px-6 pb-8 flex flex-col gap-2">
          {[
            'End-to-end encrypted',
            'Anonymous by default',
            'BD Cyber Security Ordinance 2024 compliant',
          ].map((t) => (
            <div key={t} className="flex items-center gap-2 text-xs text-[#9ca3af]">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#ff4b91] to-[#7c3aed] flex-shrink-0" />
              {t}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Login