/* CareAdmin Solutions — Forms (Formspree) */
(function () {
  "use strict";

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xanpgjqp";
  const form = document.getElementById("contact-form");
  if (!form) return;

  const success = document.getElementById("form-success");
  const errorBox = document.getElementById("form-error");
  const submitBtn = form.querySelector('button[type="submit"]');
  const defaultBtnLabel = submitBtn ? submitBtn.textContent : "Submit Inquiry";

  function show(el) {
    if (!el) return;
    el.classList.add("visible");
    el.setAttribute("role", "status");
  }

  function hide(el) {
    if (!el) return;
    el.classList.remove("visible");
    el.removeAttribute("role");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    hide(success);
    hide(errorBox);

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    const emailField = form.querySelector("#email");
    let replyField = form.querySelector('input[name="_replyto"]');
    if (!replyField) {
      replyField = document.createElement("input");
      replyField.type = "hidden";
      replyField.name = "_replyto";
      form.appendChild(replyField);
    }
    if (emailField) replyField.value = emailField.value;

    fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Formspree error");
        show(success);
        form.reset();
      })
      .catch(function () {
        show(errorBox);
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultBtnLabel;
        }
      });
  });
})();
