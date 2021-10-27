import "cubing/twisty";
import { randomScrambleForEvent } from "cubing/scramble";
import { puzzleIDForWCAEvent } from "cubing/puzzles";
import { TwistyPlayer } from "cubing/twisty";

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

const cubingIcon = document.querySelector("#event-selector") as HTMLElement;
const showEventsElem = document.querySelector("#show-events") as HTMLElement;
const textElem = document.querySelector("#text") as HTMLElement;
const player = document.querySelector("#main") as TwistyPlayer;
cubingIcon.addEventListener("click", (e) => {
  e.preventDefault();
  showEventsElem.hidden = !showEventsElem.hidden;
  textElem.hidden = !textElem.hidden;
  player.hidden = !player.hidden;
});

const eventName = eventNames[event];
const generating = document.querySelector("#generating");
player.puzzle = puzzle;
textElem.classList.add(`event-${event}`);
cubingIcon.classList.add(`event-${event}`);
document.title = `${eventName} scramble`;

customElements.whenDefined("twisty-player").then(() => {
  player.style.opacity = "1";
});

let scramblePromise = randomScrambleForEvent(event);

function go() {
  player.alg = "";
  generating.textContent = `Generating a fair, random ${eventName} scramble…`;
  scramblePromise.then((a) => {
    generating.textContent = "";
    player.hintFacelets = event === "minx" ? "none" : "floating";
    player.alg = a;
    player.timestamp = 0;
    player.tempoScale = 10;
    player.play();

    // Pre-request the next.
    scramblePromise = randomScrambleForEvent(event);
  });
}
go();

document.querySelector("#refresh").addEventListener("click", go);
if (
  new URL(location.href).searchParams.get("show-refresh") === "true" ||
  (navigator as any).standalone // Safari workaround
) {
  document.querySelector("#refresh").classList.add("force-show");
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    go(); // TODO: Avoid queueing multiple.
  }
});
