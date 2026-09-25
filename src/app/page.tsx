"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Clock3,
  FileText,
  LogOut,
  Menu,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

type Story = {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Community" | "Events" | "Local News" | "Opinion";
  status: "draft" | "published" | "pending";
  author: { name: string; email: string };
  createdAt: string;
  updatedAt: string;
};

type User = { id: string; name: string; email: string; role: "member" | "admin"; verified: boolean };

const categories = ["Community", "Events", "Local News", "Opinion"] as const;
const demoStories: Story[] = [
  { _id: "demo-1", title: "The allotment that brought a whole street together", excerpt: "What started as three raised beds is now a shared garden, weekly lunch club, and a new reason for neighbours to knock on each other’s doors.", content: "What started as three raised beds is now a shared garden.", category: "Community", status: "published", author: { name: "Jamie Morgan", email: "jamie@example.com" }, createdAt: "2026-06-08", updatedAt: "2026-06-08" },
  { _id: "demo-2", title: "A tiny festival with a big welcome", excerpt: "St George’s Park comes alive this Saturday with independent makers, local musicians, and food from across the city.", content: "St George’s Park comes alive this Saturday.", category: "Events", status: "published", author: { name: "Priya Shah", email: "priya@example.com" }, createdAt: "2026-06-06", updatedAt: "2026-06-06" },
  { _id: "demo-3", title: "Why our high street needs your ideas", excerpt: "A new community design project is asking residents what would make the high street feel more welcoming, useful, and distinctly local.", content: "A new community design project is asking residents for ideas.", category: "Opinion", status: "published", author: { name: "Alex Thomas", email: "alex@example.com" }, createdAt: "2026-06-03", updatedAt: "2026-06-03" },
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authOpen, setAuthOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Story | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [mobileMenu, setMobileMenu] = useState(false);

  async function load() {
    const [meResponse, storiesResponse] = await Promise.all([fetch("/api/auth/me"), fetch("/api/stories")]);
    const me = await meResponse.json();
    const storyData = await storiesResponse.json();
    setUser(me.user ?? null);
    setStories(storyData.stories?.length ? storyData.stories : demoStories);
    setLoading(false);
  }

  useEffect(() => {
    // Initial data synchronization happens once when the client mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const filtered = useMemo(
    () =>
      stories.filter((story) => {
        const matchesQuery = `${story.title} ${story.excerpt} ${story.author.name}`.toLowerCase().includes(query.toLowerCase());
        return matchesQuery && (category === "All" || story.category === category);
      }),
    [stories, query, category],
  );

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  function openNew() {
    if (!user) {
      setAuthMode("login");
      setAuthOpen(true);
      return;
    }
    setEditing(null);
    setFormOpen(true);
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#17202b]">
      <header className="sticky top-0 z-30 border-b border-[#e5e8ed] bg-[#f7f8fa]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#" className="flex items-center gap-3" aria-label="Bristol Common home">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#ec6b4f] text-white shadow-sm"><Sparkles size={19} /></span>
            <span><strong className="block font-[family-name:var(--font-display)] text-lg tracking-tight">Bristol Common</strong><span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7c8794]">Neighbourhood stories</span></span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#596675] md:flex">
            <a href="#stories" className="transition hover:text-[#ec6b4f]">Explore stories</a>
            <a href="#how-it-works" className="transition hover:text-[#ec6b4f]">How it works</a>
            {user?.role === "admin" && <span className="rounded-full bg-[#e6f1ed] px-3 py-1.5 text-[#27745d]">Moderator view</span>}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {user ? <><span className="text-sm font-semibold text-[#596675]">Hi, {user.name.split(" ")[0]}</span><button onClick={logout} className="btn-secondary"><LogOut size={15} /> Log out</button></> : <><button onClick={() => { setAuthMode("login"); setAuthOpen(true); }} className="text-sm font-bold text-[#596675]">Log in</button><button onClick={() => { setAuthMode("register"); setAuthOpen(true); }} className="btn-dark">Join the hub <ArrowRight size={15} /></button></>}
          </div>
          <button className="md:hidden" aria-label="Open menu" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</button>
        </div>
        {mobileMenu && <div className="border-t border-[#e5e8ed] px-5 py-4 md:hidden"><a className="block py-2 font-semibold" href="#stories">Explore stories</a><button className="mt-3 w-full btn-dark" onClick={openNew}><Plus size={16} /> Share a story</button></div>}
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-14 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:pb-24 lg:pt-24">
        <div className="max-w-2xl self-center">
          <div className="eyebrow"><span className="eyebrow-dot" /> Built by Bristol, for Bristol</div>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#17202b] sm:text-6xl lg:text-7xl">Small stories.<br /><em className="text-[#ec6b4f]">Real impact.</em></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#657180]">A trusted space for Bristol residents to share local news, celebrate community wins, and make the neighbourhood a little more connected.</p>
          <div className="mt-9 flex flex-wrap gap-3"><button onClick={openNew} className="btn-coral">Share your story <ArrowRight size={17} /></button><a href="#stories" className="btn-secondary">Browse the feed</a></div>
          <div className="mt-10 flex items-center gap-4 text-sm text-[#7c8794]"><div className="flex -space-x-2"><span className="avatar bg-[#d8b08e]">AM</span><span className="avatar bg-[#91b8b2]">RS</span><span className="avatar bg-[#c89aa0]">TJ</span><span className="avatar bg-[#e4bd69]">+</span></div><span><strong className="text-[#3f4b59]">240+ neighbours</strong> are already contributing</span></div>
        </div>
        <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] bg-[#253c43] p-7 text-white shadow-[0_24px_60px_-30px_rgba(37,60,67,.6)] sm:min-h-[490px] lg:rotate-2">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ec6b4f]/30 blur-3xl" /><div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#d5e8d8]/20 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between"><div className="flex items-center justify-between"><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[.18em]">This week</span><span className="text-sm text-white/60">01 — 08 Jun</span></div><div><p className="mb-3 text-sm font-semibold text-[#f3b7a8]">Community spotlight</p><h2 className="max-w-md font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">The allotment that brought a whole street together</h2><div className="mt-7 flex items-center gap-3"><span className="avatar bg-[#d8b08e]">JM</span><div><p className="font-bold">Jamie Morgan</p><p className="text-sm text-white/60">Easton · 4 min read</p></div></div></div></div>
        </div>
      </section>

      <section id="stories" className="border-y border-[#e5e8ed] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><div className="eyebrow"><span className="eyebrow-dot bg-[#27745d]" /> The community feed</div><h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight">What&apos;s happening nearby</h2></div><button onClick={openNew} className="btn-dark w-fit"><Plus size={16} /> Share a story</button></div>
          <div className="mt-9 flex flex-col gap-3 lg:flex-row"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#97a1ad]" size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} className="input pl-11" placeholder="Search stories, places or people..." aria-label="Search stories" /></div><select value={category} onChange={(e) => setCategory(e.target.value)} className="input lg:w-48" aria-label="Filter by category"><option>All</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></div>
          {loading ? <div className="py-20 text-center text-[#7c8794]">Loading the community feed...</div> : <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map((story) => <StoryCard key={story._id} story={story} canEdit={user?.role === "admin" || user?.email === story.author.email} onEdit={() => { setEditing(story); setFormOpen(true); }} onDelete={async () => { if (confirm("Delete this story?")) { await fetch(`/api/stories/${story._id}`, { method: "DELETE" }); load(); } }} />)}{filtered.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-[#d8dde3] py-16 text-center text-[#7c8794]">No stories match that search yet.</div>}</div>}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-24"><div><div className="eyebrow"><span className="eyebrow-dot bg-[#27745d]" /> A kinder internet, locally</div><h2 className="mt-4 max-w-md font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-tight">Made for the people who make Bristol what it is.</h2></div><div className="grid gap-4 sm:grid-cols-3">{[["01","Share","Your news, events, ideas and everyday wins."],["02","Connect","Find the people and places that matter to you."],["03","Make change","Turn a good local idea into something real."]].map(([number,title,body]) => <div key={number} className="rounded-2xl border border-[#e5e8ed] bg-white p-6"><span className="text-sm font-bold text-[#ec6b4f]">{number}</span><h3 className="mt-10 font-[family-name:var(--font-display)] text-2xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-[#71808e]">{body}</p></div>)}</div></section>

      <footer className="bg-[#172b32] text-white"><div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:flex-row sm:items-end sm:justify-between lg:px-8"><div><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#ec6b4f]"><Sparkles size={17} /></span><strong className="font-[family-name:var(--font-display)] text-lg">Bristol Common</strong></div><p className="mt-4 max-w-sm text-sm leading-6 text-white/55">A community-powered platform for Bristol&apos;s local stories and shared future.</p></div><div className="text-sm text-white/60 sm:text-right"><p>Designed & built by <strong className="text-white">Rajendra S</strong></p><p className="mt-1"><a className="hover:text-[#f3b7a8]" href="https://github.com/srajendra923" target="_blank" rel="noreferrer">GitHub</a> · <a className="hover:text-[#f3b7a8]" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a></p></div></div></footer>

      {authOpen && <AuthModal mode={authMode} onClose={() => setAuthOpen(false)} onSuccess={() => { setAuthOpen(false); load(); }} setMode={setAuthMode} />}
      {formOpen && <StoryModal story={editing} onClose={() => setFormOpen(false)} onSaved={() => { setFormOpen(false); load(); }} />}
    </main>
  );
}

function StoryCard({ story, canEdit, onEdit, onDelete }: { story: Story; canEdit: boolean; onEdit: () => void; onDelete: () => void }) {
  const colors = { Community: "bg-[#e8f2ec] text-[#27745d]", Events: "bg-[#fff0e9] text-[#c45d43]", "Local News": "bg-[#edf0f8] text-[#5f6fa6]", Opinion: "bg-[#f7efdb] text-[#927334]" };
  return <article className="group flex min-h-[280px] flex-col justify-between rounded-2xl border border-[#e5e8ed] bg-[#fbfcfd] p-6 transition hover:-translate-y-1 hover:border-[#cad2d9] hover:shadow-xl hover:shadow-[#20323b]/5"><div><div className="flex items-center justify-between"><span className={`rounded-full px-3 py-1 text-xs font-bold ${colors[story.category]}`}>{story.category}</span>{story.status === "pending" && <span className="flex items-center gap-1 text-xs font-semibold text-[#a37b30]"><Clock3 size={13} /> Pending</span>}</div><h3 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-semibold leading-tight">{story.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-[#71808e]">{story.excerpt}</p></div><div className="mt-7 flex items-end justify-between border-t border-[#e5e8ed] pt-4"><div className="flex items-center gap-2"><span className="avatar-sm bg-[#c8d9d3]">{story.author.name.slice(0, 2).toUpperCase()}</span><div><p className="text-xs font-bold">{story.author.name}</p><p className="text-[11px] text-[#93a0ac]">{new Date(story.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p></div></div>{canEdit && <div className="flex gap-1"><button onClick={onEdit} className="icon-button" aria-label="Edit story"><FileText size={15} /></button><button onClick={onDelete} className="icon-button text-[#c45d43]" aria-label="Delete story"><Trash2 size={15} /></button></div>}</div></article>;
}

function AuthModal({ mode, setMode, onClose, onSuccess }: { mode: "login" | "register"; setMode: (mode: "login" | "register") => void; onClose: () => void; onSuccess: () => void }) {
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(form: HTMLFormElement) { setBusy(true); setError(""); const data = Object.fromEntries(new FormData(form)); const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); const result = await response.json(); setBusy(false); if (!response.ok) return setError(result.error || "Something went wrong."); onSuccess(); }
  return <div className="modal-backdrop"><div className="modal-card"><button className="absolute right-5 top-5 text-[#8b96a2]" onClick={onClose} aria-label="Close"><X size={20} /></button><div className="eyebrow"><span className="eyebrow-dot" /> Bristol Common</div><h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold">{mode === "login" ? "Welcome back" : "Join your neighbours"}</h2><p className="mt-2 text-sm leading-6 text-[#71808e]">{mode === "login" ? "Sign in to share and manage your stories." : "Create a free account to contribute to the community."}</p><form className="mt-7 space-y-4" onSubmit={(e) => { e.preventDefault(); submit(e.currentTarget); }}>{mode === "register" && <label className="label">Your name<input className="input mt-1" name="name" required minLength={2} /></label>}<label className="label">Email<input className="input mt-1" type="email" name="email" required /></label><label className="label">Password<input className="input mt-1" type="password" name="password" required minLength={8} /></label>{error && <p className="rounded-lg bg-[#fff0ed] p-3 text-sm text-[#c04e3a]">{error}</p>}<button disabled={busy} className="btn-coral w-full justify-center disabled:opacity-60">{busy ? "Please wait..." : mode === "login" ? "Log in" : "Create account"} <ArrowRight size={16} /></button></form><p className="mt-6 text-center text-sm text-[#71808e]">{mode === "login" ? "New to Bristol Common?" : "Already have an account?"} <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="font-bold text-[#ec6b4f]">{mode === "login" ? "Join us" : "Log in"}</button></p></div></div>;
}

function StoryModal({ story, onClose, onSaved }: { story: Story | null; onClose: () => void; onSaved: () => void }) {
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(form: HTMLFormElement) { setBusy(true); const data = Object.fromEntries(new FormData(form)); const response = await fetch(story ? `/api/stories/${story._id}` : "/api/stories", { method: story ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); const result = await response.json(); setBusy(false); if (!response.ok) return setError(result.error || "Could not save story."); onSaved(); }
  return <div className="modal-backdrop"><div className="modal-card max-w-xl"><button className="absolute right-5 top-5 text-[#8b96a2]" onClick={onClose} aria-label="Close"><X size={20} /></button><div className="eyebrow"><span className="eyebrow-dot bg-[#27745d]" /> Your contribution</div><h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold">{story ? "Edit story" : "Share a story"}</h2><form className="mt-7 space-y-4" onSubmit={(e) => { e.preventDefault(); submit(e.currentTarget); }}><label className="label">Title<input className="input mt-1" name="title" defaultValue={story?.title} required minLength={5} maxLength={120} /></label><div className="grid gap-4 sm:grid-cols-2"><label className="label">Category<select className="input mt-1" name="category" defaultValue={story?.category || "Community"}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label className="label">Status<select className="input mt-1" name="status" defaultValue={story?.status || "pending"}><option value="pending">Submit for review</option><option value="draft">Save as draft</option>{story && <option value="published">Published</option>}</select></label></div><label className="label">Short summary<textarea className="input mt-1 min-h-24 resize-y" name="excerpt" defaultValue={story?.excerpt} required minLength={20} maxLength={240} /></label><label className="label">Full story<textarea className="input mt-1 min-h-36 resize-y" name="content" defaultValue={story?.content} required minLength={30} /></label>{error && <p className="rounded-lg bg-[#fff0ed] p-3 text-sm text-[#c04e3a]">{error}</p>}<div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} className="btn-secondary">Cancel</button><button disabled={busy} className="btn-coral disabled:opacity-60">{busy ? "Saving..." : story ? "Save changes" : "Submit story"} <ArrowRight size={16} /></button></div></form></div></div>;
}
