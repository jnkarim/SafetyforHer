import { Link } from 'react-router-dom'
import { upvotePost } from '../../api/posts'
import UpvoteButton from './UpvoteButton'
import CategoryTag from '../ui/CategoryTag'
import { MessageCircle, Share2, MoreHorizontal } from 'lucide-react'

const TYPE_ICONS = { story: '📖', tip: '💡', question: '❓' }

const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000)
  if (s < 60)    return 'just now'
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

const PostCard = ({ post }) => (
  <Link
    to={`/post/${post._id}`}
    className="card flex overflow-hidden group transition-all duration-200
               hover:border-violet/30 hover:-translate-y-px hover:shadow-card
               animate-fade-up"
  >
    {/* Vote column */}
    <div
      className="flex flex-col items-center justify-start gap-1 px-3 py-4
                 bg-white/[0.02] border-r border-white/[0.05]"
      onClick={(e) => e.preventDefault()}
    >
      <UpvoteButton
        initialCount={post.upvotes}
        initialVoted={post.userUpvoted}
        onUpvote={() => upvotePost(post._id)}
        vertical={true}
      />
    </div>

    {/* Content */}
    <div className="flex-1 p-4 min-w-0">

      {/* Author + meta row */}
      <div className="flex items-center gap-2 mb-2.5 flex-wrap">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ff4b91] to-[#7c3aed]
                        flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
          {post.author?.username?.[0]?.toUpperCase() ?? 'A'}
        </div>
        <span className="text-xs font-bold text-text uppercase tracking-wide">
          {post.author?.username ?? 'Anonymous'}
        </span>
        <span className="text-xs text-faint">
          IN <span className="text-violet font-semibold">S/{post.category?.toUpperCase()}</span>
        </span>
        <span className="text-xs text-faint">· {timeAgo(post.createdAt)}</span>

        <button
          className="ml-auto text-faint hover:text-text transition-colors p-1 rounded-lg hover:bg-white/5"
          onClick={(e) => e.preventDefault()}
        >
          <MoreHorizontal size={15} />
        </button>
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-base text-text leading-snug mb-2
                     group-hover:text-violet transition-colors duration-150">
        {post.title}
      </h3>

      {/* Preview */}
      <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-4">
        {post.content}
      </p>

      {/* Image thumbnail */}
      {post.imageUrl && (
        <div className="mb-4">
          <img
            src={post.imageUrl}
            alt="attachment"
            className="h-24 rounded-lg object-cover border border-white/[0.06]"
          />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-4 text-xs text-faint">
        <button
          className="flex items-center gap-1.5 hover:text-text transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          <MessageCircle size={13} />
          {post.commentCount ?? 0} COMMENTS
        </button>

        <button
          className="flex items-center gap-1.5 hover:text-text transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          <Share2 size={13} />
          SHARE
        </button>
      </div>
    </div>
  </Link>
)

export default PostCard