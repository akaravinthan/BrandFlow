"use strict";
/* LocalBiz Connect – shared utilities: storage, theme, toast, modal, nav, charts */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const LS = { get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v) } catch (e) { return d } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true } catch (e) { return false } } };
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = n => { n = Number(n) || 0; return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "K" : String(Math.round(n)) };
const SEED = [
    { id: 1, name: "Summer Sale", business: "Urban Threads", objective: "Product Promotion", platform: ["Instagram", "Facebook"], reach: 12400, engagement: 8.6, clicks: 1284, leads: 248, status: "Active", start: "2026-09-01", end: "2026-10-30", daily: 500, total: 15000, ico: "👗" },
    { id: 2, name: "Weekend Food Festival", business: "Local Bites", objective: "Event Promotion", platform: ["Facebook"], reach: 8200, engagement: 6.4, clicks: 640, leads: 96, status: "Completed", start: "2026-08-15", end: "2026-08-18", daily: 400, total: 1600, ico: "🍔" },
    { id: 3, name: "New Product Launch", business: "Gadget Hub", objective: "Brand Awareness", platform: ["Instagram"], reach: 6800, engagement: 7.1, clicks: 720, leads: 120, status: "Active", start: "2026-09-20", end: "2026-11-05", daily: 600, total: 9000, ico: "📱" },
    { id: 4, name: "Diwali Special Offer", business: "Glow Salon", objective: "Offer Promotion", platform: ["Instagram", "WhatsApp"], reach: 9600, engagement: 9.2, clicks: 980, leads: 210, status: "Scheduled", start: "2026-10-25", end: "2026-11-12", daily: 700, total: 12600, ico: "🪔" },
    { id: 5, name: "Back to School Campaign", business: "Bright Academy", objective: "Lead Generation", platform: ["Instagram", "LinkedIn"], reach: 0, engagement: 0, clicks: 0, leads: 0, status: "Draft", start: "2026-10-15", end: "2026-11-15", daily: 300, total: 9300, ico: "📚" }];
