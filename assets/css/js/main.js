(() => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement && window.matchMedia("(max-width: 680px)").matches) {
        menuToggle.setAttribute("aria-expanded", "false");
        navigation.classList.remove("is-open");
      }
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  const counterItems = document.querySelectorAll("[data-counter]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.counter);
    if (!Number.isFinite(target)) return;
    if (reduceMotion) {
      counter.textContent = String(target);
      return;
    }

    const duration = 1100;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      counter.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    counterItems.forEach(animateCounter);
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealItems.forEach((item) => revealObserver.observe(item));

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  counterItems.forEach((item) => counterObserver.observe(item));
})();
