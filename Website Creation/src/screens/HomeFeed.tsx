import { Search, Bell, MessageCircle, Compass, Play, Heart, MessageSquare, Eye, Clock } from 'lucide-react'

const card = (style?: React.CSSProperties): React.CSSProperties => ({
  background: '#142040',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 16,
  overflow: 'hidden',
  ...style,
})

const trendingItems = [
  { id: 'bkXnXqHQOHM', title: 'The Future of AI in 2026', creator: 'TechVision', views: '2.4M', duration: '18:32', type: 'video' },
  { id: 'hpjhpjhpjhp', title: 'Mountain Sunrise Timelapse', creator: 'NatureScope', views: '890K', duration: '4:20', type: 'video' },
  { id: 'ZmUMTMKluzE', title: 'Minimal Living Guide', creator: 'SpaceDesign', views: '1.1M', duration: null, type: 'article' },
  { id: 'yjBiMfGAhuc', title: 'Tokyo Street Photography', creator: 'LensWander', views: '654K', duration: null, type: 'image' },
  { id: 'mEZ_ofKDqjA', title: 'Electric Guitar Basics', creator: 'RiffMaster', views: '3.2M', duration: '24:15', type: 'video' },
]

const creators = [
  { id: 'photo-1535713875002-d1d0cf377fde', name: 'Mara Chen', handle: '@maravisuals', followers: '1.2M' },
  { id: 'photo-1507003211169-0a1dd7228f2d', name: 'Dev Sharma', handle: '@devtech', followers: '890K' },
  { id: 'photo-1438761681033-6461ffad8d80', name: 'Luna Park', handle: '@lunapark', followers: '2.1M' },
  { id: 'photo-1500648767791-00dcc994a43e', name: 'James Rivera', handle: '@jrivera', followers: '456K' },
  { id: 'photo-1494790108377-be9c29b29330', name: 'Sophie Bell', handle: '@sophstyle', followers: '3.4M' },
]

const feedItems = [
  { id: 'photo-1526374965328-7f61d4dc18c5', title: 'Neural Networks Explained Simply', creator: 'TechVision', avatar: 'photo-1535713875002-d1d0cf377fde', time: '2h ago', likes: '4.2K', comments: '312', type: 'article', excerpt: 'Breaking down complex AI concepts into digestible insights anyone can understand.' },
  { id: 'photo-1518770660439-4636190af475', title: 'Building a Smart Home in 2026', creator: 'HomeHacks', avatar: 'photo-1507003211169-0a1dd7228f2d', time: '5h ago', likes: '8.7K', comments: '549', type: 'video', duration: '31:04' },
  { id: 'photo-1506905925346-21bda4d32df4', title: 'Iceland Landscapes', creator: 'LensWander', avatar: 'photo-1438761681033-6461ffad8d80', time: '1d ago', likes: '12.1K', comments: '201', type: 'image' },
  { id: 'photo-1461749280684-dccba630e2f6', title: 'React 22 New Features Deep Dive', creator: 'DevStream', avatar: 'photo-1500648767791-00dcc994a43e', time: '3h ago', likes: '6.3K', comments: '477', type: 'video', duration: '42:17' },
  { id: 'photo-1534080564583-6be75777b70a', title: 'Minimalist Workspace Tour', creator: 'SpaceDesign', avatar: 'photo-1494790108377-be9c29b29330', time: '6h ago', likes: '9.9K', comments: '388', type: 'article', excerpt: 'How I redesigned my entire home office to boost focus and creativity.' },
  { id: 'photo-1505118380757-91f5f5632de0', title: 'Jazz in Kyoto', creator: 'RiffMaster', avatar: 'photo-1535713875002-d1d0cf377fde', time: '2d ago', likes: '5.4K', comments: '143', type: 'image' },
]

