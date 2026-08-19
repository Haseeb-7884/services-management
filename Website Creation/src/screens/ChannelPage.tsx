import { useState } from 'react'
import { Play, Heart, MessageSquare, Eye, CheckCircle, Share2, Video, Camera, MessageCircle } from 'lucide-react'

const tabs = ['Posts', 'Articles', 'Videos', 'Shorts', 'About']

const posts = [
  { id: 'photo-1518770660439-4636190af475', title: 'Inside Quantum Labs: A Visual Tour', type: 'video', duration: '22:14', views: '1.4M', likes: '34K', comments: '2.1K', time: '3 days ago' },
  { id: 'photo-1526374965328-7f61d4dc18c5', title: 'The Neural Interface Breakthrough', type: 'article', views: '892K', likes: '21K', comments: '876', time: '1 week ago' },
  { id: 'photo-1461749280684-dccba630e2f6', title: 'Coding the Impossible: AGI Prototypes', type: 'video', duration: '38:02', views: '2.7M', likes: '67K', comments: '4.3K', time: '2 weeks ago' },
  { id: 'photo-1534080564583-6be75777b70a', title: 'Robotics at MIT — Full Access', type: 'video', duration: '51:33', views: '3.1M', likes: '89K', comments: '6.7K', time: '3 weeks ago' },
  { id: 'photo-1505118380757-91f5f5632de0', title: 'Does Consciousness Exist in AI?', type: 'article', views: '678K', likes: '18K', comments: '1.5K', time: '1 month ago' },
  { id: 'photo-1506905925346-21bda4d32df4', title: 'Drone Footage: Tech Campus Flyover', type: 'image', views: '445K', likes: '12K', comments: '334', time: '1 month ago' },
]

export default function ChannelPage() {
  const [activeTab, setActiveTab] = useState('Posts')

  return (
    <div>
      {/* Banner */}
      <div style={{ position: 'relative', height: 280, background: '#0d1b33', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&h=560&fit=crop&auto=format" alt="Channel banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(8,15,30,1) 0%, rgba(8,15,30,0.3) 60%, rgba(8,15,30,0.1) 100%)' }} />
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {/* Channel header */}
        <div style={{ position: 'relative', marginTop: -56, marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 112, height: 112, borderRadius: '50%', overflow: 'hidden', border: '4px solid #080f1e', boxShadow: '0 0 0 2px #00d4ff' }}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=224&h=224&fit=crop&auto=format" alt="TechVision avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ position: 'absolute', bottom: 4, right: 4, background: '#00d4ff', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #080f1e' }}>
                <CheckCircle size={12} color="#080f1e" fill="#080f1e" />
              </div>
            </div>

            {/* Name block */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: 28, color: '#f0f4ff', letterSpacing: '-0.02em' }}>TechVision</h1>
                <span style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.35)', color: '#00d4ff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'Poppins,sans-serif' }}>Verified Creator</span>
              </div>
              <p style={{ color: '#8b98a8', fontSize: 14, marginBottom: 10 }}>@techvision · Technology & Science</p>
              <div style={{ display: 'flex', gap: 24 }}>
                <div><span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 16, color: '#f0f4ff' }}>4.8M</span><span style={{ color: '#8b98a8', fontSize: 13, marginLeft: 5 }}>followers</span></div>
                <div><span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 16, color: '#f0f4ff' }}>847</span><span style={{ color: '#8b98a8', fontSize: 13, marginLeft: 5 }}>posts</span></div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
              <button style={{ background: '#00d4ff', color: '#080f1e', fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 14, padding: '11px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(0,212,255,0.35)' }}>Follow</button>
              <button style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Share2 size={18} color="#8b98a8" />
              </button>
            </div>
          </div>

          {/* Bio */}
          <p style={{ color: '#c8d4e0', fontSize: 14, lineHeight: 1.7, maxWidth: 680, marginTop: 20, marginBottom: 16 }}>
            Exploring the frontiers of science and technology — from quantum computing and neural interfaces to space exploration and climate tech. Weekly deep-dives, lab tours, and expert interviews that make complex ideas accessible to everyone.
          </p>

          {/* Social links */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            {[Video, Camera, MessageCircle].map((Icon, i) => (
              <button key={i} style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s' }}>
                <Icon size={16} color="#8b98a8" />
              </button>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 32, overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 22px',
                fontFamily: 'Poppins,sans-serif',
                fontWeight: 600,
                fontSize: 14,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === tab ? '#00d4ff' : '#8b98a8',
                borderBottom: activeTab === tab ? '2px solid #00d4ff' : '2px solid transparent',
                marginBottom: -1,
                whiteSpace: 'nowrap',
                transition: 'color 0.15s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20, paddingBottom: 60 }}>
          {posts.map((post, i) => (
            <div key={i} className="card-hover" style={{ background: '#142040', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ position: 'relative', height: 195, background: '#0d1b33' }}>
                <img src={`https://images.unsplash.com/${post.id}?w=640&h=390&fit=crop&auto=format`} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {post.type === 'video' && (
                  <>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(255,255,255,0.25)' }}>
                        <Play size={20} color="#fff" fill="#fff" />
                      </div>
                    </div>
                    <span style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: 12, fontWeight: 600, padding: '3px 8px', borderRadius: 6 }}>{post.duration}</span>
                  </>
                )}
                {post.type === 'article' && <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.35)', color: '#00d4ff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Article</span>}
              </div>
              <div style={{ padding: '16px 18px' }}>
                <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4ff', lineHeight: 1.35, marginBottom: 10 }}>{post.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8b98a8', fontSize: 12 }}>
                  <span>{post.time}</span>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={12} /> {post.views}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Heart size={12} /> {post.likes}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MessageSquare size={12} /> {post.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
