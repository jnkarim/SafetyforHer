import React, { useState, useRef } from 'react';
import { Shield, Send, X, Camera, ChevronDown, AlertTriangle, Sparkles } from 'lucide-react';
import { createPost } from '../api/posts';
import api from '../api/axios';

const CATEGORIES = [
  { value: 'Stalking',    label: 'Stalking',       dot: '#f97316' },
  { value: 'Catfishing',  label: 'Catfishing',     dot: '#ff4b91' },
  { value: 'Gaming',      label: 'Gaming',         dot: '#a78bfa' },
  { value: 'Privacy',     label: 'Privacy',        dot: '#c084fc' },
  { value: 'ImageAbuse',  label: 'Image Abuse',    dot: '#38bdf8' },
  { value: 'DoxxAttack',  label: 'Doxx Attack',    dot: '#f43f5e' },
  { value: 'Harassment',  label: 'Harassment',     dot: '#fb923c' },
  { value: 'Tips',        label: 'Tips & Advice',  dot: '#34d399' },
];

const TYPES = [
  { value: 'story',    label: 'Story'    },
  { value: 'tip',      label: 'Tip'      },
  { value: 'question', label: 'Question' },
];

const CreatePost = ({ isOpen, onClose, refreshFeed }) => {
  const [formData, setFormData]         = useState({ title: '', content: '', category: 'Stalking', type: 'story' });
  const [image, setImage]               = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [error, setError]               = useState('');
  const [catOpen, setCatOpen]           = useState(false);
  const [charCount, setCharCount]       = useState(0);
  const fileRef                         = useRef(null);
  const dropRef                         = useRef(null);

  const activeCat = CATEGORIES.find(c => c.value === formData.category);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) { setImage(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const uploadImage = async (file) => {
    const imgData = new FormData();
    imgData.append('image', file);

    const res = await api.post('/posts/upload-image', imgData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = null;

      // Step 1: upload image first if one is attached
      if (image) {
        imageUrl = await uploadImage(image);
      }

      // Step 2: create post with JSON (imageUrl included if present)
      await createPost({
        title:    formData.title,
        content:  formData.content,
        category: formData.category,
        type:     formData.type,
        ...(imageUrl && { imageUrl }),
      });

      setSubmitted(true);
      setTimeout(() => {
        setFormData({ title: '', content: '', category: 'Stalking', type: 'story' });
        setImage(null);
        setImagePreview(null);
        setCharCount(0);
        if (refreshFeed) refreshFeed();
        onClose();
        setSubmitted(false);
      }, 1200);
    } catch (err) {
      console.error('Post creation failed', err);
      setError(err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setCatOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#05030d]/90 backdrop-blur-xl">

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#7c3aed]/10 blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-xl bg-[#0f0b1e] border border-white/[0.07] rounded-3xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col max-h-[95vh]">

        {/* Shimmer top bar */}
        <div
          className="h-[3px] w-full flex-shrink-0"
          style={{
            background: 'linear-gradient(90deg, #ff4b91, #7c3aed, #ff4b91)',
            backgroundSize: '200%',
            animation: 'shimBar 3s linear infinite',
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/[0.05] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff4b91] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-[#ff4b91]/20 flex-shrink-0">
              <Shield size={17} color="#fff" />
            </div>
            <div>
              <h2 className="text-[15px] font-black text-white uppercase tracking-wide leading-none">Create Story</h2>
              <p className="text-[10px] text-[#4a3d5c] font-semibold mt-0.5 tracking-widest uppercase">Share safely · stay anonymous</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-[#4a3d5c] hover:text-white hover:bg-[#ff4b91]/10 hover:border-[#ff4b91]/20 transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-7 py-6 space-y-5">

          {/* Category */}
          <div>
            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[#4a3d5c] mb-2">Category</label>
            <div className="relative" ref={dropRef}>
              <button
                type="button"
                onClick={() => setCatOpen(v => !v)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.03] border text-sm font-bold text-white transition-all ${catOpen ? 'border-[#ff4b91]/40 bg-[#ff4b91]/[0.04]' : 'border-white/[0.07] hover:border-white/[0.14]'}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: activeCat.dot }} />
                  {activeCat.label}
                </div>
                <ChevronDown size={14} className={`text-[#4a3d5c] transition-transform duration-200 ${catOpen ? 'rotate-180 text-[#ff4b91]' : ''}`} />
              </button>

              {catOpen && (
                <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-20 bg-[#1a1030] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl shadow-black/40">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => { setFormData(f => ({ ...f, category: cat.value })); setCatOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-left transition-colors ${formData.category === cat.value ? 'bg-[#ff4b91]/[0.06] text-white' : 'text-white/60 hover:bg-white/[0.04] hover:text-white'}`}
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.dot }} />
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[#4a3d5c] mb-2">Post Type</label>
            <div className="flex gap-2">
              {TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setFormData(f => ({ ...f, type: t.value }))}
                  className={`flex-1 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${
                    formData.type === t.value
                      ? 'bg-[#ff4b91]/10 border-[#ff4b91]/40 text-[#ff4b91]'
                      : 'bg-white/[0.03] border-white/[0.07] text-[#4a3d5c] hover:border-white/[0.14] hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[#4a3d5c] mb-2">Headline</label>
            <input
              type="text"
              required
              placeholder="What happened, in one line?"
              value={formData.title}
              onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 py-3.5 text-sm font-semibold text-white placeholder:text-[#2d2438] outline-none transition-all focus:border-[#ff4b91]/40 focus:bg-[#ff4b91]/[0.03] focus:ring-4 focus:ring-[#ff4b91]/[0.06] caret-[#ff4b91]"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[#4a3d5c] mb-2">Your Story</label>
            <div className="relative">
              <textarea
                required
                rows={4}
                placeholder="Share what happened. Your experience can help others protect themselves..."
                value={formData.content}
                onChange={(e) => { setFormData(f => ({ ...f, content: e.target.value })); setCharCount(e.target.value.length); }}
                className="w-full bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 py-4 pb-9 text-sm text-white/80 placeholder:text-[#2d2438] outline-none transition-all focus:border-[#ff4b91]/40 focus:bg-[#ff4b91]/[0.03] focus:ring-4 focus:ring-[#ff4b91]/[0.06] resize-none leading-relaxed caret-[#ff4b91]"
              />
              <div className="absolute bottom-3 right-4 flex items-center gap-1.5 pointer-events-none">
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${charCount > 0 ? 'bg-[#ff4b91]' : 'bg-[#2d2438]'}`}
                  style={charCount > 0 ? { boxShadow: '0 0 6px #ff4b91' } : {}}
                />
                <span className={`text-[10px] font-bold ${charCount > 0 ? 'text-[#ff4b91]' : 'text-[#2d2438]'}`}>
                  {charCount > 0 ? charCount : 'Draft'}
                </span>
              </div>
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[#4a3d5c] mb-2">
              Attach Evidence{' '}
              <span className="text-[#2d2438] normal-case tracking-normal font-medium">(optional)</span>
            </label>

            <input type="file" accept="image/*" ref={fileRef} onChange={handleImageChange} className="hidden" />

            {!imagePreview ? (
              <div
                onClick={() => fileRef.current.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="group flex flex-col items-center justify-center w-full h-28 bg-white/[0.02] border-2 border-dashed border-white/[0.08] rounded-2xl cursor-pointer hover:border-[#ff4b91]/40 hover:bg-[#ff4b91]/[0.03] transition-all"
              >
                <Camera size={20} className="text-[#3e324d] group-hover:text-[#ff4b91] transition-colors mb-2" />
                <span className="text-[11px] font-bold text-[#3e324d] group-hover:text-[#907aa9] uppercase tracking-widest transition-colors">
                  Click or drag image
                </span>
              </div>
            ) : (
              <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-[#ff4b91]/20">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <button
                  type="button"
                  onClick={() => { setImage(null); setImagePreview(null); }}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-[#ff4b91] transition-colors"
                >
                  <X size={14} />
                </button>
                <span className="absolute bottom-3 left-3 text-[10px] font-bold text-white/50 uppercase tracking-widest">
                  {image?.name?.length > 30 ? image.name.slice(0, 30) + '…' : image?.name}
                </span>
              </div>
            )}
          </div>

          {/* Privacy advisory */}
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-[#ff4b91]/[0.04] border border-[#ff4b91]/[0.10]">
            <div className="w-7 h-7 rounded-xl bg-[#ff4b91]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle size={13} color="#ff4b91" />
            </div>
            <p className="text-[11px] text-[#6b5780] leading-relaxed font-medium">
              <span className="text-[#907aa9] font-bold">Privacy tip: </span>
              Avoid real names, phone numbers, or exact locations. Your story is shared anonymously.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-red-500/[0.08] border border-red-500/20">
              <AlertTriangle size={13} color="#f87171" />
              <p className="text-[11px] text-red-400 font-semibold">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || submitted}
            className="relative w-full rounded-2xl py-4 text-white text-[11px] font-black uppercase tracking-[0.2em] overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ff4b91]/25 active:translate-y-0 disabled:opacity-60 disabled:cursor-default"
            style={{ background: 'linear-gradient(135deg, #ff4b91, #7c3aed)' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                {image ? 'Uploading...' : 'Publishing...'}
              </span>
            ) : submitted ? (
              <span className="flex items-center justify-center gap-2">
                <Sparkles size={14} /> Posted!
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Send size={13} /> Publish Story
              </span>
            )}
          </button>

        </form>
      </div>

      <style>{`@keyframes shimBar { 0%{background-position:0%} 100%{background-position:200%} }`}</style>
    </div>
  );
};

export default CreatePost;