/* ---- campaign imagery (assets/images/<key>.svg) ---- */
function imgFor(c) { const t = [c.category, c.name, c.business, c.objective].join(" ").toLowerCase(), R = [["education", /educat|academy|school|course|admission|tuition|class|learn/], ["beauty", /beauty|salon|glow|spa|makeup/], ["fashion", /fashion|cloth|threads|dress|boutique|wear|sale/], ["food", /food|restaurant|bite|cafe|bakery|biryani|meal/], ["tech", /electronic|gadget|tech|mobile|phone|laptop|launch/], ["fitness", /fitness|gym|yoga|workout/]]; const h = R.find(r => r[1].test(t)); return "assets/images/" + (h ? h[0] : "marketing") + ".svg" }
/* ---- campaigns storage ---- */
function loadCampaigns() { let c = LS.get("lbc_campaigns", null); if (!Array.isArray(c)) { c = SEED.map(x => ({ ...x })); LS.set("lbc_campaigns", c) } return c }
function saveCampaigns(c) { return LS.set("lbc_campaigns", c) }
function deleteCampaign(id, done) { const c = loadCampaigns().find(x => x.id === id); if (!c) return; openModal({ title: "Delete Campaign?", body: `<p>Are you sure you want to delete “${esc(c.name)}”?</p>`, actions: [{ label: "Cancel" }, { label: "Delete", cls: "btn-danger", fn() { saveCampaigns(loadCampaigns().filter(x => x.id !== id)); showToast("Campaign deleted successfully!"); if (done) done() } }] }) }
function viewCampaign(id) { const c = loadCampaigns().find(x => x.id === id); if (!c) return; openModal({ title: c.name, body: `<dl><dt>Business</dt><dd>${esc(c.business)}</dd><dt>Objective</dt><dd>${esc(c.objective)}</dd><dt>Platforms</dt><dd>${esc((c.platform || []).join(", "))}</dd><dt>Duration</dt><dd>${esc(c.start || "—")} to ${esc(c.end || "—")}</dd><dt>Reach</dt><dd>${fmt(c.reach)}</dd><dt>Engagement</dt><dd>${c.engagement}%</dd><dt>Clicks</dt><dd>${fmt(c.clicks)}</dd><dt>Status</dt><dd>${esc(c.status)}</dd></dl>`, actions: [{ label: "Close" }, { label: "Edit", cls: "btn-primary", fn() { location.href = "create-campaign.html?edit=" + c.id } }] }) }
/* ---- theme ---- */
function setTheme(t) { document.documentElement.dataset.theme = t; try { localStorage.setItem("theme", t) } catch (e) { } $$("[data-theme-btn] i").forEach(i => i.className = "fa-solid " + (t === "dark" ? "fa-sun" : "fa-moon")); $$("input[name=theme]").forEach(r => r.checked = r.value === t) }
function toggleTheme() { setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark") }
/* ---- toast & modal ---- */
function showToast(msg, type = "success") { let w = $("#toasts"); if (!w) { w = document.createElement("div"); w.id = "toasts"; w.setAttribute("aria-live", "polite"); document.body.appendChild(w) } const t = document.createElement("div"); t.className = "toast " + type; t.innerHTML = `<i class="fa-solid ${type === "error" ? "fa-circle-xmark" : "fa-circle-check"}"></i> <span>${esc(msg)}</span>`; w.appendChild(t); setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 300) }, 3000) }
let lastFocus = null;
function openModal({ title, body, actions = [] }) { closeModal(); lastFocus = document.activeElement; const bg = document.createElement("div"); bg.className = "modal-bg"; bg.id = "modal"; bg.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><h3>${esc(title)}</h3><div class="modal-body">${body}</div><div class="modal-actions"></div></div>`; const box = $(".modal-actions", bg); actions.forEach(a => { const b = document.createElement("button"); b.className = "btn " + (a.cls || "btn-ghost"); b.textContent = a.label; b.onclick = () => { if (!a.fn || a.fn() !== false) closeModal() }; box.appendChild(b) }); bg.addEventListener("click", e => { if (e.target === bg) closeModal() }); document.body.appendChild(bg); const f = $("input,button", bg); if (f) f.focus() }
function closeModal() { const m = $("#modal"); if (m) { m.remove(); if (lastFocus && lastFocus.focus) lastFocus.focus() } }
/* ---- clipboard ---- */
function copyContent(text, msg) { const ok = () => showToast(msg || "Copied!"); const fb = () => { try { const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); const r = document.execCommand("copy"); t.remove(); r ? ok() : showToast("Copy failed. Please copy manually.", "error") } catch (e) { showToast("Copy failed. Please copy manually.", "error") } }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fb); else fb() }
/* ---- counters & charts ---- */
function animateCounters() { $$("[data-count]").forEach(el => { const to = +el.dataset.count || 0, pad = +el.dataset.pad || 0, t0 = performance.now(); (function f(t) { const p = Math.min(1, (t - t0) / 900); el.textContent = String(Math.round(to * p)).padStart(pad, "0").replace(/\B(?=(\d{3})+(?!\d))/g, ","); if (p < 1) requestAnimationFrame(f) })(t0) }) }
function mkSeries(total, n, seed) { return Array.from({ length: n }, (_, i) => Math.round(total / n * (0.65 + 0.7 * Math.abs(Math.sin(i * 1.3 + seed))))) }
function drawChart(el, labels, series) {
    if (!el) return; const W = 600, H = 260, p = { l: 44, r: 16, t: 16, b: 30 }; const max = Math.max(1, ...series.flatMap(s => s.data)) * 1.15; const x = i => p.l + i * (W - p.l - p.r) / Math.max(1, labels.length - 1), y = v => H - p.b - v / max * (H - p.t - p.b); let g = ""; for (let i = 0; i <= 4; i++) { const yy = y(max * i / 4); g += `<line x1="${p.l}" x2="${W - p.r}" y1="${yy}" y2="${yy}" class="grid"/><text x="${p.l - 6}" y="${yy + 4}" text-anchor="end">${fmt(max * i / 4)}</text>` }
    labels.forEach((l, i) => g += `<text x="${x(i)}" y="${H - 8}" text-anchor="middle">${esc(l)}</text>`);
    series.forEach(s => { const pts = s.data.map((v, i) => x(i) + "," + y(v)); g += `<path d="M${pts.join("L")}L${x(s.data.length - 1)},${H - p.b}L${x(0)},${H - p.b}Z" fill="${s.color}" opacity=".08"/><path pathLength="1" class="line" d="M${pts.join("L")}" stroke="${s.color}"/>` + s.data.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="${s.color}"><title>${s.name} · ${labels[i]}: ${fmt(v)}</title></circle>`).join("") });
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Performance chart">${g}</svg><div class="legend">${series.map(s => `<span><i style="background:${s.color}"></i>${s.name}</span>`).join("")}</div>`
}
/* ---- init ---- */
document.addEventListener("DOMContentLoaded", () => {
    setTheme(document.documentElement.dataset.theme || "light");
    $$("[data-theme-btn]").forEach(b => b.addEventListener("click", toggleTheme));
    const menu = $("#menuBtn"); if (menu) menu.addEventListener("click", () => { const o = document.body.classList.toggle("nav-open"); menu.setAttribute("aria-expanded", o) });
    $$("[data-close-nav]").forEach(o => o.addEventListener("click", () => document.body.classList.remove("nav-open")));
    $$(".sidebar nav a,.nav-links a").forEach(a => a.addEventListener("click", () => document.body.classList.remove("nav-open")));
    document.addEventListener("keydown", e => { if (e.key === "Escape") { closeModal(); document.body.classList.remove("nav-open") } });
    const logout = () => openModal({ title: "Logout?", body: "<p>Are you sure you want to log out? Your data stays saved in this browser.</p>", actions: [{ label: "Cancel" }, { label: "Logout", cls: "btn-primary", fn() { location.href = "index.html" } }] });
    ["logout", "logout2"].forEach(i => { const b = $("#" + i); if (b) b.addEventListener("click", logout) });
    const bell = $("#bell"); if (bell) bell.addEventListener("click", () => { const c = loadCampaigns(); const act = c.filter(x => x.status === "Active").length; openModal({ title: "Notifications", body: `<p>📣 ${act} campaign(s) are running right now.</p><p>🗓️ Check your content calendar for this week.</p><p>💡 Tip: posts with an offer in the first line get more saves.</p>`, actions: [{ label: "Close" }] }); const d = $(".dot", bell); if (d) d.remove() });
    const nav = $("#nav"); if (nav) { const f = () => nav.classList.toggle("scrolled", scrollY > 10); f(); addEventListener("scroll", f, { passive: true }) }
    $$(".cat").forEach(b => b.addEventListener("click", () => { $$(".cat").forEach(x => x.classList.remove("on")); b.classList.add("on"); $("#catMsg").textContent = b.dataset.msg }));
    animateCounters()
});
