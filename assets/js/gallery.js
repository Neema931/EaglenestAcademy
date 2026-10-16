(() => {
  const gallery = document.querySelector("#photo-gallery");
  const lightbox = document.querySelector("#gallery-lightbox");
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

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  if (!gallery || !lightbox) return;

  const photoCards = Array.from(gallery.querySelectorAll(".photo-card"));
  const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
  const emptyMessage = document.querySelector(".gallery-empty");
  const lightboxImage = lightbox.querySelector(".lightbox-image");
  const lightboxCategory = lightbox.querySelector(".lightbox-category");
  const lightboxTitle = lightbox.querySelector(".lightbox-title");
  const lightboxCount = lightbox.querySelector(".lightbox-count");
  const closeButton = lightbox.querySelector(".lightbox-close");
  let visiblePhotos = photoCards;
  let currentIndex = 0;
  let returnFocusTo = null;

  const getPhotoDetails = (card) => ({
    image: card.querySelector("img"),
    category: card.querySelector(".photo-caption span")?.textContent ?? "",
    title: card.querySelector(".photo-caption strong")?.textContent ?? ""
  });

  const showPhoto = (index) => {
    currentIndex = (index + visiblePhotos.length) % visiblePhotos.length;
    const details = getPhotoDetails(visiblePhotos[currentIndex]);
    lightboxImage.src = details.image.src;
    lightboxImage.alt = details.image.alt;
    lightboxCategory.textContent = details.category;
    lightboxTitle.textContent = details.title;
    lightboxCount.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(visiblePhotos.length).padStart(2, "0")}`;
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    lightboxImage.removeAttribute("src");
    if (returnFocusTo instanceof HTMLElement) returnFocusTo.focus();
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      visiblePhotos = photoCards.filter((card) => filter === "all" || card.dataset.category === filter);
      photoCards.forEach((card) => {
        card.hidden = !visiblePhotos.includes(card);
      });
      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("is-active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });
      if (emptyMessage) emptyMessage.hidden = visiblePhotos.length > 0;
    });
  });

  photoCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (visiblePhotos.length === 0) return;
      returnFocusTo = card;
      showPhoto(visiblePhotos.indexOf(card));
      lightbox.hidden = false;
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
      closeButton.focus();
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showPhoto(currentIndex - 1));
  lightbox.querySelector(".lightbox-next").addEventListener("click", () => showPhoto(currentIndex + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showPhoto(currentIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPhoto(currentIndex - 1);
    } else if (event.key === "Tab") {
      const focusable = Array.from(lightbox.querySelectorAll("button:not(:disabled)"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  const achievementTrack = document.querySelector(".achievement-track");
  const achievements = Array.from(document.querySelectorAll(".achievement-card"));
  const currentAchievement = document.querySelector(".carousel-current");
  let achievementIndex = 0;

  const showAchievement = (index) => {
    achievementIndex = (index + achievements.length) % achievements.length;
    achievementTrack.style.transform = `translateX(-${achievementIndex * 100}%)`;
    achievements.forEach((card, cardIndex) => {
      const isCurrent = cardIndex === achievementIndex;
      card.classList.toggle("is-current", isCurrent);
      card.setAttribute("aria-hidden", String(!isCurrent));
    });
    currentAchievement.textContent = String(achievementIndex + 1).padStart(2, "0");
  };

  document.querySelectorAll("[data-carousel]").forEach((button) => {
    button.addEventListener("click", () => {
      showAchievement(achievementIndex + (button.dataset.carousel === "next" ? 1 : -1));
    });
  });
})();
