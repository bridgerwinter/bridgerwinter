// BW Services and Development: mobile menu and footer year.
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();

// Contact form: sends to Web3Forms in the background and shows the result
// on the page. Without JavaScript the form still posts normally.
(function () {
  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  var status = form.querySelector("[data-form-status]");
  var button = form.querySelector("[data-submit]");
  var buttonLabel = button.textContent;

  function setStatus(state, text) {
    status.setAttribute("data-state", state);
    status.textContent = text;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Built-in validation, with the first problem field focused.
    var invalid = Array.prototype.filter.call(form.elements, function (el) {
      var bad = el.willValidate && !el.checkValidity();
      if (el.willValidate) el.setAttribute("aria-invalid", String(bad));
      return bad;
    });
    if (invalid.length) {
      setStatus("error", "Please fill in your name, a valid email and a short message.");
      invalid[0].focus();
      return;
    }

    if (form.access_key.value.indexOf("YOUR_") === 0) {
      setStatus("error", "This form isn't connected yet. Please check back soon.");
      return;
    }

    button.disabled = true;
    button.textContent = "Sending…";
    setStatus("", "");

    fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form)
    })
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (result) {
        if (result.ok && result.data.success) {
          form.reset();
          setStatus("success", "Thanks! Your message is on its way. I'll reply within one business day.");
        } else {
          setStatus("error", "Something went wrong sending your message. Please try again in a minute.");
        }
      })
      .catch(function () {
        setStatus("error", "Couldn't send. Please check your connection and try again.");
      })
      .then(function () {
        button.disabled = false;
        button.textContent = buttonLabel;
      });
  });
})();
