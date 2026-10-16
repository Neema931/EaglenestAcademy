(() => {
  const footerMount = document.querySelector("[data-site-footer]");
  if (!footerMount) return;

  footerMount.innerHTML = `
    <footer class="site-footer">
      <div class="page-width footer-main">
        <a class="brand brand-footer" href="index.html" aria-label="Eagle Nest Academy home">
          <span class="brand-mark" aria-hidden="true">E</span>
          <span class="brand-name">Eagle Nest <span>Academy</span></span>
        </a>
        <p>Learn with purpose.<br>Grow with confidence.</p>
        <nav class="footer-links" aria-label="Footer navigation">
          <a href="about.html">About</a>
          <a href="academics.html">Academics</a>
          <a href="admissions.html">Admissions</a>
          <a href="student-life.html">Student Life</a>
          <a href="contact.html">Contact</a>
        </nav>
        <a class="footer-visit" href="contact.html#visit">Plan your visit <span aria-hidden="true">↗</span></a>
      </div>
      <div class="page-width footer-bottom">
        <span>© <span data-current-year>${new Date().getFullYear()}</span> Eagle Nest Academy</span>
        <span>Curious minds. Kind hearts. Bright futures.</span>
      </div>
    </footer>`;
})();
