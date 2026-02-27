import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const UpvoteButton = ({ initialCount, initialVoted, onUpvote, vertical = true }) => {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [count, setCount]     = useState(initialCount ?? 0)
  const [voted, setVoted]     = useState(initialVoted ?? false)
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return navigate('/login')
    if (loading) return

    // Capture current state before optimistic update
    const prevCount = count
    const prevVoted = voted

    setLoading(true)
    setCount((c) => prevVoted ? c - 1 : c + 1)
    setVoted(!prevVoted)

    try {
      const res = await onUpvote()
      if (res && typeof res.upvotes === 'number') {
        setCount(res.upvotes)
        setVoted(res.userUpvoted)
      }
    } catch {
      // Revert on error
      setCount(prevCount)
      setVoted(prevVoted)
    } finally {
      setLoading(false)
    }
  }

  if (vertical) {
    return (
      <div className="flex flex-col items-center gap-0.5 min-w-[36px]">
        <button
          onClick={handle}
          disabled={loading}
          className={`
            w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold
            transition-all duration-150 disabled:opacity-60
            ${voted
              ? 'text-orange-400 bg-orange-400/10 hover:bg-orange-400/20'
              : 'text-gray-400 hover:text-orange-400 hover:bg-orange-400/10'}
          `}
          title={user ? (voted ? 'Remove upvote' : 'Upvote') : 'Login to upvote'}
        >
          ▲
        </button>
        <span className={`text-xs font-bold tabular-nums ${voted ? 'text-orange-400' : 'text-gray-400'}`}>
          {count}
        </span>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
          className="w-8 h-8 rounded-md flex items-center justify-center text-sm text-gray-600 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-150"
          title="Downvote"
        >
          ▼
        </button>
      </div>
    )
  }

  // Horizontal Reddit-style
  return (
    <div className="flex items-center gap-0.5 bg-white/[0.06] rounded-full border border-white/10 overflow-hidden">
      <button
        onClick={handle}
        disabled={loading}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold
          transition-all duration-150 disabled:opacity-60
          ${voted
            ? 'text-orange-400 bg-orange-400/10'
            : 'text-gray-400 hover:text-orange-400 hover:bg-orange-400/10'}
        `}
      >
        <span className="text-sm">▲</span>
        <span>{count}</span>
      </button>
      <div className="w-px h-5 bg-white/10" />
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
        className="flex items-center px-2.5 py-1.5 text-sm text-gray-600 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-150"
        title="Downvote"
      >
        ▼
      </button>
    </div>
  )
}

export default UpvoteButton