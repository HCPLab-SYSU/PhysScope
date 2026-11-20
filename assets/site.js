"use strict";

const inspector = document.querySelector(".inspector");
const stateButtons = inspector.querySelectorAll("[data-state-choice]");
const angleText = { A: "30", B: "53" };
const stateDescriptions = {
  A: "In state A, block P is released from rest. Its rope makes a 30-degree angle with the horizontal. The dashed rope shows state B.",
  B: "In state B, block P is closer to the pulley. Its rope makes a 53-degree angle with the horizontal, and Q is farther down the incline. The dashed rope shows state A."
};
for (const button of stateButtons) {
  button.addEventListener("click", () => {
    const state = button.dataset.stateChoice;
    inspector.dataset.state = state;
    for (const choice of stateButtons) {
      choice.setAttribute("aria-pressed", String(choice === button));
    }
    document.getElementById("plot-description").textContent = stateDescriptions[state];
    document.getElementById("equation").lastChild.textContent = " cos " + angleText[state] + "°";
  });
}

const sectionLinks = [...document.querySelectorAll(".rail a")];
const sections = sectionLinks.map(link => document.querySelector(link.hash));
function markCurrentSection() {
  const readingLine = Math.min(220, window.innerHeight * 0.32);
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= readingLine) current = section;
  }
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3) {
    current = sections[sections.length - 1];
  }
  for (const link of sectionLinks) {
    if (link.hash === "#" + current.id) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}
let scheduled = false;
function scheduleSectionUpdate() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    markCurrentSection();
    scheduled = false;
  });
}
window.addEventListener("scroll", scheduleSectionUpdate, { passive: true });
window.addEventListener("resize", scheduleSectionUpdate);
window.addEventListener("load", scheduleSectionUpdate);
markCurrentSection();

const copyButton = document.getElementById("copy-citation");
const citation = document.getElementById("bibtex");
const status = document.getElementById("copy-status");
let resetCopy;
copyButton.hidden = false;
copyButton.addEventListener("click", async () => {
  clearTimeout(resetCopy);
  try {
    await navigator.clipboard.writeText(citation.textContent);
    copyButton.lastChild.textContent = "Copied";
    status.textContent = "BibTeX copied.";
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(citation);
    selection.removeAllRanges();
    selection.addRange(range);
    copyButton.lastChild.textContent = "Text selected";
    status.textContent = "Citation selected. Use your device’s copy command.";
  }
  resetCopy = setTimeout(() => {
    copyButton.lastChild.textContent = "Copy";
    status.textContent = "";
  }, 2500);
});
