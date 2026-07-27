// Highlights the current page in the nav pill.
document.addEventListener("DOMContentLoaded", () => {
  let current = window.location.pathname.split("/").pop() || "index";
  if (current.endsWith(".html")) {
    current = current.slice(0, -5);
  }
  document.querySelectorAll(".nav-links a").forEach((link) => {
    let href = link.getAttribute("href");
    if (href) {
      if (href.endsWith(".html")) {
        href = href.slice(0, -5);
      }
      if (href === current || (current === "" && href === "index")) {
        link.setAttribute("aria-current", "page");
      }
    }
  });
});
