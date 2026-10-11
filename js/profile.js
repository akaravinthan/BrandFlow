(function () {
    const ids = ["name", "cat", "phone", "email", "web", "addr", "ig", "fb", "wa", "desc"]; let logo = "";
    function show() { $("#logoPv").innerHTML = logo ? `<img src="${logo}" alt="Business logo preview">` : '<i class="fa-solid fa-store"></i>' }
    const p = LS.get("lbc_profile", {}); ids.forEach(i => { if (p[i]) $("#" + i).value = p[i] }); logo = p.logo || ""; show();
    $("#logo").addEventListener("change", e => { const f = e.target.files[0]; if (!f) return; if (!f.type.startsWith("image/") || f.size > 1e6) { showToast("Please choose an image under 1 MB.", "error"); e.target.value = ""; return } const r = new FileReader(); r.onload = () => { logo = r.result; show() }; r.onerror = () => showToast("Could not read the image.", "error"); r.readAsDataURL(f) });
    $("#pf").addEventListener("submit", e => {
        e.preventDefault(); $$(".invalid").forEach(x => x.classList.remove("invalid")); const v = i => $("#" + i).value.trim(); let m = "", f = "";
        if (!v("name")) { f = "name"; m = "Please enter your business name." } else if (!v("cat")) { f = "cat"; m = "Please select a business category." } else if (v("phone") && !/^\+?[\d\s-]{7,15}$/.test(v("phone"))) { f = "phone"; m = "Please enter a valid phone number." } else if (v("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) { f = "email"; m = "Please enter a valid email address." } else if (v("web") && !/^https?:\/\/.+\..+/.test(v("web"))) { f = "web"; m = "Website must start with http:// or https://." }
        $("#err").textContent = m; if (m) { $("#" + f).classList.add("invalid"); $("#" + f).focus(); return }
        const d = { logo }; ids.forEach(i => d[i] = v(i)); if (LS.set("lbc_profile", d)) showToast("Profile updated!"); else showToast("Could not save. Try a smaller logo.", "error")
    })
})();
