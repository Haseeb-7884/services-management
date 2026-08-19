import { useState } from 'react'
import { LayoutDashboard, Film, BarChart2, Users, Settings, Upload, Eye, Heart, TrendingUp, TrendingDown, HardDrive, Edit, Trash2, Menu, X } from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Film, label: 'My Content', active: false },
  { icon: BarChart2, label: 'Analytics', active: false },
  { icon: Users, label: 'Audience', active: false },
  { icon: Settings, label: 'Settings', active: false },
]

const stats = [
  { label: 'Total Views', value: '48.3M', icon: Eye, trend: '+12.4%', up: true, color: '#00d4ff' },
  { label: 'Followers', value: '4.8M', icon: Users, trend: '+8.7%', up: true, color: '#a78bfa' },
  { label: 'Total Likes', value: '12.1M', icon: Heart, trend: '+5.2%', up: true, color: '#f472b6' },
  { label: 'Storage Used', value: null, icon: HardDrive, progress: 68, used: '34.2 GB', total: '50 GB', color: '#fb923c' },
]

const chartData = [
  { day: 'Mon', views: 62 }, { day: 'Tue', views: 78 }, { day: 'Wed', views: 55 },
  { day: 'Thu', views: 91 }, { day: 'Fri', views: 84 }, { day: 'Sat', views: 110 },
  { day: 'Sun', views: 97 },
]
const maxViews = Math.max(...chartData.map(d => d.views))

const contentRows = [
  { id: 'photo-1518770660439-4636190af475', title: 'The Rise of Quantum Computing', type: 'Video', status: 'Published', views: '3.1M', date: 'Mar 14, 2026' },
  { id: 'photo-1526374965328-7f61d4dc18c5', title: 'Neural Interface Breakthrough', type: 'Article', status: 'Published', views: '892K', date: 'Mar 7, 2026' },
  { id: 'photo-1461749280684-dccba630e2f6', title: 'Coding the Impossible', type: 'Video', status: 'Published', views: '2.7M', date: 'Feb 28, 2026' },
  { id: 'photo-1534080564583-6be75777b70a', title: 'Robotics at MIT — Extended Cut', type: 'Video', status: 'Processing', views: '—', date: 'Mar 18, 2026' },
  { id: 'photo-1505118380757-91f5f5632de0', title: 'Consciousness in AI: Draft', type: 'Article', status: 'Draft', views: '—', date: 'Mar 19, 2026' },
]

const statusColor: Record<string, { bg: string; color: string }> = {
  Published: { bg: 'rgba(34,197,94,0.12)', color: '#4ade80' },
  Processing: { bg: 'rgba(251,146,60,0.12)', color: '#fb923c' },
  Draft: { bg: 'rgba(139,152,168,0.1)', color: '#8b98a8' },
}

export default function CreatorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 44px)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: 'rgba(12,22,44,0.97)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '28px 16px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        position: 'sticky',
        top: 44,
        height: 'calc(100vh - 44px)',
        overflowY: 'auto',
      }} className="dashboard-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, paddingLeft: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '2px solid #00d4ff' }}>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format" alt="Creator" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 13, color: '#f0f4ff' }}>TechVision</p>
            <p style={{ color: '#8b98a8', fontSize: 11 }}>Creator Pro</p>
          </div>
        </div>
        {navItems.map(({ icon: Icon, label, active }) => (
          <button key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, background: active ? 'rgba(0,212,255,0.1)' : 'none', border: active ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent', color: active ? '#00d4ff' : '#8b98a8', fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 14, cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s, color 0.15s' }}>
            <Icon size={17} />
            {label}
          </button>
        ))}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px 32px 60px', overflowX: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: 26, color: '#f0f4ff', letterSpacing: '-0.02em', marginBottom: 4 }}>Welcome back, Alex</h1>
            <p style={{ color: '#8b98a8', fontSize: 14 }}>Here's what's happening with your channel today.</p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#00d4ff', color: '#080f1e', fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 14, padding: '12px 22px', borderRadius: 10, border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(0,212,255,0.35)', whiteSpace: 'nowrap' }}>
            <Upload size={16} /> Upload New
          </button>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16, marginBottom: 28 }}>
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} style={{ background: '#142040', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '22px 22px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={s.color} />
                  </div>
                  {s.trend && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600, color: s.up ? '#4ade80' : '#f87171', background: s.up ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', padding: '3px 8px', borderRadius: 999 }}>
                      {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {s.trend}
                    </span>
                  )}
                </div>
                {s.value ? (
                  <>
                    <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: 28, color: '#f0f4ff', letterSpacing: '-0.02em', marginBottom: 4 }}>{s.value}</p>
                    <p style={{ color: '#8b98a8', fontSize: 13, fontWeight: 500 }}>{s.label}</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4ff', marginBottom: 10 }}>{s.label}</p>
                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 999, height: 6, marginBottom: 8, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.progress}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}99)`, borderRadius: 999 }} />
                    </div>
                    <p style={{ color: '#8b98a8', fontSize: 12 }}>{s.used} <span style={{ color: '#5a6478' }}>of {s.total} used</span></p>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Analytics Chart */}
        <div style={{ background: '#142040', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 26px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 17, color: '#f0f4ff', marginBottom: 4 }}>Views This Week</h2>
              <p style={{ color: '#8b98a8', fontSize: 13 }}>Mar 13 – Mar 19, 2026</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: '#00d4ff' }} />
              <span style={{ color: '#8b98a8', fontSize: 13 }}>Daily Views (K)</span>
            </div>
          </div>

          {/* Bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160 }}>
            {chartData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ color: '#8b98a8', fontSize: 11 }}>{d.views}K</span>
                <div style={{ width: '100%', borderRadius: '6px 6px 0 0', background: `linear-gradient(180deg, #00d4ff, #00a8cc)`, height: `${(d.views / maxViews) * 100}%`, boxShadow: d.day === 'Sat' ? '0 0 12px rgba(0,212,255,0.4)' : 'none', opacity: d.day === 'Sat' ? 1 : 0.65, transition: 'opacity 0.2s', minHeight: 4 }} />
                <span style={{ color: '#8b98a8', fontSize: 11 }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Table */}
        <div style={{ background: '#142040', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 17, color: '#f0f4ff' }}>My Content</h2>
            <button style={{ color: '#00d4ff', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>View all →</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Content', 'Type', 'Status', 'Views', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', color: '#8b98a8', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contentRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < contentRows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 56, height: 36, borderRadius: 7, overflow: 'hidden', flexShrink: 0, background: '#0d1b33' }}>
                          <img src={`https://images.unsplash.com/${row.id}?w=112&h=72&fit=crop&auto=format`} alt={row.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 13, color: '#f0f4ff', whiteSpace: 'nowrap', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}><span style={{ color: '#8b98a8', fontSize: 13 }}>{row.type}</span></td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ background: statusColor[row.status].bg, color: statusColor[row.status].color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, fontFamily: 'Poppins,sans-serif', letterSpacing: '0.04em' }}>{row.status}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}><span style={{ color: '#c8d4e0', fontSize: 13, fontWeight: 500 }}>{row.views}</span></td>
                    <td style={{ padding: '14px 20px' }}><span style={{ color: '#8b98a8', fontSize: 13 }}>{row.date}</span></td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Edit size={13} color="#8b98a8" />
                        </button>
                        <button style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Trash2 size={13} color="#f87171" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 860px) {
          .dashboard-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  )
}
