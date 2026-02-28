import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowBigUp, ArrowBigDown, MessageSquare, Share2, 
  Flag, MoreHorizontal, Shield, Search 
} from 'lucide-react';
import { getPosts } from '../api/posts';
import CreatePost from './CreatePost'; 

// ── Language Toggle (same style as Home.jsx) ──
const LangToggle = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: 'rgba(16,13,32,0.85)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 100, padding: 4, gap: 2,
    }}>
      <button
        onClick={() => i18n.changeLanguage('en')}
        style={{
          padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer',
          fontWeight: 800, fontSize: 11, letterSpacing: '0.05em', transition: 'all 0.2s',
          background: !isBn ? 'linear-gradient(135deg,#ff4b91,#7c3aed)' : 'transparent',
          color: !isBn ? '#fff' : 'rgba(255,255,255,0.3)',
        }}
      >EN</button>
      <button
        onClick={() => i18n.changeLanguage('bn')}
        style={{
          padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer',
          fontWeight: 800, fontSize: 11, transition: 'all 0.2s',
          background: isBn ? 'linear-gradient(135deg,#ff4b91,#7c3aed)' : 'transparent',
          color: isBn ? '#fff' : 'rgba(255,255,255,0.3)',
        }}
      >বাংলা</button>
    </div>
  );
};

const CommunityFeed = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDynamicPosts();
  }, []);

  const fetchDynamicPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data?.posts || []);
    } catch (err) {
      console.error("Error fetching community posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b0813] text-[#e0def4]">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0b0813]/90 backdrop-blur-xl border-b border-[#1a1425] px-8 py-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">{t('feed.title')}</h2>
          <p className="text-xs text-[#907aa9] font-medium uppercase tracking-widest mt-1">
            {t('feed.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search — hidden on mobile */}
          <div className="relative w-80 hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3e324d]" size={18} />
            <input 
              type="text" 
              placeholder={t('feed.search_placeholder')}
              className="w-full bg-[#15101f] border border-[#1a1425] rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#ff4b91]/50 transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Language Toggle */}
          <LangToggle />

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#ff4b91] hover:bg-[#ff75aa] text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#ff4b91]/20 transition-all"
          >
            {t('feed.new_post_btn')}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-10 px-6">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-48 bg-[#15101f] border border-[#1a1425] rounded-[32px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <article
                  key={post._id}
                  onClick={() => navigate(`/post/${post._id}`)}
                  className="bg-[#15101f] rounded-[32px] border border-[#1a1425] flex overflow-hidden hover:border-[#ff4b91]/30 transition-all group shadow-xl cursor-pointer"
                >
                  
                  {/* Vote Panel */}
                  <div
                    className="w-14 bg-[#100c17] flex flex-col items-center py-8 border-r border-[#1a1425] gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="text-[#3e324d] hover:text-[#ff4b91] transition-colors"><ArrowBigUp size={32}/></button>
                    <span className="font-black text-sm text-white">{post.upvotes || 0}</span>
                    <button className="text-[#3e324d] hover:text-blue-400 transition-colors"><ArrowBigDown size={32}/></button>
                  </div>

                  {/* Content Panel */}
                  <div className="flex-1 p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#ff4b91] flex items-center justify-center font-black text-xs text-white">
                          {post.author?.username?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div>
                          <p className="text-xs font-black text-white leading-none uppercase tracking-tighter">
                            u/{post.author?.username || t('feed.anonymous')}
                          </p>
                          <p className="text-[10px] text-[#907aa9] font-bold mt-1 uppercase">
                            {t('feed.in_label')} <span className="text-[#ff4b91]">S/{post.category?.toUpperCase() || t('feed.general').toUpperCase()}</span> • {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        className="text-[#3e324d] hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal size={20}/>
                      </button>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-[#ff4b91] transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-[#907aa9] text-sm leading-relaxed mb-6 font-medium line-clamp-2">
                      {post.content}
                    </p>

                    {post.imageUrl && (
                      <div className="mb-5">
                        <img
                          src={post.imageUrl}
                          alt="attachment"
                          className="h-28 rounded-2xl object-cover border border-[#1a1425]"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-6 border-t border-[#1a1425] pt-6">
                      <button
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#907aa9] hover:text-white transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageSquare size={16}/> {post.commentCount || 0} {t('feed.comments')}
                      </button>
                      <button
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#907aa9] hover:text-white transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Share2 size={16}/> {t('feed.share')}
                      </button>
                      <span className="text-[10px] text-[#3e324d] font-bold uppercase tracking-widest ml-auto">
                        👁 {post.views || 0}
                      </span>
                      <button
                        className="text-[#3e324d] hover:text-red-500 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Flag size={18}/>
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-32 bg-[#15101f] rounded-[40px] border border-dashed border-[#1a1425]">
                <Shield size={48} className="mx-auto text-[#1a1425] mb-4" />
                <h3 className="text-[#907aa9] font-bold uppercase tracking-widest text-sm">{t('feed.no_posts_title')}</h3>
                <p className="text-[#3e324d] text-xs mt-2">{t('feed.no_posts_desc')}</p>
              </div>
            )}
          </div>
        )}
      </main>

      <CreatePost 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        refreshFeed={fetchDynamicPosts} 
      />
    </div>
  );
};

export default CommunityFeed;