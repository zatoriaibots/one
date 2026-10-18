const root = document.body;
const buttons = document.querySelectorAll("[data-billing]");

function setBilling(mode) {
  const yearly = mode === "yearly";
  root.classList.toggle("is-yearly", yearly);
  for (const button of buttons) {
    button.setAttribute("aria-pressed", String(button.dataset.billing === mode));
  }
}

for (const button of buttons) {
  button.addEventListener("click", () => setBilling(button.dataset.billing));
}

setBilling("monthly");
