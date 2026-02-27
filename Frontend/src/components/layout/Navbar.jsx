import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-base/90 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="text-2xl">🛡️</span>
          <span className="font-display text-xl font-bold bg-gradient-brand bg-clip-text text-transparent">
            Nirvik
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/create" className="btn-brand text-sm">
                + New Post
              </Link>
              <div className="flex items-center gap-3 pl-3 border-l border-white/[0.08]">
                <span className="text-sm font-semibold text-violet hidden sm:block">
                  {user.username}
                </span>
                <button onClick={handleLogout} className="btn-ghost text-sm">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-brand">Join</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar