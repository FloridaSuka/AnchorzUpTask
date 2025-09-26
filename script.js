const selected = document.querySelector(".select-selected");
const items = document.querySelector(".select-items");
const form = document.querySelector("form");
const aside = document.querySelector(".aside-content");

selected.addEventListener("click", () => items.classList.toggle("select-hide"));
items.querySelectorAll("div").forEach((option) => {
  option.addEventListener("click", () => {
    selected.textContent = option.textContent;
    selected.setAttribute("data-value", option.getAttribute("data-value"));
    items.classList.add("select-hide");
  });
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".custom-select")) items.classList.add("select-hide");
});

function renderLink(link) {
  const linkItem = document.createElement("div");
  linkItem.classList.add("short-link-item");
  linkItem.style.marginBottom = "20px";

  const expiresAt = link.expires_at ? new Date(link.expires_at) : null;
  let expirationText = "No expiration";

  if (expiresAt) {
    const now = new Date();
    const diff = Math.max(0, Math.floor((expiresAt - now) / 1000));
    if (diff <= 0) return;
    let minutes = Math.floor(diff / 60);
    let seconds = diff % 60;
    expirationText = `Expires in ${minutes}m ${seconds}s`;
  }

  linkItem.innerHTML = `
    <div class="link-row" style="display:flex; justify-content:space-between; align-items:center;">
      <a href="redirect.php?c=${link.short_code}" target="_blank" style="flex:1; color:#33A8E5; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-left:-5px">
        https://short.link/${link.short_code}
      </a>
      <button class="delete-btn" data-id="${link.id}" style="font-weight:bold; background:none; border:none; cursor:pointer; color:#686868; font-size:15px; margin-right:-50px">
        <i class="fa-regular fa-trash-can"></i>
      </button>
    </div>
    <p style="font-size:14px; margin-left:-5px; color:#9bb7f4;">This link has been clicked ${link.clicks} times.</p>
    <p class="expiration-text" style="font-size:12px; margin-left:-5px; color:#888;">${expirationText}</p>
    <div class="qrcode"></div>
  `;

  const qrContainer = linkItem.querySelector(".qrcode");
  if (qrContainer && link.original) {
    const urlForQR = link.original.startsWith("http")
      ? link.original
      : "https://" + link.original;
    new QRCode(qrContainer, {
      text: urlForQR,
      width: 100,
      height: 100,
    });
  }

  const deleteBtn = linkItem.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    const id = deleteBtn.getAttribute("data-id");

    const now = new Date();
    const expiredTime = now.toISOString().slice(0, 19).replace("T", " ");

    fetch("expire_link.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `id=${id}&expires_at=${expiredTime}`,
    })
      .then((res) => res.text())
      .then((msg) => {
        if (msg === "updated") linkItem.remove();
      })
      .catch((err) => console.error("Error expiring link:", err));
  });

  aside.appendChild(linkItem);
}
function loadLinks() {
  fetch("get_links.php")
    .then(async (res) => {
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error("Invalid JSON from server:", text);
        return [];
      }
    })
    .then((links) => {
      aside.innerHTML = "<h2>My shortened URLs</h2>";
      links.forEach((link) => renderLink(link));
    })
    .catch((err) => console.error("Error loading links:", err));
}

loadLinks();

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const urlInput = form.url.value.trim();
  if (!urlInput) {
    alert("Please enter a URL");
    return;
  }

  const expirationValue = selected.getAttribute("data-value") || 0;
  const formData = new URLSearchParams();
  formData.append("url", urlInput);
  formData.append("expiration", expirationValue);

  try {
    const res = await fetch("shorten.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Invalid JSON from server:", text);
      alert("Server error: check console");
      return;
    }

    if (!data.error) {
      renderLink(data);
    } else {
      console.error("Server error:", data.error);
      alert(data.error);
    }
  } catch (err) {
    console.error("Network or fetch error:", err);
    alert("Network error: check console");
  }

  form.reset();
  selected.textContent = "Add Expiration Date";
  selected.removeAttribute("data-value");
});
