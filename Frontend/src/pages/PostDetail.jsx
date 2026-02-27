import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPost, upvotePost, addComment, deletePost, flagPost } from '../api/posts'
import { useAuth } from '../context/AuthContext'
import UpvoteButton from '../components/posts/UpvoteButton'
import CommentCard from '../components/posts/CommentCard'
import Spinner from '../components/ui/Spinner'
import { ArrowLeft, MessageCircle, Share2, MoreVertical, Trash2, Flag, AlertTriangle } from 'lucide-react'

const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 84600) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

const TYPE_ICONS = { story: '📖', tip: '💡', question: '❓' }
const TYPE_LABELS = { story: 'Story', tip: 'Tip', question: 'Question' }

const PostDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [commentErr, setCommentErr] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [imgExpanded, setImgExpanded] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPost(id)
        setPost(data.post)
      } catch {
        setError('Post not found.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleComment = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (!comment.trim()) return
    setSubmitting(true)
    setCommentErr('')
    try {
      const res = await addComment(id, comment.trim())
      setPost((p) => ({ ...p, comments: [...p.comments, res.comment] }))
      setComment('')
    } catch (err) {
      setCommentErr(err.response?.data?.message || 'Failed to post comment.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCommentUpvote = (_commentId, res) => {
    setPost((p) => ({
      ...p,
      comments: p.comments.map((c) =>
        c._id === _commentId ? { ...c, upvotes: res.upvotes, userUpvoted: res.userUpvoted } : c,
      ),
    }))
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return
    try {
      await deletePost(id)
      setDeleted(true)
      setTimeout(() => navigate('/'), 1500)
    } catch { }
  }

  const handleFlag = async () => {
    try {
      await flagPost(id)
      alert('Post flagged for review. Thank you.')
      setMenuOpen(false)
    } catch { }
  }

  if (loading) return (
    <div className="flex justify-center py-24">
      <Spinner size="lg" />
    </div>
  )

  if (error) return (
    <div className="max-w-2xl mx-auto px-5 py-16 text-center">
      <p className="text-red-400 font-bold mb-4">{error}</p>
      <Link to="/" className="text-violet-400 hover:text-violet-300 font-bold underline">← Back to feed</Link>
    </div>
  )

  if (deleted) return (
    <div className="max-w-2xl mx-auto px-5 py-16 text-center text-emerald-400 font-bold">
      Post deleted. Redirecting...
    </div>
  )

  const isOwner = user && post.author?._id === user._id

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5 animate-fade-in">

      {/* Back Button */}
      <Link
        to="/community"
        className="flex items-center gap-1.5 text-sm text-white/80 hover:text-violet-400
                   transition-colors w-fit group font-bold tracking-wide"
      >
        <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
        Back to community
      </Link>

      {/* Post card */}
      <div className="bg-[#121225] border border-white/20 rounded-2xl overflow-hidden shadow-2xl">

        {/* Top meta bar */}
        <div className="flex items-center justify-between px-5 py-3.5
                        border-b border-white/10 bg-white/[0.04]">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] text-white font-black bg-violet-600/30 border border-violet-500/40 px-2 py-0.5 rounded uppercase tracking-tighter">
              {TYPE_ICONS[post.type]} {TYPE_LABELS[post.type]}
            </span>
            <span className="text-xs text-violet-300 font-black tracking-widest">
              S/{post.category?.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-white/70 font-bold">
            <span>{timeAgo(post.createdAt)}</span>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                <MoreVertical size={16} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-10 bg-[#1a1a2e] border border-white/20
                               rounded-xl shadow-2xl overflow-hidden z-20 min-w-[180px]
                               animate-fade-in ring-1 ring-black">
                  {isOwner && (
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-4 py-3 text-sm text-white/80
                                 hover:bg-red-500/10 hover:text-red-400 transition-colors font-bold
                                 border-b border-white/5 flex items-center gap-2.5"
                    >
                      <Trash2 size={14} />
                      Delete post
                    </button>
                  )}
                  <button
                    onClick={handleFlag}
                    className="w-full text-left px-4 py-3 text-sm text-white/80
                               hover:bg-white/5 hover:text-white transition-colors font-bold
                               flex items-center gap-2.5"
                  >
                    <Flag size={14} />
                    Flag post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-row">
          {/* Vote column */}
          <div className="hidden sm:flex flex-col items-center pt-6 px-4 bg-black/30 border-r border-white/5">
            <UpvoteButton
              initialCount={post.upvotes}
              initialVoted={post.userUpvoted}
              onUpvote={() => upvotePost(id)}
              vertical={true}
            />
          </div>

          <div className="flex-1 p-6 min-w-0">
            {/* Author info */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-violet-600 to-indigo-700
                              flex items-center justify-center text-white text-xs font-black shadow-lg ring-2 ring-white/10">
                {post.author?.username?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-black text-violet-300">
                  {post.author?.username ?? 'Anonymous'}
                </span>
                <span className="text-[10px] text-white/60 font-bold uppercase tracking-tighter">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-black text-2xl text-white leading-tight mb-5 tracking-tight">
              {post.title}
            </h1>

            {/* Content */}
            <div className="text-[16px] text-white/95 leading-relaxed mb-6 font-medium selection:bg-violet-500/30">
              {post.content.split('\n').map((line, i) =>
                line
                  ? <p key={i} className="mb-4 last:mb-0">{line}</p>
                  : <br key={i} />
              )}
            </div>

            {/* Image Attachment */}
            {post.imageUrl && (
              <div className="mt-4 mb-8 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl bg-black/20 group">
                <img
                  src={post.imageUrl}
                  alt="Attachment"
                  onClick={() => setImgExpanded(true)}
                  className="w-full max-h-[500px] object-contain cursor-zoom-in group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center gap-4 pt-5 border-t border-white/10">
              <div className="sm:hidden">
                <UpvoteButton
                  initialCount={post.upvotes}
                  initialVoted={post.userUpvoted}
                  onUpvote={() => upvotePost(id)}
                  vertical={false}
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-xs font-black
                                 text-white bg-white/5 hover:bg-white/10
                                 rounded-xl border border-white/20 transition-all">
                <MessageCircle size={13} />
                {post.comments?.length ?? 0} Comments
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-xs font-black
                                 text-white/80 hover:text-white hover:bg-white/10
                                 rounded-xl border border-white/20 transition-all">
                <Share2 size={13} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-[#121225] border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">

        {user ? (
          <form onSubmit={handleComment} className="flex flex-col gap-4">
            <div className="text-sm text-white font-bold">
              Comment as <span className="text-violet-400 font-black tracking-wide underline underline-offset-4">{user.username}</span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What are your thoughts?"
              rows={4}
              maxLength={1000}
              className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-5 py-4
                         text-[15px] text-white placeholder-white/30 focus:outline-none
                         focus:border-violet-500 focus:bg-black/60 transition-all shadow-inner resize-none"
            />
            {commentErr && (
              <p className="text-xs text-red-400 font-black tracking-wide flex items-center gap-1.5">
                <AlertTriangle size={12} /> {commentErr}
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/60 font-black font-mono bg-white/10 px-2.5 py-1 rounded-lg">
                {comment.length} / 1000
              </span>
              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="px-8 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs
                           font-black rounded-xl transition-all shadow-xl active:scale-95
                           disabled:opacity-30 disabled:grayscale uppercase tracking-widest"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-violet-900/20 border-2 border-violet-500/40 rounded-2xl px-6 py-8
                          text-[15px] text-white font-bold text-center">
            Please <Link to="/login" className="text-violet-400 font-black underline decoration-2">Log in</Link> or <Link to="/register" className="text-violet-400 font-black underline decoration-2">Sign up</Link> to join the discussion.
          </div>
        )}

        {/* Sort & Stats */}
        {post.comments?.length > 0 && (
          <div className="flex items-center gap-3 pb-4 border-b-2 border-white/10">
            <span className="text-xs font-black text-white uppercase tracking-widest">
              {post.comments.length} Discussion{post.comments.length !== 1 ? 's' : ''}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[10px] text-white/50 font-black uppercase">Sort:</span>
              <button className="text-[10px] text-violet-300 font-black px-3 py-1 bg-violet-500/20 rounded-full border border-violet-500/30">
                Best
              </button>
            </div>
          </div>
        )}

        {/* Comments List */}
        {!post.comments?.length ? (
          <div className="py-12 text-center">
            <p className="text-sm text-white/40 font-bold italic">
              No thoughts shared yet. Be the first!
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {post.comments.map((c) => (
              <CommentCard
                key={c._id}
                comment={c}
                postId={id}
                onUpvote={handleCommentUpvote}
              />
            ))}
          </div>
        )}
      </div>

      {/* Full-screen Image Overlay */}
      {imgExpanded && (
        <div
          className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-md
                     flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
          onClick={() => setImgExpanded(false)}
        >
          <img
            src={post.imageUrl}
            alt="Expanded view"
            className="max-w-full max-h-full rounded-lg shadow-2xl object-contain animate-scale-in"
          />
          <button
            onClick={() => setImgExpanded(false)}
            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20
                       text-white flex items-center justify-center transition-all shadow-xl border border-white/20"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

export default PostDetail