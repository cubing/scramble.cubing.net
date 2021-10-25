import "https://cdn.cubing.net/js/cubing/twisty";
import { randomScrambleForEvent } from "https://cdn.cubing.net/js/cubing/scramble";
import { puzzleIDForWCAEvent } from "https://cdn.cubing.net/js/cubing/puzzles";

const event = new URL(location.href).searchParams.get("event") ?? "333";
const puzzle = puzzleIDForWCAEvent(event);

const eventNames = {
  333: "3x3x3",
  222: "2x2x2",
  444: "4x4x4",
  555: "5x5x5",
  666: "6x6x6",
  777: "7x7x7",
  "333bf": "3x3x3 Blindfolded",
  "333fm": "3x3x3 Fewest Moves",
  "333oh": "3x3x3 One-Handed",
  clock: "Clock",
  minx: "Megaminx",
  pyram: "Pyraminx",
  skewb: "Skewb",
  sq1: "Square-1",
  "444bf": "4x4x4 Blindfolded",
  "555bf": "5x5x5 Blindfolded",
};

const cubingIcon = document.querySelector("#event-selector");
const showEventsElem = document.querySelector("#show-events");
const textElem = document.querySelector("#text");
const player = document.querySelector("#main");
cubingIcon.addEventListener("click", (e) => {
  e.preventDefault();
  showEventsElem.hidden = !showEventsElem.hidden;
  textElem.hidden = !textElem.hidden;
  player.hidden = !player.hidden;
});

const generating = document.querySelector("#generating");
player.puzzle = puzzle;
textElem.classList.add(`event-${event}`);
cubingIcon.classList.add(`event-${event}`);

customElements.whenDefined("twisty-player").then(() => {
  player.style.opacity = 1;
});

function go() {
  player.alg = "";
  generating.textContent = `Generating ${eventNames[event]} scramble…`;
  randomScrambleForEvent(event).then((a) => {
    generating.textContent = "";
    player.hintFacelets = event === "minx" ? "none" : "floating";
    player.alg = a;
    player.timestamp = 0;
    player.tempoScale = 5;
    player.play();
  });
}
go();

document.querySelector("#refresh").addEventListener("click", go);
if (
  navigator.standalone ||
  window.matchMedia("(display-mode: standalone)").matches
) {
  document.querySelector("#refresh").hidden = false;
}
