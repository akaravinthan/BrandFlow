(function () {
    const editId = Number(new URLSearchParams(location.search).get("edit")) || null, S = { ages: [], interests: [], platforms: [] }; let step = 1;
    const V = id => $("#" + id).value.trim(), map = { bName: "business", bCat: "category", bLoc: "location", bPhone: "phone", bWeb: "website", bIg: "instagram", cName: "name", cObj: "objective", cStart: "start", cEnd: "end", cDesc: "description", gender: "gender", aloc: "audienceLocation" };
    const days = () => { const d = Math.round((new Date(V("cEnd")) - new Date(V("cStart"))) / 864e5); return d > 0 ? d + 1 : 1 };
    function estimate() { const t = Math.max(0, Number($("#total").value) || 0), n = Math.max(1, S.platforms.length), reach = Math.round(t * 38 * (1 + .25 * (n - 1))), clicks = Math.round(reach * .045); return { reach, clicks, leads: Math.round(clicks * .12) } }
    function syncBudget(from) { const d = days(); if (from === "daily") $("#total").value = Number($("#daily").value) * d; else { const t = Number($("#total").value); if (t > 0) $("#daily").value = Math.min(10000, Math.max(100, Math.round(t / d / 50) * 50)) } $("#dailyV").textContent = $("#daily").value; const e = estimate(); $("#eReach").textContent = fmt(e.reach); $("#eClicks").textContent = fmt(e.clicks); $("#eLeads").textContent = fmt(e.leads) }
    function bad(id, m) { const e = $("#" + id); if (e) e.classList.add("invalid"); return m }
    function validate(n) {
        $$(".invalid").forEach(e => e.classList.remove("invalid")); let m = "";
        if (n === 1) { if (!V("bName")) m = bad("bName", "Please enter your business name."); else if (!V("bCat")) m = bad("bCat", "Please select a business category."); else if (!V("bLoc")) m = bad("bLoc", "Please enter your business location."); else if (!/^\+?[\d\s-]{7,15}$/.test(V("bPhone"))) m = bad("bPhone", "Please enter a valid phone number."); else if (V("bWeb") && !/^https?:\/\/.+\..+/.test(V("bWeb"))) m = bad("bWeb", "Website must start with http:// or https://."); else if (V("bIg") && !/^@?[\w.]{1,30}$/.test(V("bIg"))) m = bad("bIg", "Please enter a valid Instagram username.") }
        if (n === 2) { if (!V("cName")) m = bad("cName", "Please enter a campaign name."); else if (!V("cObj")) m = bad("cObj", "Please select a campaign objective."); else if (!V("cStart")) m = bad("cStart", "Please choose a start date."); else if (!V("cEnd")) m = bad("cEnd", "Please choose an end date."); else if (new Date(V("cEnd")) <= new Date(V("cStart"))) m = bad("cEnd", "End date must be after start date.") }
        if (n === 3) { if (!S.ages.length) m = "Please select at least one age group."; else if (!S.interests.length) m = "Please select at least one interest." }
        if (n === 4 && !S.platforms.length) m = "Please select at least one platform.";
        if (n === 5) { const d = Number($("#daily").value), t = Number($("#total").value); if (!(d > 0) || !(t > 0)) m = bad("total", "Please enter a valid budget."); else if (t < d) m = bad("total", "Total budget cannot be less than the daily budget.") }
        $("#stepErr").textContent = m; return !m
    }
    function goTo(n) { step = n; $$(".step-p").forEach(p => p.hidden = +p.dataset.p !== n); $$("#stepper li").forEach(li => { const s = +li.dataset.s; li.classList.toggle("on", s === n); li.classList.toggle("done", s < n) }); $("#back").style.visibility = n === 1 ? "hidden" : "visible"; $("#next").hidden = n === 6; $("#finalBtns").hidden = n !== 6; if (n === 5) syncBudget("daily"), editId && 0; if (n === 6) preview(); scrollTo({ top: 0, behavior: "smooth" }) }
    function preview() { const e = estimate(), rows = [["Campaign Name", V("cName")], ["Business", V("bName")], ["Objective", V("cObj")], ["Audience", `${S.ages.join(", ")} · ${V("gender") || "All"} · ${V("aloc") || "Local"} · ${S.interests.join(", ")}`], ["Platforms", S.platforms.join(", ")], ["Budget", `₹${Number($("#daily").value).toLocaleString("en-IN")}/day · ₹${Number($("#total").value).toLocaleString("en-IN")} total`], ["Duration", `${V("cStart")} to ${V("cEnd")} (${days()} days)`], ["Estimated Reach", fmt(e.reach)]]; $("#pv").innerHTML = rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join("") }
    function saveCampaign(status) {
        const checks = status === "Draft" ? [1, 2] : [1, 2, 3, 4, 5]; for (const i of checks) { if (!validate(i)) { goTo(i); validate(i); return } }
        const list = loadCampaigns(), old = list.find(c => c.id === editId), e = estimate(), live = status !== "Draft", st = !live ? "Draft" : new Date(V("cStart")) > new Date() ? "Scheduled" : "Active";
        const reach = old && old.reach ? old.reach : st === "Active" ? Math.round(e.reach * .2) : 0;
        const c = { ...(old || {}), id: old ? old.id : Math.max(0, ...list.map(x => x.id)) + 1, platform: [...S.platforms], ages: [...S.ages], interests: [...S.interests], daily: Number($("#daily").value), total: Number($("#total").value), status: st, reach, engagement: old && old.engagement ? old.engagement : reach ? +(5 + Math.random() * 5).toFixed(1) : 0, clicks: old && old.clicks ? old.clicks : Math.round(reach * .045), leads: old && old.leads ? old.leads : Math.round(reach * .0054), ico: (old && old.ico) || "📣" };
        Object.entries(map).forEach(([k, p]) => c[p] = V(k));
        if (old) list[list.indexOf(old)] = c; else list.push(c);
        if (!saveCampaigns(list)) { showToast("Could not save. Browser storage is unavailable.", "error"); return }
        showToast(!live ? "Draft saved successfully!" : old ? "Campaign updated successfully!" : "Campaign launched!"); if (live && !old) setTimeout(() => showToast("Campaign created successfully!"), 600); setTimeout(() => location.href = "campaigns.html", 1400)
    }
    /* prefill */
    if (editId) { const c = loadCampaigns().find(x => x.id === editId); if (c) { Object.entries(map).forEach(([k, p]) => { if (c[p] != null) $("#" + k).value = c[p] }); S.ages = [...(c.ages || [])]; S.interests = [...(c.interests || [])]; S.platforms = [...(c.platform || [])]; $("#daily").value = c.daily || 500; $("#total").value = c.total || ""; $("#pageTitle").textContent = "Edit Campaign" } }
    else { const p = LS.get("lbc_profile", {}); $("#bName").value = p.name || ""; $("#bCat").value = p.cat || ""; $("#bLoc").value = p.addr || ""; $("#bPhone").value = p.phone || ""; $("#bWeb").value = p.web || ""; $("#bIg").value = p.ig || ""; $("#total").value = 500 }
    $$(".chips").forEach(c => { const g = c.dataset.g; $$(".chip", c).forEach(b => { b.classList.toggle("on", S[g].includes(b.dataset.v)); b.addEventListener("click", () => { const i = S[g].indexOf(b.dataset.v); i < 0 ? S[g].push(b.dataset.v) : S[g].splice(i, 1); b.classList.toggle("on", i < 0) }) }) });
    $$(".plat").forEach(b => { const on = S.platforms.includes(b.dataset.v); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); b.addEventListener("click", () => { const i = S.platforms.indexOf(b.dataset.v); i < 0 ? S.platforms.push(b.dataset.v) : S.platforms.splice(i, 1); b.classList.toggle("on", i < 0); b.setAttribute("aria-pressed", i < 0); syncBudget() }) });
    $("#daily").addEventListener("input", () => syncBudget("daily")); $("#total").addEventListener("input", () => syncBudget("total"));
    $("#next").addEventListener("click", () => { if (validate(step)) goTo(step + 1) }); $("#back").addEventListener("click", () => { $("#stepErr").textContent = ""; goTo(step - 1) });
    $("#editBtn").addEventListener("click", () => goTo(1)); $("#draft").addEventListener("click", () => saveCampaign("Draft")); $("#launch").addEventListener("click", () => saveCampaign("Launch"));
    $$("#stepper li").forEach(li => li.addEventListener("click", () => { if (+li.dataset.s < step) goTo(+li.dataset.s) }));
    syncBudget(editId ? "total" : "total"); goTo(1)
})();
