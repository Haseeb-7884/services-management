"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/api/client";

const CATEGORIES = ["Technology", "Gaming", "Lifestyle", "Education", "Music", "Sports", "News", "Comedy", "General"];

export default function DashboardSettings() {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.profile.displayName ?? "");
  const [bio, setBio] = useState(user?.profile.bio ?? "");
  const [tagline, setTagline] = useState(user?.profile.tagline ?? "");
  const [category, setCategory] = useState(user?.profile.category ?? "");
  const [website, setWebsite] = useState(user?.profile.socialLinks?.website ?? "");
  const [twitter, setTwitter] = useState(user?.profile.socialLinks?.twitter ?? "");
  const [instagram, setInstagram] = useState(user?.profile.socialLinks?.instagram ?? "");
  const [youtube, setYoutube] = useState(user?.profile.socialLinks?.youtube ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const inputClass = "w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-[var(--border-highlight)]";
  const inputStyle = { borderColor: "var(--border-subtle)", backgroundColor: "var(--brand-bg-start)", color: "var(--brand-text)" };
  const labelClass = "mb-1.5 block text-xs font-medium text-[var(--brand-text-muted)]";

  const save = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await updateProfile({
        displayName,
        bio,
        tagline,
        category,
        socialLinks: { website, twitter, instagram, youtube },
      });
      setMessage("Saved.");
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't save your changes."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">Settings</h1>
      <p className="mb-7 text-sm text-[var(--brand-text-muted)]">Manage how you appear across the platform.</p>

      <div className="space-y-5 rounded-2xl border p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
        <div>
          <label className={labelClass}>Display name</label>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputClass} style={inputStyle} placeholder="Your name" />
        </div>
        <div>
          <label className={labelClass}>Tagline</label>
          <input value={tagline} onChange={(e) => setTagline(e.target.value.slice(0, 100))} className={inputClass} style={inputStyle} placeholder="A one-line hook for your channel" />
        </div>
        <div>
          <label className={labelClass}>Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className={inputClass} style={inputStyle} placeholder="Tell people about your channel" />
        </div>
        <div>
          <label className={labelClass}>Content category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} style={inputStyle}>
            <option value="">Select a category…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Social links</label>
          <div className="space-y-2">
            <input value={website} onChange={(e) => setWebsite(e.target.value)} className={inputClass} style={inputStyle} placeholder="Website URL" />
            <input value={twitter} onChange={(e) => setTwitter(e.target.value)} className={inputClass} style={inputStyle} placeholder="X / Twitter URL" />
            <input value={instagram} onChange={(e) => setInstagram(e.target.value)} className={inputClass} style={inputStyle} placeholder="Instagram URL" />
            <input value={youtube} onChange={(e) => setYoutube(e.target.value)} className={inputClass} style={inputStyle} placeholder="YouTube URL" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Username</label>
          <input disabled value={user?.username ?? ""} className={inputClass} style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }} />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input disabled value={user?.email ?? ""} className={inputClass} style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }} />
        </div>

        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        {message && (
          <p className="flex items-center gap-1.5 text-sm font-medium text-[var(--brand-primary)]">
            <Check size={14} /> {message}
          </p>
        )}

        <button onClick={save} disabled={saving} className="btn-glow rounded-lg px-6 py-2.5 text-sm font-bold disabled:opacity-50" style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