export default function HomeFeed() {
  return (
    <div>
      {/* Top Nav */}
      <nav style={{ background: 'rgba(8,15,30,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', position: 'sticky', top: 44, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: 22, color: '#00d4ff', letterSpacing: '-0.03em', marginRight: 8 }}>Nova<span style={{ color: '#f0f4ff' }}>Cast</span></span>
          {/* Search */}
          <div style={{ flex: 1, maxWidth: 480, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8b98a8' }} />
            <input
              placeholder="Search creators, videos, articles…"
              style={{ width: '100%', background: '#142040', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px 10px 40px', color: '#f0f4ff', fontSize: 14, fontFamily: 'Inter,sans-serif', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            {[Compass, Bell, MessageCircle].map((Icon, i) => (
              <button key={i} style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Icon size={18} color="#8b98a8" />
              </button>
            ))}
            <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '2px solid #00d4ff', cursor: 'pointer', marginLeft: 4 }}>
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=72&h=72&fit=crop&auto=format" alt="User avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 80px' }}>
        {/* Hero */}
        <div style={{ ...card(), position: 'relative', height: 460, marginBottom: 40, borderRadius: 20 }}>
          <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=460&fit=crop&auto=format" alt="Featured content" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,13,26,0.9) 0%, rgba(5,13,26,0.4) 60%, transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '40px 48px', maxWidth: 640 }}>
            <span style={{ display: 'inline-block', background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', padding: '4px 12px', borderRadius: 999, marginBottom: 16, textTransform: 'uppercase', fontFamily: 'Poppins,sans-serif' }}>TECHNOLOGY</span>
            <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: 36, lineHeight: 1.2, color: '#f0f4ff', marginBottom: 14, letterSpacing: '-0.02em' }}>The Rise of Quantum Computing: What Changes in 2026</h1>
            <p style={{ color: '#c8d4e0', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>An in-depth exploration of how quantum processors are reshaping industries from drug discovery to financial modeling.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#00d4ff', color: '#080f1e', fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', boxShadow: '0 0 24px rgba(0,212,255,0.4)' }}>
                <Play size={16} fill="#080f1e" /> Watch Now
              </button>
              <button style={{ background: 'rgba(255,255,255,0.08)', color: '#f0f4ff', fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 14, padding: '12px 24px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer' }}>
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Trending Rail */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 20, color: '#f0f4ff', letterSpacing: '-0.01em' }}>Trending Now</h2>
            <button style={{ color: '#00d4ff', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>See all →</button>
          </div>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
            {trendingItems.map((item, i) => (
              <div key={i} className="card-hover" style={{ ...card(), minWidth: 220, flex: '0 0 220px', cursor: 'pointer' }}>
                <div style={{ position: 'relative', height: 130, background: '#0d1b33' }}>
                  <img src={`https://images.unsplash.com/photo-${item.id}?w=440&h=260&fit=crop&auto=format`} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {item.duration && (
                    <>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                          <Play size={14} color="#fff" fill="#fff" />
                        </div>
                      </div>
                      <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 5 }}>{item.duration}</span>
                    </>
                  )}
                  {item.type === 'article' && <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.35)', color: '#00d4ff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Article</span>}
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 13, color: '#f0f4ff', lineHeight: 1.4, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: '#8b98a8', fontSize: 12 }}>{item.creator}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8b98a8', fontSize: 12 }}><Eye size={11} /> {item.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Creators */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 20, color: '#f0f4ff', letterSpacing: '-0.01em' }}>Featured Creators</h2>
            <button style={{ color: '#00d4ff', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Explore all →</button>
          </div>
          <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 8 }}>
            {creators.map((c, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, minWidth: 140, flex: '0 0 140px', cursor: 'pointer' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '2.5px solid rgba(0,212,255,0.3)', transition: 'border-color 0.2s' }}>
                    <img src={`https://images.unsplash.com/${c.id}?w=160&h=160&fit=crop&auto=format`} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 13, color: '#f0f4ff', marginBottom: 2 }}>{c.name}</p>
                  <p style={{ color: '#8b98a8', fontSize: 11, marginBottom: 8 }}>{c.followers} followers</p>
                  <button style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.35)', color: '#00d4ff', fontSize: 12, fontWeight: 600, padding: '5px 16px', borderRadius: 999, cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Follow</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Feed Grid */}
        <section>
          <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 20, color: '#f0f4ff', letterSpacing: '-0.01em', marginBottom: 20 }}>For You</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20 }}>
            {feedItems.map((item, i) => (
              <div key={i} className="card-hover" style={{ ...card(), cursor: 'pointer' }}>
                <div style={{ position: 'relative', height: 200, background: '#0d1b33' }}>
                  <img src={`https://images.unsplash.com/${item.id}?w=680&h=400&fit=crop&auto=format`} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {item.type === 'video' && (
                    <>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(255,255,255,0.25)' }}>
                          <Play size={20} color="#fff" fill="#fff" />
                        </div>
                      </div>
                      {item.duration && <span style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: 12, fontWeight: 600, padding: '3px 8px', borderRadius: 6 }}>{item.duration}</span>}
                    </>
                  )}
                  {item.type === 'article' && <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.35)', color: '#00d4ff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Article</span>}
                </div>
                <div style={{ padding: '18px 20px' }}>
                  <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 16, color: '#f0f4ff', lineHeight: 1.35, marginBottom: 8, letterSpacing: '-0.01em' }}>{item.title}</h3>
                  {item.excerpt && <p style={{ color: '#8b98a8', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{item.excerpt}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(0,212,255,0.25)' }}>
                        <img src={`https://images.unsplash.com/${item.avatar}?w=56&h=56&fit=crop&auto=format`} alt={item.creator} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#c8d4e0', fontFamily: 'Poppins,sans-serif' }}>{item.creator}</p>
                        <p style={{ fontSize: 11, color: '#8b98a8', display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={10} /> {item.time}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8b98a8', fontSize: 12 }}><Heart size={13} /> {item.likes}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8b98a8', fontSize: 12 }}><MessageSquare size={13} /> {item.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(8,15,30,0.97)', borderTop: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)', padding: '10px 0', zIndex: 100 }} className="mobile-tab-bar">
        {/* mobile only via CSS media query */}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-tab-bar { display: flex !important; justify-content: space-around; }
        }
      `}</style>
    </div>
  )
}
