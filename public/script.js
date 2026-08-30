const audio = document.getElementById("loveSong");
const musicButton = document.getElementById("musicButton");
const musicLabel = document.getElementById("musicLabel");

const gameScreen = document.getElementById("gameScreen");
const loadingScreen = document.getElementById("loadingScreen");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const choiceZone = document.getElementById("choiceZone");

const progressFill = document.getElementById("progressFill");
const loadingPercent = document.getElementById("loadingPercent");
const loadingMessage = document.getElementById("loadingMessage");

const heartLayer = document.getElementById("heartLayer");
const cursorGlow = document.querySelector(".cursor-glow");

let musicPlaying = false;
let noEscapes = 0;
let lastHeart = 0;
let unlocked = false;

musicButton.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
      setMusicState(true);
    } catch {
      alert("Browser audio permission ko block kar raha hai. Ek baar button dobara click karo. ♡");
    }
  } else {
    audio.pause();
    setMusicState(false);
  }
});

audio.addEventListener("play", () => setMusicState(true));
audio.addEventListener("pause", () => setMusicState(false));
audio.addEventListener("ended", () => setMusicState(false));

function setMusicState(value) {
  musicPlaying = value;
  musicButton.classList.toggle("playing", value);
  musicLabel.textContent = value ? "Playing" : "Our song";
}

/* The No button runs away as soon as the pointer enters its territory. */
["pointerenter", "mouseenter", "touchstart", "focus"].forEach(eventName => {
  noButton.addEventListener(eventName, (event) => {
    event.preventDefault();
    escapeNo();
  }, { passive: false });
});

noButton.addEventListener("click", (event) => {
  event.preventDefault();
  escapeNo();
});

function escapeNo() {
  const zone = choiceZone.getBoundingClientRect();
  const btn = noButton.getBoundingClientRect();

  noButton.style.position = "absolute";
  noButton.style.left = `${8 + Math.random() * Math.max(8, zone.width - btn.width - 16)}px`;
  noButton.style.top = `${8 + Math.random() * Math.max(8, zone.height - btn.height - 16)}px`;
  noButton.style.transform = "none";

  noEscapes++;

  const labels = [
    "Nope 😌",
    "Not happening 😂",
    "Try catching me",
    "Still no 😭",
    "You can't say no ♡",
    "Catch me if you can"
  ];
  noButton.textContent = labels[Math.min(noEscapes - 1, labels.length - 1)];
}

yesButton.addEventListener("click", () => {
  if (unlocked) return;
  unlocked = true;
  yesButton.disabled = true;
  noButton.style.display = "none";

  gameScreen.animate(
    [
      { opacity: 1, transform: "scale(1)", filter: "blur(0)" },
      { opacity: 0, transform: "scale(1.035)", filter: "blur(10px)" }
    ],
    { duration: 700, easing: "cubic-bezier(.7,0,.2,1)", fill: "forwards" }
  );

  setTimeout(() => {
    gameScreen.style.display = "none";
    loadingScreen.classList.add("visible");
    loadingScreen.setAttribute("aria-hidden", "false");
    startLoader();
  }, 620);
});

function startLoader() {
  let value = 0;

  const messages = [
    [0, "Gathering a little magic..."],
    [16, "Collecting the sweetest memories..."],
    [33, "Polishing a few little surprises..."],
    [52, "Adding unreasonable amounts of love..."],
    [70, "Making this one just for you..."],
    [86, "Almost there, beautiful..."],
    [96, "One last little thing... ♥"],
    [100, "Ready. Your surprise is yours now."]
  ];

  const timer = setInterval(() => {
    value += 0.55 + Math.random() * 1.65;
    value = Math.min(100, value);

    progressFill.style.width = `${value}%`;
    loadingPercent.textContent = `${Math.floor(value)}%`;

    const active = [...messages].reverse().find(([threshold]) => value >= threshold);
    if (active) loadingMessage.textContent = active[1];

    if (value >= 100) {
      clearInterval(timer);
      setTimeout(revealExperience, 1000);
    }
  }, 60);
}

function revealExperience() {
  loadingScreen.classList.remove("visible");
  loadingScreen.setAttribute("aria-hidden", "true");

  document.querySelectorAll(".content-section").forEach((section, index) => {
    setTimeout(() => section.classList.add("revealed"), index * 120);
  });

  burstHearts(35);

  // Music begins only after the user's explicit YES gesture.
  if (audio.src && !audio.src.endsWith("/assets/song.mp3")) {
    audio.play().then(() => setMusicState(true)).catch(() => {});
  } else {
    // The local file is still the intended source; browsers may require the
    // actual file to exist before playback can start.
    audio.play().then(() => setMusicState(true)).catch(() => {});
  }
}

/* Heart trail — generated behind the pointer throughout the entire website. */
document.addEventListener("pointermove", (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;

  const now = performance.now();
  if (now - lastHeart < 45) return;
  lastHeart = now;

  spawnHeart(event.clientX, event.clientY);
});

function spawnHeart(x, y) {
  const heart = document.createElement("span");
  heart.className = "cursor-heart";
  heart.textContent = Math.random() > 0.24 ? "♥" : "♡";

  const sizes = [8, 9, 11, 12, 14];
  const shades = ["#ff79ad", "#ff9ac0", "#ffd2e1", "#f7679f"];

  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.fontSize = `${sizes[Math.floor(Math.random() * sizes.length)]}px`;
  heart.style.color = shades[Math.floor(Math.random() * shades.length)];
  heart.style.setProperty("--dx", `${(Math.random() - .5) * 50}px`);
  heart.style.setProperty("--rot", `${(Math.random() - .5) * 80}deg`);

  heartLayer.appendChild(heart);
  setTimeout(() => heart.remove(), 950);
}

function burstHearts(count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      spawnHeart(
        innerWidth * (.28 + Math.random() * .44),
        innerHeight * (.42 + Math.random() * .25)
      );
    }, i * 26);
  }
}