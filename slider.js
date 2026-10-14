// Simple image slider using plain JavaScript
const slider = document.querySelector(".slider");
const track = document.querySelector(".slider-track");
const slides = Array.from(document.querySelectorAll(".slide"));
const previousButton = document.querySelector(".previous");
const nextButton = document.querySelector(".next");
const dotsBox = document.querySelector(".dots");
const counter = document.querySelector("#counter");

const total = slides.length;
let position = 1;
let moving = false;

// Copies make both ends of the slider loop smoothly.
const firstCopy = slides[0].cloneNode(true);
const lastCopy = slides[total - 1].cloneNode(true);
firstCopy.setAttribute("aria-hidden", "true");
lastCopy.setAttribute("aria-hidden", "true");
track.appendChild(firstCopy);
track.insertBefore(lastCopy, track.firstChild);

// Create exactly one dot for each original slide.
for (let i = 0; i < total; i++) {
  const dot = document.createElement("button");
  dot.className = "dot";
  dot.type = "button";
  dot.setAttribute("aria-label", `Go to image ${i + 1}`);
  dot.addEventListener("click", () => goTo(i + 1));
  dotsBox.appendChild(dot);
}

const dots = document.querySelectorAll(".dot");

function updateDots() {
  const current = (position - 1 + total) % total;
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === current);
    dot.setAttribute("aria-current", i === current ? "true" : "false");
  });
  counter.textContent = `${current + 1} / ${total}`;
}

function showSlide(animated = true) {
  if (!animated) track.classList.add("no-animation");
  track.style.transform = `translateX(-${position * 100}%)`;
  updateDots();
  if (!animated) {
    // Apply the instant jump before turning animations back on.
    track.offsetHeight;
    track.classList.remove("no-animation");
  }
}

function goTo(newPosition) {
  if (moving || newPosition === position) return;
  moving = true;
  position = newPosition;
  showSlide();
}

previousButton.addEventListener("click", () => goTo(position - 1));
nextButton.addEventListener("click", () => goTo(position + 1));

track.addEventListener("transitionend", (event) => {
  if (event.propertyName !== "transform") return;
  if (position === 0) position = total;
  if (position === total + 1) position = 1;
  showSlide(false);
  moving = false;
});

slider.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") goTo(position - 1);
  if (event.key === "ArrowRight") goTo(position + 1);
});

// Begin on the first real slide (after the last-slide copy).
showSlide(false);
