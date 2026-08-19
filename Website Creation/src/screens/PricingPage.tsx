import { useState } from 'react'
import { Check, X, Shield, RefreshCw, Zap, Lock } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    monthly: 0,
    yearly: 0,
    desc: 'Everything you need to start creating and sharing content.',
    features: [
      { text: '5 GB storage', included: true },
      { text: 'Publish unlimited posts', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'HD video uploads (up to 720p)', included: true },
      { text: 'Custom channel branding', included: false },
      { text: 'Monetization tools', included: false },
    ],
    cta: 'Get Started',
    highlight: false,
    color: '#8b98a8',
  },
  {
    name: 'Premium',
    monthly: 12,
    yearly: 8,
    desc: 'Unlock the full creative toolkit for serious creators.',
    features: [
      { text: '50 GB storage', included: true },
      { text: 'Publish unlimited posts', included: true },
      { text: 'Advanced analytics & insights', included: true },
      { text: '4K video uploads', included: true },
      { text: 'Custom channel branding', included: true },
      { text: 'Monetization tools', included: false },
    ],
    cta: 'Start Free Trial',
    highlight: true,
    color: '#00d4ff',
    badge: 'Most Popular',
  },
  {
    name: 'Creator Pro',
    monthly: 39,
    yearly: 28,
    desc: 'For professional creators ready to turn passion into revenue.',
    features: [
      { text: '500 GB storage', included: true },
      { text: 'Publish unlimited posts', included: true },
      { text: 'Full analytics suite + exports', included: true },
      { text: '8K video uploads', included: true },
      { text: 'Custom channel branding', included: true },
      { text: 'Monetization tools & payouts', included: true },
    ],
    cta: 'Go Pro',
    highlight: false,
    color: '#a78bfa',
  },
]

const trust = [
  { icon: RefreshCw, text: 'Cancel anytime' },
  { icon: Shield, text: 'Secure payments' },
  { icon: Zap, text: 'Instant activation' },
  { icon: Lock, text: 'Privacy protected' },
]

const faqs = [
  { q: 'Can I upgrade or downgrade anytime?', a: 'Yes. Changes take effect immediately and billing is prorated.' },
  { q: 'Is there a free trial for paid plans?', a: 'Premium includes a 14-day free trial. No credit card required to start.' },
  { q: 'What happens to my content if I cancel?', a: 'Your content remains accessible for 30 days after cancellation, giving you time to export.' },
]

export default function PricingPage() {
  const [yearly, setYearly] = useState(false)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 24px 80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 52 }}>
        <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: 42, color: '#f0f4ff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16 }}>
          Choose Your Plan
        </h1>
        <p style={{ color: '#8b98a8', fontSize: 18, lineHeight: 1.6, maxWidth: 520, margin: '0 auto 32px' }}>
          Start free, scale when you're ready. No hidden fees, no lock-in.
        </p>

        {/* Billing toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 14, color: !yearly ? '#f0f4ff' : '#8b98a8' }}>Monthly</span>
          <button
            onClick={() => setYearly(y => !y)}
            style={{
              width: 52, height: 28, borderRadius: 999,
              background: yearly ? '#00d4ff' : 'rgba(255,255,255,0.1)',
              border: yearly ? 'none' : '1px solid rgba(255,255,255,0.15)',
              position: 'relative', cursor: 'pointer',
              transition: 'background 0.25s',
              boxShadow: yearly ? '0 0 12px rgba(0,212,255,0.35)' : 'none',
            }}
          >
            <span style={{ position: 'absolute', top: 3, left: yearly ? 26 : 3, width: 22, height: 22, borderRadius: '50%', background: '#fff', transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 14, color: yearly ? '#f0f4ff' : '#8b98a8' }}>Yearly</span>
            <span style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.35)', color: '#00d4ff', fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 999, letterSpacing: '0.05em' }}>Save 28%</span>
          </div>
        </div>
      </div>

      {/* Pricing cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, alignItems: 'start', marginBottom: 60 }}>
        {plans.map((plan, i) => (
          <div
            key={i}
            style={{
              background: '#142040',
              border: plan.highlight ? `2px solid ${plan.color}` : '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20,
              padding: plan.highlight ? '36px 28px' : '28px 24px',
              position: 'relative',
              boxShadow: plan.highlight ? `0 0 40px rgba(0,212,255,0.18), 0 8px 40px rgba(0,0,0,0.5)` : '0 4px 24px rgba(0,0,0,0.35)',
              transform: plan.highlight ? 'translateY(-8px)' : 'none',
            }}
          >
            {plan.badge && (
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#00d4ff', color: '#080f1e', fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 11, padding: '5px 16px', borderRadius: 999, letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap', boxShadow: '0 0 16px rgba(0,212,255,0.5)' }}>
                {plan.badge}
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <span style={{ display: 'inline-block', background: `${plan.color}18`, color: plan.color, fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 13, padding: '4px 14px', borderRadius: 999, marginBottom: 16 }}>{plan.name}</span>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 6 }}>
                <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: 44, color: '#f0f4ff', lineHeight: 1, letterSpacing: '-0.03em' }}>
                  {plan.monthly === 0 ? 'Free' : `$${yearly ? plan.yearly : plan.monthly}`}
                </span>
                {plan.monthly > 0 && <span style={{ color: '#8b98a8', fontSize: 14, marginBottom: 8 }}>/mo</span>}
              </div>
              {plan.monthly > 0 && yearly && <p style={{ color: '#8b98a8', fontSize: 12, marginBottom: 8 }}>Billed yearly · Save ${(plan.monthly - plan.yearly) * 12}/yr</p>}
              <p style={{ color: '#8b98a8', fontSize: 13, lineHeight: 1.6 }}>{plan.desc}</p>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 20 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {plan.features.map((f, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: f.included ? `${plan.color}18` : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    {f.included
                      ? <Check size={11} color={plan.color} strokeWidth={2.5} />
                      : <X size={10} color="#5a6478" strokeWidth={2.5} />
                    }
                  </div>
                  <span style={{ color: f.included ? '#c8d4e0' : '#5a6478', fontSize: 13, lineHeight: 1.5, textDecoration: f.included ? 'none' : 'none' }}>{f.text}</span>
                </div>
              ))}
            </div>

            <button style={{
              width: '100%',
              padding: '13px',
              borderRadius: 11,
              fontFamily: 'Poppins,sans-serif',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              border: plan.highlight ? 'none' : `1.5px solid ${plan.color}`,
              background: plan.highlight ? plan.color : 'transparent',
              color: plan.highlight ? '#080f1e' : plan.color,
              boxShadow: plan.highlight ? `0 0 20px ${plan.color}55` : 'none',
              transition: 'opacity 0.15s',
            }}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Trust row */}
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 52, padding: '24px', background: '#142040', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
        {trust.map(({ icon: Icon, text }, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#8b98a8' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={15} color="#00d4ff" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, fontFamily: 'Inter,sans-serif' }}>{text}</span>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 22, color: '#f0f4ff', textAlign: 'center', marginBottom: 28 }}>Common Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: '#142040', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 22px' }}>
              <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 15, color: '#f0f4ff', marginBottom: 8 }}>{faq.q}</p>
              <p style={{ color: '#8b98a8', fontSize: 14, lineHeight: 1.65 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          div[style*="gridTemplateColumns: 'repeat(3,1fr)'"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="transform: translateY(-8px)"] {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  )
}
