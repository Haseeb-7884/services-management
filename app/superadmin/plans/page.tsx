"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Pencil, Plus, RotateCcw, Tag, Trash2, X } from "lucide-react";
import { createPlan, deletePlan, fetchAllPlans, updatePlan, type PlanPayload } from "@/api/plans";
import { getErrorMessage } from "@/api/client";
import { useConfirm } from "@/components/ConfirmDialog";
import type { PlanItem } from "@/types";

type FormState = {
  name: string;
  slug: string;
  monthly: string;
  yearly: string;
  description: string;
  cta: string;
  highlight: boolean;
  badge: string;
  order: string;
  features: { text: string; included: boolean }[];
};

const EMPTY_FORM: FormState = {
  name: "",
  slug: "",
  monthly: "0",
  yearly: "0",
  description: "",
  cta: "Get Started",
  highlight: false,
  badge: "",
  order: "0",
  features: [{ text: "", included: true }],
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function planToForm(plan: PlanItem): FormState {
  return {
    name: plan.name,
    slug: plan.slug,
    monthly: String(plan.monthly),
    yearly: String(plan.yearly),
    description: plan.description ?? "",
    cta: plan.cta ?? "Get Started",
    highlight: plan.highlight ?? false,
    badge: plan.badge ?? "",
    order: String(plan.order ?? 0),
    features: plan.features.length > 0 ? plan.features.map((f) => ({ text: f.text, included: f.included })) : [{ text: "", included: true }],
  };
}

const inputClass = "w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--border-highlight)]";
const inputStyle = { borderColor: "var(--border-subtle)", backgroundColor: "var(--brand-bg-start)", color: "var(--brand-text)" };
const labelClass = "mb-1.5 block text-xs font-medium text-[var(--brand-text-muted)]";

export default function SuperAdminPlans() {
  const confirm = useConfirm();
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError("");
    fetchAllPlans()
      .then(setPlans)
      .catch((err) => setError(getErrorMessage(err, "Couldn't load plans")))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (plan: PlanItem) => {
    setEditingId(plan._id);
    setForm(planToForm(plan));
    setSlugTouched(true);
    setFormError("");
    setFormOpen(true);
  };

  const closeForm = () => setFormOpen(false);

  const updateFeature = (index: number, patch: Partial<{ text: string; included: boolean }>) => {
    setForm((f) => ({ ...f, features: f.features.map((feat, i) => (i === index ? { ...feat, ...patch } : feat)) }));
  };
  const addFeature = () => setForm((f) => ({ ...f, features: [...f.features, { text: "", included: true }] }));
  const removeFeature = (index: number) => setForm((f) => ({ ...f, features: f.features.filter((_, i) => i !== index) }));

  const handleSubmit = async () => {
    if (!form.name.trim()) return setFormError("Plan name is required");
    if (!form.slug.trim()) return setFormError("Slug is required");
    const monthly = Number(form.monthly);
    const yearly = Number(form.yearly);
    if (Number.isNaN(monthly) || monthly < 0) return setFormError("Monthly price must be a number ≥ 0");
    if (Number.isNaN(yearly) || yearly < 0) return setFormError("Yearly price must be a number ≥ 0");

    const payload: PlanPayload = {
      name: form.name.trim(),
      slug: slugify(form.slug),
      monthly,
      yearly,
      description: form.description.trim(),
      cta: form.cta.trim() || "Get Started",
      highlight: form.highlight,
      badge: form.badge.trim(),
      order: Number(form.order) || 0,
      features: form.features.map((f) => ({ text: f.text.trim(), included: f.included })).filter((f) => f.text.length > 0),
    };

    setSaving(true);
    setFormError("");
    try {
      if (editingId) await updatePlan(editingId, payload);
      else await createPlan(payload);
      setFormOpen(false);
      load();
    } catch (err) {
      setFormError(getErrorMessage(err, "Couldn't save this plan"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (plan: PlanItem) => {
    const confirmed = await confirm({ message: `Deactivate "${plan.name}"? It will disappear from the pricing page - you can reactivate it any time.`, confirmLabel: "Deactivate", danger: true });
    if (!confirmed) return;
    setBusyId(plan._id);
    try {
      await deletePlan(plan._id);
      load();
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't deactivate this plan"));
    } finally {
      setBusyId(null);
    }
  };

  const handleReactivate = async (plan: PlanItem) => {
    setBusyId(plan._id);
    try {
      await updatePlan(plan._id, { isActive: true });
      load();
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't reactivate this plan"));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 12%, transparent)" }}>
            <Tag size={18} color="var(--brand-primary)" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[var(--brand-text)]">Pricing Plans</h1>
            <p className="text-sm text-[var(--brand-text-muted)]">Create and edit the plans shown on the public pricing page.</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="btn-glow flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-bold"
          style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}
        >
          <Plus size={15} /> New plan
        </button>
      </div>

      {error && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl" style={{ backgroundColor: "var(--surface-card)" }} />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="rounded-2xl border py-16 text-center" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}>
          <p className="text-sm font-medium text-[var(--brand-text)]">No plans yet</p>
          <p className="text-sm text-[var(--brand-text-muted)]">Create your first plan to show it on the pricing page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="card-hover flex flex-col rounded-2xl border p-5"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)", opacity: plan.isActive ? 1 : 0.55 }}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <p className="text-base font-bold text-[var(--brand-text)]">{plan.name}</p>
                  <p className="text-xs text-[var(--brand-text-muted)]">/{plan.slug}</p>
                </div>
                <div className="flex gap-1">
                  {plan.highlight && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 14%, transparent)", color: "var(--brand-primary)" }}>
                      Highlighted
                    </span>
                  )}
                  {!plan.isActive && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: "rgba(220,38,38,0.1)", color: "#dc2626" }}>
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              <p className="mb-3 text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">
                {plan.monthly === 0 ? "Free" : `$${plan.monthly}`}
                {plan.monthly > 0 && <span className="text-xs font-medium text-[var(--brand-text-muted)]">/mo</span>}
              </p>
              {plan.description && <p className="mb-3 line-clamp-2 text-[13px] text-[var(--brand-text-muted)]">{plan.description}</p>}
              <ul className="mb-4 flex-1 space-y-1.5">
                {plan.features.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-[12px] text-[var(--brand-text-muted)]">
                    <Check size={12} color={f.included ? "var(--brand-primary)" : "var(--border-medium)"} />
                    <span className={f.included ? "" : "line-through opacity-60"}>{f.text}</span>
                  </li>
                ))}
                {plan.features.length > 4 && <li className="text-[11px] text-[var(--brand-text-muted)]">+{plan.features.length - 4} more</li>}
              </ul>
              <div className="flex gap-2 border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
                <button
                  onClick={() => openEdit(plan)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-150 hover:bg-[var(--surface-card-hover)] active:scale-95"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <Pencil size={12} /> Edit
                </button>
                {plan.isActive ? (
                  <button
                    onClick={() => handleDelete(plan)}
                    disabled={busyId === plan._id}
                    className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold text-red-600 transition-all duration-150 hover:bg-red-50 active:scale-95 disabled:opacity-50"
                    style={{ borderColor: "rgba(220,38,38,0.3)" }}
                  >
                    <Trash2 size={12} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleReactivate(plan)}
                    disabled={busyId === plan._id}
                    className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold text-green-600 transition-all duration-150 hover:bg-green-50 active:scale-95 disabled:opacity-50"
                    style={{ borderColor: "rgba(22,163,74,0.3)" }}
                  >
                    <RotateCcw size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto p-4 py-10">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={closeForm} />
          <div className="relative w-full max-w-lg rounded-2xl border p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-lg)" }}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-bold text-[var(--brand-text)]">{editingId ? "Edit plan" : "New plan"}</h2>
              <button onClick={closeForm} className="rounded-lg p-1 text-[var(--brand-text-muted)] transition hover:bg-[var(--surface-card-hover)]" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }));
                    }}
                    placeholder="Pro"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelClass}>Slug</label>
                  <input
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setForm((f) => ({ ...f, slug: e.target.value }));
                    }}
                    placeholder="pro"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Monthly price ($)</label>
                  <input type="number" min={0} value={form.monthly} onChange={(e) => setForm((f) => ({ ...f, monthly: e.target.value }))} className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className={labelClass}>Yearly price ($/mo)</label>
                  <input type="number" min={0} value={form.yearly} onChange={(e) => setForm((f) => ({ ...f, yearly: e.target.value }))} className={inputClass} style={inputStyle} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className={inputClass} style={inputStyle} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Button text</label>
                  <input value={form.cta} onChange={(e) => setForm((f) => ({ ...f, cta: e.target.value }))} className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className={labelClass}>Badge (optional)</label>
                  <input value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} placeholder="Most popular" className={inputClass} style={inputStyle} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Sort order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))} className={inputClass} style={inputStyle} />
                </div>
                <label className="mt-6 flex items-center gap-2 text-sm text-[var(--brand-text)]">
                  <input type="checkbox" checked={form.highlight} onChange={(e) => setForm((f) => ({ ...f, highlight: e.target.checked }))} className="h-4 w-4" />
                  Highlight this plan
                </label>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className={labelClass}>Features</label>
                  <button onClick={addFeature} className="text-xs font-semibold text-[var(--brand-primary)]" type="button">
                    + Add feature
                  </button>
                </div>
                <div className="space-y-2">
                  {form.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="checkbox" checked={f.included} onChange={(e) => updateFeature(i, { included: e.target.checked })} className="h-4 w-4 shrink-0" title="Included" />
                      <input value={f.text} onChange={(e) => updateFeature(i, { text: e.target.value })} placeholder="Feature text" className={`${inputClass} flex-1`} style={inputStyle} />
                      <button onClick={() => removeFeature(i)} className="shrink-0 text-[var(--brand-text-muted)] hover:text-red-600" type="button" aria-label="Remove feature">
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {formError && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>}
            </div>

            <div className="mt-5 flex justify-end gap-2.5 border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>
              <button onClick={closeForm} className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-[var(--surface-card-hover)]" style={{ borderColor: "var(--border-subtle)" }}>
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg px-5 py-2 text-sm font-bold disabled:opacity-60"
                style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editingId ? "Save changes" : "Create plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
