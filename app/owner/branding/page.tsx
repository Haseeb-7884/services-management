"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useBranding } from "@/context/BrandingContext";
import { updateBranding, uploadFavicon, uploadLogo } from "@/api/config";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import type { Branding } from "@/types";

function OwnerBrandingSettingsInner() {
  const { branding, refresh } = useBranding();
  const [form, setForm] = useState<Branding>(branding);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => setForm(branding), [branding]);

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      await updateBranding(form);
      await refresh();
      setMessage("Saved - live across the site.");
    } finally {
      setSaving(false);
    }
  };

  const cardClass = "space-y-3 rounded-2xl border p-5";
  const cardStyle = { borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" };
  const inputClass = "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[var(--border-highlight)]";
  const inputStyle = { borderColor: "var(--border-subtle)", backgroundColor: "var(--brand-bg-start)", color: "var(--brand-text)" };

  const colorField = (key: keyof Branding["theme"]["colors"], label: string) => (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span className="text-[var(--brand-text-muted)]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-[var(--brand-text-muted)]">{form.theme.colors[key]}</span>
        <input
          type="color"
          value={form.theme.colors[key]}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              theme: { ...f.theme, colors: { ...f.theme.colors, [key]: e.target.value } },
            }))
          }
          className="h-8 w-12 cursor-pointer rounded border bg-transparent"
          style={{ borderColor: "var(--border-subtle)" }}
        />
      </div>
    </label>
  );

  const { colors } = form.theme;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">Branding settings</h1>
      <p className="mb-7 text-sm text-[var(--brand-text-muted)]">Everything here is dynamic - changes apply across the whole site the moment you save, no redeploy needed.</p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Form column */}
        <div className="space-y-6">
          <section className={cardClass} style={cardStyle}>
            <h2 className="text-sm font-semibold text-[var(--brand-text)]">Identity</h2>
            <input value={form.siteName} onChange={(e) => setForm((f) => ({ ...f, siteName: e.target.value }))} placeholder="Site name" className={inputClass} style={inputStyle} />

            <div className="flex items-center gap-3">
              <label className="cursor-pointer rounded-lg border px-3.5 py-2 text-sm font-medium transition hover:bg-[var(--surface-card-hover)]" style={{ borderColor: "var(--border-subtle)" }}>
                Upload logo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      await uploadLogo(e.target.files[0]);
                      refresh();
                    }
                  }}
                />
              </label>
              {form.logoUrl && <img src={form.logoUrl} className="h-9 w-9 rounded-lg object-cover" alt="Logo" />}
            </div>

            <div className="flex items-center gap-3">
              <label className="cursor-pointer rounded-lg border px-3.5 py-2 text-sm font-medium transition hover:bg-[var(--surface-card-hover)]" style={{ borderColor: "var(--border-subtle)" }}>
                Upload favicon
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      await uploadFavicon(e.target.files[0]);
                      refresh();
                    }
                  }}
                />
              </label>
              {form.faviconUrl && <img src={form.faviconUrl} className="h-6 w-6 rounded" alt="Favicon" />}
            </div>
          </section>

          <section className={cardClass} style={cardStyle}>
            <h2 className="text-sm font-semibold text-[var(--brand-text)]">Theme colors</h2>
            {colorField("primary", "Primary")}
            {colorField("secondary", "Secondary")}
            {colorField("backgroundStart", "Background start")}
            {colorField("backgroundEnd", "Background end")}
            {colorField("textPrimary", "Text")}
            {colorField("textMuted", "Muted text")}
          </section>

          <section className={cardClass} style={cardStyle}>
            <h2 className="text-sm font-semibold text-[var(--brand-text)]">Footer</h2>
            <input value={form.footer.text} onChange={(e) => setForm((f) => ({ ...f, footer: { ...f.footer, text: e.target.value } }))} placeholder="Footer text" className={inputClass} style={inputStyle} />
          </section>

          <section className={cardClass} style={cardStyle}>
            <h2 className="text-sm font-semibold text-[var(--brand-text)]">SEO defaults</h2>
            <p className="text-xs text-[var(--brand-text-muted)]">Used as the fallback page title, description and share-preview image for any page that doesn&apos;t set its own (Home, Pricing, etc.).</p>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--brand-text-muted)]">Meta title</label>
              <input
                value={form.seoDefaults.metaTitle}
                onChange={(e) => setForm((f) => ({ ...f, seoDefaults: { ...f.seoDefaults, metaTitle: e.target.value } }))}
                placeholder={form.siteName || "Site title"}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--brand-text-muted)]">Meta description</label>
              <textarea
                value={form.seoDefaults.metaDescription}
                onChange={(e) => setForm((f) => ({ ...f, seoDefaults: { ...f.seoDefaults, metaDescription: e.target.value } }))}
                placeholder="A one-sentence summary shown in search results and link previews"
                rows={2}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--brand-text-muted)]">Default share image URL</label>
              <input
                value={form.seoDefaults.ogImageUrl}
                onChange={(e) => setForm((f) => ({ ...f, seoDefaults: { ...f.seoDefaults, ogImageUrl: e.target.value } }))}
                placeholder="https://…"
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </section>

          {message && (
            <p className="flex items-center gap-1.5 text-sm font-medium text-[var(--brand-primary)]">
              <Check size={14} /> {message}
            </p>
          )}
          <button onClick={save} disabled={saving} className="btn-glow w-full rounded-lg py-2.5 text-sm font-bold disabled:opacity-50 sm:w-auto sm:px-8" style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}>
            {saving ? "Saving…" : "Save branding"}
          </button>
        </div>

        {/* Live preview column */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--brand-text-muted)]">Live preview</p>
          <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-lg)" }}>
            {/* Mini navbar */}
            <div className="flex items-center gap-2 border-b px-4 py-3" style={{ backgroundColor: colors.backgroundEnd, borderColor: "color-mix(in srgb, " + colors.textMuted + " 25%, transparent)" }}>
              {form.logoUrl ? (
                <img src={form.logoUrl} className="h-6 w-6 rounded object-cover" alt="" />
              ) : (
                <span className="grid h-6 w-6 place-items-center rounded text-[10px] font-bold" style={{ backgroundColor: colors.primary, color: colors.backgroundEnd }}>
                  {form.siteName.charAt(0).toUpperCase() || "?"}
                </span>
              )}
              <span className="text-xs font-semibold" style={{ color: colors.textPrimary }}>
                {form.siteName || "Your site"}
              </span>
            </div>
            {/* Mini hero */}
            <div className="p-5" style={{ background: `linear-gradient(160deg, ${colors.backgroundStart}, ${colors.backgroundEnd})` }}>
              <span className="mb-3 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ backgroundColor: `color-mix(in srgb, ${colors.primary} 18%, transparent)`, color: colors.primary }}>
                Featured
              </span>
              <p className="mb-1.5 text-base font-extrabold leading-snug" style={{ color: colors.textPrimary }}>
                This is how your headlines will look
              </p>
              <p className="mb-4 text-xs leading-relaxed" style={{ color: colors.textMuted }}>
                Secondary copy and captions use the muted text color across the site.
              </p>
              <div className="flex gap-2">
                <span className="rounded-lg px-3.5 py-1.5 text-xs font-bold" style={{ backgroundColor: colors.primary, color: colors.backgroundEnd }}>
                  Primary button
                </span>
                <span className="rounded-lg border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: colors.secondary, color: colors.secondary }}>
                  Secondary
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[var(--brand-text-muted)]">Updates as you edit - this is what visitors will see once you save.</p>
        </div>
      </div>
    </div>
  );
}

export default function OwnerBrandingSettings() {
  return (
    <ProtectedRoute allow={["owner"]}>
      <OwnerBrandingSettingsInner />
    </ProtectedRoute>
  );
}
