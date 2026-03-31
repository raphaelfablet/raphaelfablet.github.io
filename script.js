const introVideo1 = document.getElementById("introVideo1");
const introVideo2 = document.getElementById("introVideo2");
const shutterTop = document.getElementById("shutterTop");
const shutterBottom = document.getElementById("shutterBottom");
const globalSoundBtn = document.getElementById("globalSoundBtn");
const soundIcon = document.getElementById("soundIcon");
const soundLabel = document.getElementById("soundLabel");
const contactModal = document.getElementById("contactModal");
const contactOpenBtn = document.getElementById("contactOpenBtn");
const contactCloseBtn = document.getElementById("contactCloseBtn");

const projectCards = Array.from(document.querySelectorAll(".project-card"));

let currentIntro = 1;
let activeProjectId = null;
let globalSoundOn = false;
let hasUserInteracted = false;

function markInteraction() {
  hasUserInteracted = true;
  window.removeEventListener("pointerdown", markInteraction);
  window.removeEventListener("touchstart", markInteraction);
  window.removeEventListener("keydown", markInteraction);
  window.removeEventListener("scroll", markInteraction);
}

window.addEventListener("pointerdown", markInteraction, { passive: true });
window.addEventListener("touchstart", markInteraction, { passive: true });
window.addEventListener("keydown", markInteraction);
window.addEventListener("scroll", markInteraction, { passive: true });

function safePlay(video) {
  if (!video) return;
  const playPromise = video.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {});
  }
}

function updateSoundButton() {
  soundIcon.textContent = globalSoundOn ? "🔊" : "🔇";
  soundLabel.textContent = globalSoundOn ? "Sound on" : "Sound off";
}

function syncIntroAudio() {
  const introShouldSound = globalSoundOn && hasUserInteracted && !activeProjectId;
  introVideo1.muted = !introShouldSound;
  introVideo2.muted = !introShouldSound;
}

function pauseIntro() {
  introVideo1.pause();
  introVideo2.pause();
  introVideo1.muted = true;
  introVideo2.muted = true;
}

function resumeIntro() {
  syncIntroAudio();
  const activeVideo = currentIntro === 1 ? introVideo1 : introVideo2;
  const inactiveVideo = currentIntro === 1 ? introVideo2 : introVideo1;
  inactiveVideo.pause();
  safePlay(activeVideo);
}

function activateProject(card) {
  const id = card.dataset.project;
  activeProjectId = id;
  pauseIntro();

  projectCards.forEach((item) => {
    const video = item.querySelector(".project-video");
    const active = item === card;

    item.classList.toggle("is-active", active);

    if (video) {
      video.muted = !(globalSoundOn && hasUserInteracted && active);
      if (active) {
        safePlay(video);
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  });
}

function deactivateProject(card) {
  const id = card.dataset.project;
  if (activeProjectId === id) {
    activeProjectId = null;
  }

  const video = card.querySelector(".project-video");
  card.classList.remove("is-active");
  card.classList.remove("is-touched");

  if (video) {
    video.pause();
    video.currentTime = 0;
    video.muted = true;
  }

  resumeIntro();
}

function initProjects() {
  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", () => activateProject(card));
    card.addEventListener("focusin", () => activateProject(card));
    card.addEventListener("mouseleave", () => deactivateProject(card));
    card.addEventListener("focusout", () => deactivateProject(card));

    card.addEventListener("click", () => {
      const touched = card.classList.toggle("is-touched");
      if (touched) {
        activateProject(card);
      } else {
        deactivateProject(card);
      }
    });
  });
}

function initRevealObserver() {
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    { threshold: 0.22 }
  );

  reveals.forEach((item) => observer.observe(item));
}

function initIntro() {
  introVideo1.classList.add("active");
  introVideo1.muted = true;
  introVideo2.muted = true;

  setTimeout(() => {
    shutterTop.classList.add("shutter-open");
    shutterBottom.classList.add("shutter-open");
    safePlay(introVideo1);
  }, 250);

  introVideo1.addEventListener("ended", () => {
    currentIntro = 2;
    introVideo1.classList.remove("active");
    introVideo2.classList.add("active");
    syncIntroAudio();
    introVideo2.currentTime = 0;
    safePlay(introVideo2);
  });

  introVideo2.addEventListener("ended", () => {
    currentIntro = 1;
    introVideo2.classList.remove("active");
    introVideo1.classList.add("active");
    syncIntroAudio();
    introVideo1.currentTime = 0;
    safePlay(introVideo1);
  });
}

globalSoundBtn.addEventListener("click", () => {
  hasUserInteracted = true;
  globalSoundOn = !globalSoundOn;
  updateSoundButton();

  if (activeProjectId) {
    const activeCard = document.querySelector(`[data-project="${activeProjectId}"]`);
    if (activeCard) activateProject(activeCard);
  } else {
    resumeIntro();
  }
});

contactOpenBtn.addEventListener("click", () => {
  contactModal.classList.add("is-open");
  contactModal.setAttribute("aria-hidden", "false");
});

contactCloseBtn.addEventListener("click", () => {
  contactModal.classList.remove("is-open");
  contactModal.setAttribute("aria-hidden", "true");
});

contactModal.addEventListener("click", (event) => {
  if (event.target === contactModal) {
    contactModal.classList.remove("is-open");
    contactModal.setAttribute("aria-hidden", "true");
  }
});

updateSoundButton();
initIntro();
initProjects();
initRevealObserver();
