(function () {
    let f = "All", q = "", s = "new"; const list = $("#list");
    function filterCampaigns() {
        const all = loadCampaigns(); let cs = all.filter(c => (f === "All" || c.status === f) && [c.name, c.business, c.objective, (c.platform || []).join(" ")].join(" ").toLowerCase().includes(q));
        cs.sort((a, b) => s === "reach" ? b.reach - a.reach : s === "eng" ? b.engagement - a.engagement : s === "name" ? a.name.localeCompare(b.name) : b.id - a.id); return { all, cs }
    }
    function render() {
        const { all, cs } = filterCampaigns();
        if (!cs.length) { list.innerHTML = all.length ? `<div class="empty card"><i class="fa-solid fa-magnifying-glass"></i><p>No campaigns match your filters.</p></div>` : `<div class="empty card"><i class="fa-solid fa-bullhorn"></i><h3>No campaigns yet.</h3><p>Create your first marketing campaign<br>and start growing your business.</p><a class="btn btn-primary" href="create-campaign.html">+ Create Campaign</a></div>`; return }
        list.innerHTML = cs.map(c => `<article class="card ccard"><div class="c-img"><img src="${imgFor(c)}" alt="${esc(c.name)} campaign visual" loading="lazy"></div><div class="c-b"><span class="badge ${c.status.toLowerCase()}">${c.status}</span><h3>${esc(c.name)}</h3><p class="meta">${esc(c.business)} · ${esc((c.platform || []).join(", "))}</p><p class="meta">${esc(c.objective)}</p><p class="meta"><i class="fa-regular fa-calendar"></i> ${esc(c.start || "—")} → ${esc(c.end || "—")}</p><div class="kv"><div><small>Reach</small><b>${fmt(c.reach)}</b></div><div><small>Engagement</small><b>${c.engagement}%</b></div></div><div class="c-foot"><button class="btn btn-ghost btn-sm" data-a="v" data-id="${c.id}">View</button><button class="btn btn-ghost btn-sm" data-a="e" data-id="${c.id}">Edit</button><button class="btn btn-ghost btn-sm" data-a="d" data-id="${c.id}">Delete</button><select data-st="${c.id}" aria-label="Status for ${esc(c.name)}">${["Active", "Scheduled", "Completed", "Draft"].map(x => `<option ${x === c.status ? "selected" : ""}>${x}</option>`).join("")}</select></div></div></article>`).join("")
    }
    list.addEventListener("click", e => { const b = e.target.closest("button[data-a]"); if (!b) return; const id = +b.dataset.id; if (b.dataset.a === "v") viewCampaign(id); else if (b.dataset.a === "e") location.href = "create-campaign.html?edit=" + id; else deleteCampaign(id, render) });
    list.addEventListener("change", e => { const id = +e.target.dataset.st; if (!id) return; const all = loadCampaigns(), c = all.find(x => x.id === id); if (c) { c.status = e.target.value; saveCampaigns(all); showToast("Campaign updated successfully!"); render() } });
    $$("[data-f]").forEach(b => b.addEventListener("click", () => { $$("[data-f]").forEach(x => x.classList.toggle("active", x === b)); f = b.dataset.f; render() }));
    $("#q").addEventListener("input", e => { q = e.target.value.trim().toLowerCase(); render() }); $("#sort").addEventListener("change", e => { s = e.target.value; render() }); render()
})();
