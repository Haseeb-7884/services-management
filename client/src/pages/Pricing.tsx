import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Lock, RefreshCw, Shield, X, Zap } from "lucide-react";
import { fetchPlans } from "../api/plans";
import { useAuth } from "../context/AuthContext";
import { useSeo } from "../hooks/useSeo";
import type { PlanItem } from "../types";

const TRUST = [
  { icon: RefreshCw, text: "Cancel anytime" },
  { icon: Shield, text: "Secure payments" },
  { icon: Zap, text: "Instant activation" },
  { icon: Lock, text: "Privacy protected" },
];

const FAQS = [
  { q: "Can I upgrade or downgrade anytime?", a: "Yes. Changes take effect immediately and billing is prorated." },
  { q: "Is there a free trial for paid plans?", a: "Check each plan's details above - some include a trial period." },
  { q: "What happens to my content if I cancel?", a: "Your content remains accessible after cancellation; only paid-tier features are affected." },
];

export function Pricing() {
  const { user } = useAuth();
  const [yearly, setYearly] = useState(false);
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlans()
      .then(setPlans)
      .catch(() => setError("Couldn't load plans right now - please try again shortly."))
      .finally(() => setLoading(false));
  }, []);

  useSeo({ title: "Pricing", description: "Compare plans and find the right fit for your channel." });

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-[var(--brand-text)] sm:text-[42px]">Choose Your Plan</h1>
        <p className="mx-auto mb-8 max-w-md text-base text-[var(--brand-text-muted)] sm:text-lg">
          Start free, scale when you're ready. No hidden fees, no lock-in.
        </p>

        <div className="flex items-center justify-center gap-3.5">
          <span className={`text-sm font-medium ${!yearly ? "text-[var(--brand-text)]" : "text-[var(--brand-text-muted)]"}`}>Monthly</span>
          <button
            onClick={() => setYearly((y) => !y)}
            aria-label="Toggle yearly billing"
            className="relative h-7 w-[52px] rounded-full border transition"
            style={{
              backgroundColor: yearly ? "var(--brand-primary)" : "var(--border-subtle)",
              borderColor: yearly ? "transparent" : "var(--border-subtle)",
              boxShadow: yearly ? "0 0 12px var(--glow-primary)" : "none",
            }}
          >
            <span
              className="absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow transition-all"
              style={{ left: yearly ? 26 : 3 }}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${yearly ? "text-[var(--brand-text)]" : "text-[var(--brand-text-muted)]"}`}>Yearly</span>
            <span
              className="rounded-full border px-2.5 py-0.5 text-[11px] font-bold"
              style={{ borderColor: "var(--border-highlight)", backgroundColor: "color-mix(in srgb, var(--brand-primary) 10%, transparent)", color: "var(--brand-primary)" }}
            >
              Save 28%
            </span>
          </div>
        </div>
      </div>

      {/* Plan cards */}
      {loading ? (
        <div className="mb-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[420px] animate-pulse rounded-3xl" style={{ backgroundColor: "var(--surface-card)" }} />
          ))}
        </div>
      ) : error ? (
        <p className="mb-14 rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-600">{error}</p>
      ) : plans.length === 0 ? (
        <p className="mb-14 rounded-2xl border py-10 text-center text-sm text-[var(--brand-text-muted)]" style={{ borderColor: "var(--border-subtle)" }}>
          Plans haven't been configured yet.
        </p>
      ) : (
      <div className="mb-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`relative rounded-3xl border p-7 ${plan.highlight ? "sm:-translate-y-2" : ""}`}
            style={{
              borderColor: plan.highlight ? "var(--brand-primary)" : "var(--border-subtle)",
              borderWidth: plan.highlight ? 2 : 1,
              backgroundColor: "var(--surface-card)",
              boxShadow: plan.highlight ? "0 0 0 1px var(--glow-primary), var(--shadow-lg)" : "var(--shadow-sm)",
            }}
          >
            {plan.badge && (
              <div
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-wide"
                style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)", boxShadow: "0 0 16px var(--glow-primary)" }}
              >
                {plan.badge}
              </div>
            )}

            <span
              className="mb-4 inline-block rounded-full px-3.5 py-1 text-[13px] font-bold"
              style={{
                backgroundColor: plan.highlight ? "color-mix(in srgb, var(--brand-primary) 14%, transparent)" : "var(--border-subtle)",
                color: plan.highlight ? "var(--brand-primary)" : "var(--brand-text-muted)",
              }}
            >
              {plan.name}
            </span>
            <div className="mb-1.5 flex items-end gap-1">
              <span className="text-[40px] font-extrabold leading-none tracking-tight text-[var(--brand-text)]">
                {plan.monthly === 0 ? "Free" : `$${yearly ? plan.yearly : plan.monthly}`}
              </span>
              {plan.monthly > 0 && <span className="mb-1.5 text-sm text-[var(--brand-text-muted)]">/mo</span>}
            </div>
            {plan.monthly > 0 && yearly && (
              <p className="mb-2 text-xs text-[var(--brand-text-muted)]">Billed yearly · Save ${(plan.monthly - plan.yearly) * 12}/yr</p>
            )}
            <p className="mb-5 text-[13px] leading-relaxed text-[var(--brand-text-muted)]">{plan.description}</p>

            <div className="mb-5 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />

            <div className="mb-7 flex flex-col gap-3">
              {plan.features.map((f) => (
                <div key={f.text} className="flex items-start gap-2.5">
                  <div
                    className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full"
                    style={{ backgroundColor: f.included ? "color-mix(in srgb, var(--brand-primary) 14%, transparent)" : "var(--border-subtle)" }}
                  >
                    {f.included ? <Check size={11} color="var(--brand-primary)" strokeWidth={2.5} /> : <X size={10} className="text-[var(--brand-text-muted)]" strokeWidth={2.5} />}
                  </div>
                  <span className={`text-[13px] leading-relaxed ${f.included ? "text-[var(--brand-text)]" : "text-[var(--brand-text-muted)]"}`}>{f.text}</span>
                </div>
              ))}
            </div>

            <Link
              to={user ? "/dashboard" : "/register"}
              className="block w-full rounded-xl py-3 text-center text-sm font-bold transition"
              style={
                plan.highlight
                  ? { backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)", boxShadow: "0 8px 20px var(--glow-primary)" }
                  : { border: "1.5px solid var(--brand-primary)", color: "var(--brand-primary)", backgroundColor: "transparent" }
              }
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
      )}

      {!loading && plans.some((p) => p.monthly > 0) && (
        <p className="mb-14 text-center text-xs text-[var(--brand-text-muted)]">
          Paid-plan checkout isn't live yet - signing up gets you started on the Free plan today.
        </p>
      )}

      {/* Trust row */}
      <div
        className="mb-14 flex flex-wrap justify-center gap-6 rounded-2xl border p-6"
        style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}
      >
        {TRUST.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2.5 text-[var(--brand-text-muted)]">
            <div
              className="grid h-9 w-9 place-items-center rounded-lg border"
              style={{ borderColor: "var(--border-highlight)", backgroundColor: "color-mix(in srgb, var(--brand-primary) 8%, transparent)" }}
            >
              <Icon size={15} color="var(--brand-primary)" />
            </div>
            <span className="text-sm font-medium">{text}</span>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-7 text-center text-[22px] font-bold text-[var(--brand-text)]">Common Questions</h2>
        <div className="flex flex-col gap-3">
          {FAQS.map((faq) => (
            <div key={faq.q} className="rounded-2xl border p-5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}>
              <p className="mb-1.5 text-[15px] font-semibold text-[var(--brand-text)]">{faq.q}</p>
              <p className="text-sm leading-relaxed text-[var(--brand-text-muted)]">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
