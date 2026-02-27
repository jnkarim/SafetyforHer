import { upvoteComment } from '../../api/posts'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000)
  if (s < 60)    return 'just now'
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

const CommentCard = ({ comment, postId, onUpvote }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [count, setCount] = useState(comment.upvotes ?? 0)
  const [voted, setVoted] = useState(comment.userUpvoted ?? false)
  const [loading, setLoading] = useState(false)

  const handleUpvote = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return navigate('/login')
    if (loading) return

    const prevCount = count
    const prevVoted = voted

    setLoading(true)
    setCount((c) => prevVoted ? c - 1 : c + 1)
    setVoted(!prevVoted)

    try {
      const res = await upvoteComment(postId, comment._id)
      if (res && typeof res.upvotes === 'number') {
        setCount(res.upvotes)
        setVoted(res.userUpvoted)
      }
      onUpvote?.(comment._id, res)
    } catch {
      setCount(prevCount)
      setVoted(prevVoted)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-3 group animate-fade-up">
      {/* Left: avatar + thread line */}
      <div className="flex flex-col items-center gap-0 flex-shrink-0">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-violet-600
                        flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
          {comment.author?.username?.[0]?.toUpperCase() ?? 'A'}
        </div>
        {/* Thread line */}
        <div className="w-0.5 flex-1 mt-1.5 bg-white/[0.06] group-hover:bg-white/[0.12] rounded-full transition-colors min-h-[16px]" />
      </div>

      {/* Right: content */}
      <div className="flex-1 min-w-0 pb-3">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-violet-400">
            {comment.author?.username ?? 'Anonymous'}
          </span>
          <span className="text-[10px] text-white/30">{timeAgo(comment.createdAt)}</span>
        </div>

        {/* Body */}
        <p className="text-sm text-white/70 leading-relaxed mb-2">{comment.content}</p>

        {/* Actions row — Reddit style */}
        <div className="flex items-center gap-1">
          {/* Upvote cluster */}
          <div className="flex items-center gap-0 bg-white/[0.04] rounded-full border border-white/[0.06] overflow-hidden">
            <button
              onClick={handleUpvote}
              disabled={loading}
              className={`
                flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-l-full
                transition-all duration-150 disabled:opacity-50
                ${voted
                  ? 'text-orange-400 bg-orange-400/10'
                  : 'text-white/40 hover:text-orange-400 hover:bg-orange-400/10'}
              `}
            >
              <span className="text-[11px]">▲</span>
              <span className="tabular-nums">{count}</span>
            </button>
            <div className="w-px h-4 bg-white/[0.08]" />
            <button
              onClick={(e) => e.stopPropagation()}
              className="px-2.5 py-1 text-xs text-white/30 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-150 rounded-r-full"
            >
              ▼
            </button>
          </div>

          {/* Reply button */}
          <button className="flex items-center gap-1 px-2.5 py-1 text-xs text-white/30
                             hover:text-violet-400 hover:bg-violet-400/10 rounded-full
                             transition-all duration-150 font-semibold">
            💬 Reply
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommentCard