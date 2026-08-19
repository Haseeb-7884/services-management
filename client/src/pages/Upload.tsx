import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileImage, FileText, Trash2, UploadCloud, Video, X } from "lucide-react";
import { uploadVideo } from "../api/videos";
import { uploadImage } from "../api/images";
import { createArticle } from "../api/articles";
import { useSeo } from "../hooks/useSeo";
import { TOPIC_CATEGORIES } from "../constants/categories";

const CATEGORY_OPTIONS = TOPIC_CATEGORIES.filter((c) => c !== "All");

const inputClass = "w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--border-highlight)]";
const inputStyle = { borderColor: "var(--border-subtle)", backgroundColor: "var(--brand-bg-start)", color: "var(--brand-text)" };
const labelClass = "mb-1.5 block text-xs font-medium text-[var(--brand-text-muted)]";

const TITLE_MAX = 100;
const DESCRIPTION_MAX = 5000;

export function Upload() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"video" | "image" | "article">("video");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // video description / image caption, shared field for a unified "details" panel
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].toLowerCase());
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useSeo({ title: "Upload", description: "Publish a new video, image or article.", noindex: true });

  const accept = tab === "video" ? "video/*" : "image/*";

  // Local object-URL preview of whatever file was just picked, so the
  // details step shows the actual video/image the way YouTube's upload
  // dialog previews it before publishing - not just a filename chip.
  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const changeTab = (t: typeof tab) => {
    setTab(t);
    clearFile();
    setError("");
  };

  const submit = async () => {
    if (tab !== "article" && !file) return setError("Choose a file first");
    if (!title.trim()) return setError(tab === "image" ? "Give your image a caption" : "Give your upload a title");
    if (tab === "article" && !body.trim()) return setError("Write something in the article body first");
    setSubmitting(true);
    setError("");
    try {
      if (tab === "video") {
        const video = await uploadVideo({ file: file!, title, description, category, tags });
        navigate(`/videos/${video._id}`);
      } else if (tab === "image") {
        const image = await uploadImage({ file: file!, caption: title, category, tags });
        navigate(`/images/${image._id}`);
      } else {
        const article = await createArticle({ title, excerpt, body, category, tags, cover: file });
        navigate(`/articles/${article._id}`);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  const showDetailsStep = tab === "article" || Boolean(file);

  const categorySelect = (
    <div>
      <label className={labelClass}>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} style={inputStyle}>
        {CATEGORY_OPTIONS.map((c) => (
          <option key={c} value={c.toLowerCase()}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">
        {showDetailsStep && tab !== "article" ? "Add details" : "Upload content"}
      </h1>
      <p className="mb-7 text-sm text-[var(--brand-text-muted)]">
        {tab === "video" && showDetailsStep
          ? "Your video is ready - fill in the details below, then publish."
          : tab === "image" && showDetailsStep
            ? "Your image is ready - add a caption and category, then publish."
            : "Publish a new video, image or article to your channel."}
      </p>

      {/* Tabs */}
      <div className="mb-6 flex max-w-sm gap-1 rounded-full border p-1" style={{ borderColor: "var(--border-subtle)" }}>
        {(["video", "image", "article"] as const).map((t) => (
          <button
            key={t}
            onClick={() => changeTab(t)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-semibold capitalize transition"
            style={tab === t ? { backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" } : { color: "var(--brand-text-muted)" }}
          >
            {t === "video" ? <Video size={15} /> : t === "image" ? <FileImage size={15} /> : <FileText size={15} />}
            {t}
          </button>
        ))}
      </div>

      {!showDetailsStep ? (
        // Step 1 - big drop zone, matching YouTube's initial upload screen
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            const dropped = e.dataTransfer.files?.[0];
            if (dropped) setFile(dropped);
          }}
          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-24 text-center transition"
          style={{
            borderColor: dragActive ? "var(--brand-primary)" : "var(--border-subtle)",
            backgroundColor: dragActive ? "color-mix(in srgb, var(--brand-primary) 6%, transparent)" : "var(--surface-card)",
          }}
        >
          <input ref={fileInputRef} type="file" accept={accept} onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="hidden" />
          <div className="mb-4 grid h-16 w-16 place-items-center rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 10%, transparent)" }}>
            <UploadCloud size={28} color="var(--brand-primary)" />
          </div>
          <p className="mb-1.5 text-base font-semibold text-[var(--brand-text)]">
            Drag &amp; drop your {tab} here, or <span className="text-[var(--brand-primary)]">browse</span>
          </p>
          <p className="text-xs text-[var(--brand-text-muted)]">{tab === "video" ? "MP4, WEBM, MOV or MKV up to 500MB" : "JPG, PNG, WEBP or GIF up to 500MB"}</p>
        </label>
      ) : (
        // Step 2 - details, YouTube Studio-style two-column layout (preview stays visible while you fill in metadata)
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4 rounded-2xl border p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className={labelClass}>{tab === "image" ? "Caption" : "Title"} (required)</label>
                <span className="text-[11px] text-[var(--brand-text-muted)]">{title.length}/{TITLE_MAX}</span>
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
                placeholder={tab === "image" ? "Write a caption" : tab === "article" ? "Give your article a title" : "Give your video a title that describes it"}
                className={inputClass}
                style={inputStyle}
                autoFocus
              />
            </div>

            {tab === "article" && (
              <div>
                <label className={labelClass}>Excerpt (optional)</label>
                <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="A short summary shown in previews" className={inputClass} style={inputStyle} />
              </div>
            )}

            {tab === "video" && (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className={labelClass}>Description</label>
                  <span className="text-[11px] text-[var(--brand-text-muted)]">{description.length}/{DESCRIPTION_MAX}</span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, DESCRIPTION_MAX))}
                  placeholder="Tell viewers about your video…"
                  rows={6}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            )}

            {tab === "article" && (
              <div>
                <label className={labelClass}>Body</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your article…" rows={10} className={inputClass} style={inputStyle} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {categorySelect}
              <div>
                <label className={labelClass}>Tags</label>
                <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Comma separated" className={inputClass} style={inputStyle} />
              </div>
            </div>

            {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            <div className="flex items-center justify-between pt-2">
              {tab !== "article" ? (
                <button type="button" onClick={clearFile} className="flex items-center gap-1.5 text-sm font-medium text-[var(--brand-text-muted)] hover:text-red-600">
                  <Trash2 size={14} /> Remove file
                </button>
              ) : (
                <span />
              )}
              <button
                onClick={submit}
                disabled={submitting}
                className="btn-glow rounded-lg px-8 py-2.5 text-sm font-bold disabled:opacity-50"
                style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}
              >
                {submitting ? "Publishing…" : "Publish"}
              </button>
            </div>
          </div>

          {/* Preview column */}
          <div className="h-fit lg:sticky lg:top-24">
            {tab === "article" ? (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  const dropped = e.dataTransfer.files?.[0];
                  if (dropped) setFile(dropped);
                }}
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-10 text-center transition"
                style={{
                  borderColor: dragActive ? "var(--brand-primary)" : "var(--border-subtle)",
                  backgroundColor: dragActive ? "color-mix(in srgb, var(--brand-primary) 6%, transparent)" : "var(--surface-card)",
                }}
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="hidden" />
                {previewUrl ? (
                  <div className="w-full">
                    <img src={previewUrl} alt="Cover preview" className="mb-3 aspect-video w-full rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        clearFile();
                      }}
                      className="mx-auto flex items-center gap-1.5 text-xs font-medium text-[var(--brand-text-muted)] hover:text-red-600"
                    >
                      <X size={12} /> Remove cover
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadCloud size={22} color="var(--brand-primary)" className="mb-2" />
                    <p className="text-xs font-medium text-[var(--brand-text)]">Optional cover image</p>
                    <p className="text-[11px] text-[var(--brand-text-muted)]">Drag & drop or browse</p>
                  </>
                )}
              </label>
            ) : (
              <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
                <div className="aspect-video w-full bg-black">
                  {tab === "video" ? (
                    <video src={previewUrl} controls className="h-full w-full object-contain" />
                  ) : (
                    <img src={previewUrl} alt="Preview" className="h-full w-full object-contain" />
                  )}
                </div>
                <div className="p-4">
                  <p className="truncate text-sm font-semibold text-[var(--brand-text)]">{file?.name}</p>
                  <p className="mb-2 text-xs text-[var(--brand-text-muted)]">{file ? (file.size / (1024 * 1024)).toFixed(1) : 0} MB</p>
                  {tab === "video" && (
                    <p className="text-[11px] leading-relaxed text-[var(--brand-text-muted)]">
                      A thumbnail is generated automatically from your video once it's published.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
