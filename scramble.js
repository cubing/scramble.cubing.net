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

const cubingIcon = document.querySelector(".cubing-icon");

const textElem = document.querySelector("#text");
const generating = document.querySelector("#generating");
const player = document.querySelector("#main");
player.puzzle = puzzle;
generating.textContent = `Generating ${eventNames[event]} scramble…`;
textElem.classList.add(event);
cubingIcon.classList.add(`event-${event}`);

customElements.whenDefined("twisty-player").then(() => {
  player.style.opacity = 1;
});

randomScrambleForEvent(event).then((a) => {
  generating.textContent = "";
  const player = document.querySelector("#main");
  player.alg = a;
  player.timestamp = 0;
  player.tempoScale = 5;
  player.play();
});
