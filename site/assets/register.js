for (const form of document.querySelectorAll("form[data-anmeldung]")) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-status]");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (status) {
      status.textContent = "Angaben vollständig. Es wurde nichts abgesendet.";
    }
  });
}
