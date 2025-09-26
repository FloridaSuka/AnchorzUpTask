const selected = document.querySelector(".select-selected");
const items = document.querySelector(".select-items");

// dropdown behavior
selected.addEventListener("click", () => {
  items.classList.toggle("select-hide");
});

items.querySelectorAll("div").forEach((option) => {
  option.addEventListener("click", () => {
    selected.textContent = option.textContent;
    selected.setAttribute("data-value", option.getAttribute("data-value")); // ruaj vlerën
    items.classList.add("select-hide");
  });
});

// close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".custom-select")) {
    items.classList.add("select-hide");
  }
});

const form = document.querySelector("form");
const aside = document.querySelector(".aside-content");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const urlInput = form.url.value.trim();
  if (!urlInput) return;

  const shortCode = Math.random().toString(36).substring(2, 8);
  const shortUrl = `https://short.link/${shortCode}`;

  const expirationMap = {
    1: 1,
    2: 5,
    3: 30,
    4: 60,
    5: 300,
  };

  // Merr vlerën nga custom select
  const expirationValue = selected.getAttribute("data-value");
  let expirationMinutes = expirationMap[expirationValue] || 0;

  const linkItem = document.createElement("div");
  linkItem.classList.add("short-link-item");
  linkItem.style.marginBottom = "20px";

  let clickCount = 0;

  linkItem.innerHTML = `
    <div class="link-row" style="display:flex; justify-content:space-between; align-items:center;">
      <a href="${urlInput}" target="_blank" style="flex:1; color:#33A8E5; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-left:-5px">
        ${shortUrl}
      </a>
      <button class="delete-btn" style="font-weight:bold ;background:none; border:none; cursor:pointer; color:#686868; font-size:15px; margin-right:-50px">
        <i class="fa-regular fa-trash-can"></i>
      </button>
    </div>
    <p style="font-size:14px; margin-left:-5px; color:#9bb7f4;">This link has been clicked 0 times.</p>
    <p class="expiration-text" style="font-size:12px; margin-left:-5px; color:#888;"></p>
    <div class="qrcode"></div>
  `;

  const anchor = linkItem.querySelector("a");
  const clickText = linkItem.querySelector("p");
  anchor.addEventListener("click", function () {
    clickCount++;
    clickText.textContent = `This link has been clicked ${clickCount} times.`;
  });

  const qrContainer = linkItem.querySelector(".qrcode");
  new QRCode(qrContainer, {
    text: urlInput,
    width: 50,
    height: 50,
  });

  const expirationTextElement = linkItem.querySelector(".expiration-text");
  let interval;
  if (expirationMinutes > 0) {
    let remainingSeconds = expirationMinutes * 60;

    interval = setInterval(() => {
      let minutes = Math.floor(remainingSeconds / 60);
      let seconds = remainingSeconds % 60;
      expirationTextElement.textContent = `Expires in ${minutes}m ${seconds}s`;
      remainingSeconds--;

      if (remainingSeconds < 0) {
        clearInterval(interval);
        linkItem.remove();
      }
    }, 1000);
  } else {
    expirationTextElement.textContent = `No expiration`;
  }

  const deleteBtn = linkItem.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    clearInterval(interval);
    linkItem.remove();
  });

  aside.appendChild(linkItem);
  form.reset();

  // Rivendos placeholder te custom select
  selected.textContent = "Add Expiration Date";
  selected.removeAttribute("data-value");
});
