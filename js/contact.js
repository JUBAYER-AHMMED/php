document.addEventListener("DOMContentLoaded", () => {
  const f = document.getElementById("contactForm"),
    n = document.getElementById("formNotice"),
    b = document.getElementById("submitBtn");

  // show server messages
  const q = new URLSearchParams(location.search);
  if (q.get("success") === "1") {
    n.textContent = "Message sent!";
    n.classList.add("success");
    history.replaceState({}, "", location.pathname);
    f?.reset();
  } else if (q.get("error")) {
    n.textContent = "Error: " + q.get("error");
    n.classList.add("error");
    history.replaceState({}, "", location.pathname);
  }

  const show = (id) => document.getElementById(id)?.classList.add("invalid");
  const clear = (id) =>
    document.getElementById(id)?.classList.remove("invalid");

  ["full_name", "agree"].forEach((id) => {
    let el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(el.type === "checkbox" ? "change" : "input", () =>
      clear(id)
    );
  });

  f.addEventListener("submit", (ev) => {
    n.textContent = "";
    n.classList.remove("error", "success");
    let ok = true;
    if (!document.getElementById("full_name").value.trim()) {
      show("full_name");
      ok = false;
    }
    if (!document.getElementById("agree").checked) {
      show("agree");
      ok = false;
    }
    if (!ok) {
      ev.preventDefault();
      n.textContent = "Please fix the fields.";
      n.classList.add("error");
      return;
    }
    b.disabled = true;
  });
});