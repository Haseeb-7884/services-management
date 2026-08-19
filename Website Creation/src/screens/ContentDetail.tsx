import { Play, Heart, MessageSquare, Share2, Bookmark, CheckCircle, ThumbsUp, Clock, Eye } from 'lucide-react'

const comments = [
  { avatar: 'photo-1535713875002-d1d0cf377fde', name: 'Mara Chen', time: '2h ago', text: 'This is genuinely one of the best breakdowns of quantum computing I have ever seen. The visual metaphors were spot on.', likes: 142 },
  { avatar: 'photo-1438761681033-6461ffad8d80', name: 'Luna Park', time: '4h ago', text: 'The section on error correction blew my mind. Would love a follow-up on topological qubits specifically.', likes: 87 },
  { avatar: 'photo-1500648767791-00dcc994a43e', name: 'James Rivera', time: '6h ago', text: 'Shared this with my entire engineering team. Required watching at this point.', likes: 63 },
  { avatar: 'photo-1494790108377-be9c29b29330', name: 'Sophie Bell', time: '1d ago', text: 'The animations make such a difference — finally a channel that invests in production quality for educational content.', likes: 55 },
]

const upNext = [
  { id: 'photo-1526374965328-7f61d4dc18c5', title: 'Neural Interface: Typing with Your Mind', creator: 'TechVision', views: '2.1M', duration: '28:44' },
  { id: 'photo-1461749280684-dccba630e2f6', title: 'Inside Google\'s Quantum Lab', creator: 'ScienceScope', views: '1.8M', duration: '19:07' },
  { id: 'photo-1534080564583-6be75777b70a', title: 'The Physics of Teleportation', creator: 'PhysicsNow', views: '3.4M', duration: '35:22' },
  { id: 'photo-1518770660439-4636190af475', title: 'AI vs Human: Chess, Go, and Beyond', creator: 'DeepGameCast', views: '987K', duration: '44:12' },
  { id: 'photo-1506905925346-21bda4d32df4', title: 'Dark Matter: What We Actually Know', creator: 'CosmosToday', views: '2.9M', duration: '31:58' },
]

export default function ContentDetail() {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 60px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
        {/* Main column */}
        <div>
          {/* Video Player */}
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#0a0f1e', marginBottom: 24, aspectRatio: '16/9' }}>
            <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1280&h=720&fit=crop&auto=format" alt="Quantum Computing video thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(0,212,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 32px rgba(0,212,255,0.5)' }}>
                <Play size={28} color="#080f1e" fill="#080f1e" />
              </button>
            </div>
            <span style={{ position: 'absolute', bottom: 16, right: 16, background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: 13, fontWeight: 700, padding: '4px 10px', borderRadius: 7 }}>38:47</span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: 26, color: '#f0f4ff', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: 18 }}>
            The Rise of Quantum Computing: What Changes in 2026
          </h1>

          {/* Creator row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(0,212,255,0.35)' }}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=88&h=88&fit=crop&auto=format" alt="TechVision" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4ff' }}>TechVision</span>
                <CheckCircle size={14} color="#00d4ff" fill="#00d4ff" />
              </div>
              <div style={{ display: 'flex', gap: 14, color: '#8b98a8', fontSize: 12, marginTop: 2 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={12} /> 3.1M views</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={12} /> Mar 14, 2026</span>
              </div>
            </div>
            <button style={{ background: '#00d4ff', color: '#080f1e', fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 13, padding: '9px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', marginLeft: 'auto', boxShadow: '0 0 16px rgba(0,212,255,0.3)' }}>Follow</button>
          </div>

          {/* Action row */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap' }}>
            {[
              { icon: Heart, label: '89.4K', action: 'Like' },
              { icon: MessageSquare, label: '6.7K', action: 'Comment' },
              { icon: Share2, label: 'Share', action: 'Share' },
              { icon: Bookmark, label: 'Save', action: 'Save' },
            ].map(({ icon: Icon, label, action }, i) => (
              <button key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9, padding: '9px 16px', color: '#8b98a8', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter,sans-serif', transition: 'color 0.15s, border-color 0.15s' }}>
                <Icon size={15} /> {action} {label !== action ? `· ${label}` : ''}
              </button>
            ))}
          </div>

          {/* Description */}
          <div style={{ background: '#142040', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 22px', marginBottom: 32 }}>
            <p style={{ color: '#c8d4e0', fontSize: 14, lineHeight: 1.75 }}>
              In this deep-dive, we explore how quantum processors from IBM, Google, and a wave of startups are crossing the fault-tolerance threshold — and what that means for cryptography, drug discovery, materials science, and financial modeling. We visit three research labs, interview leading physicists, and break down the core concepts without dumbing them down.
            </p>
            <p style={{ color: '#8b98a8', fontSize: 13, marginTop: 12 }}>
              Chapters: 0:00 Intro · 4:30 What is a Qubit · 11:00 The Error Problem · 19:45 Lab Tour · 29:00 Real-World Impact · 36:00 What's Next
            </p>
          </div>

          {/* Comments */}
          <div>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 18, color: '#f0f4ff', marginBottom: 20 }}>6,734 Comments</h2>

            {/* Comment input */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid #00d4ff' }}>
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=72&h=72&fit=crop&auto=format" alt="You" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  placeholder="Add a comment…"
                  style={{ width: '100%', background: '#142040', border: '2px solid #00d4ff', borderRadius: 10, padding: '11px 16px', color: '#f0f4ff', fontSize: 14, fontFamily: 'Inter,sans-serif', outline: 'none', boxShadow: '0 0 12px rgba(0,212,255,0.15)' }}
                />
              </div>
            </div>

            {/* Comment list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {comments.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={`https://images.unsplash.com/${c.avatar}?w=72&h=72&fit=crop&auto=format`} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 5 }}>
                      <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 13, color: '#f0f4ff' }}>{c.name}</span>
                      <span style={{ color: '#8b98a8', fontSize: 12 }}>{c.time}</span>
                    </div>
                    <p style={{ color: '#c8d4e0', fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>{c.text}</p>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <button style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#8b98a8', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}><ThumbsUp size={13} /> {c.likes}</button>
                      <button style={{ color: '#8b98a8', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Up Next */}
        <div style={{ position: 'sticky', top: 100 }}>
          <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 16, color: '#f0f4ff', marginBottom: 16 }}>Up Next</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {upNext.map((item, i) => (
              <div key={i} className="card-hover" style={{ display: 'flex', gap: 12, cursor: 'pointer', padding: 10, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', background: '#142040' }}>
                <div style={{ position: 'relative', width: 120, height: 72, borderRadius: 9, overflow: 'hidden', flexShrink: 0, background: '#0d1b33' }}>
                  <img src={`https://images.unsplash.com/${item.id}?w=240&h=144&fit=crop&auto=format`} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={16} color="rgba(255,255,255,0.85)" fill="rgba(255,255,255,0.85)" />
                  </div>
                  <span style={{ position: 'absolute', bottom: 5, right: 5, background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 5px', borderRadius: 4 }}>{item.duration}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 13, color: '#f0f4ff', lineHeight: 1.35, marginBottom: 5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</p>
                  <p style={{ color: '#8b98a8', fontSize: 11, marginBottom: 3 }}>{item.creator}</p>
                  <p style={{ color: '#8b98a8', fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={10} /> {item.views}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: '1fr 360px'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
