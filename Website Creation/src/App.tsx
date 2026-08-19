import { useState } from 'react'
import HomeFeed from './screens/HomeFeed'
import ChannelPage from './screens/ChannelPage'
import ContentDetail from './screens/ContentDetail'
import CreatorDashboard from './screens/CreatorDashboard'
import PricingPage from './screens/PricingPage'

const screens = [
  { id: 'home', label: 'Home Feed' },
  { id: 'channel', label: 'Channel' },
  { id: 'content', label: 'Content Detail' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'pricing', label: 'Pricing' },
]

export default function App() {
  const [active, setActive] = useState('home')

  return (
    <div style={{ background: 'linear-gradient(180deg,#050d1a 0%,#0d1b33 45%,#050d1a 100%)', minHeight: '100vh' }}>
      {/* Screen switcher nav */}
      <div style={{ background: 'rgba(8,15,30,0.95)', borderBottom: '1px solid rgba(0,212,255,0.12)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto' }}>
          <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 15, color: '#00d4ff', marginRight: 12, whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>NovaCast</span>
          {screens.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              style={{
                padding: '10px 14px',
                fontSize: 13,
                fontWeight: 500,
                fontFamily: 'Inter,sans-serif',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                color: active === s.id ? '#00d4ff' : '#8b98a8',
                borderBottom: active === s.id ? '2px solid #00d4ff' : '2px solid transparent',
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {active === 'home' && <HomeFeed />}
      {active === 'channel' && <ChannelPage />}
      {active === 'content' && <ContentDetail />}
      {active === 'dashboard' && <CreatorDashboard />}
      {active === 'pricing' && <PricingPage />}
    </div>
  )
}
