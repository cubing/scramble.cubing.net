import { wcaEventInfo } from "cubing/puzzles";
import { randomScrambleForEvent } from "cubing/scramble";
import { setDebug } from "cubing/search";
import "cubing/twisty";
import { PuzzleID, TwistyPlayer } from "cubing/twisty";

type EventInfo = { puzzleID: PuzzleID; eventName: string; iconID?: string };
const unofficialEvents: Record<string, EventInfo> = {
  fto: { puzzleID: "fto", eventName: "FTO" },
  master_tetraminx: {
    puzzleID: "master_tetraminx",
    eventName: "Master Tetraminx",
    iconID: "mtetram",
  },
  kilominx: {
    puzzleID: "kilominx",
    eventName: "Kilominx",
    iconID: "kilominx",
  },
  redi_cube: {
    puzzleID: "redi_cube",
    eventName: "Redi Cube",
    iconID: "redi",
  },
};

const { searchParams } = new URL(location.href);
const event = searchParams.get("event") ?? "333";
const eventInfo: EventInfo = wcaEventInfo(event) ?? unofficialEvents[event]!;

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

const tempoScale = parseFloat(searchParams.get("tempo-scale") ?? "10");
player.tempoScale = tempoScale;
const visualization = searchParams.get("visualization");
if (visualization === "2D") {
  player.visualization = visualization;
}

const eventName = eventInfo.eventName;
const generating = document.querySelector("#generating");
player.puzzle = eventInfo.puzzleID;
textElem.classList.add(`event-${event}`);
cubingIcon.classList.add(`event-${eventInfo.iconID ?? event}`);
cubingIcon.classList.add(`unofficial-${eventInfo.iconID ?? event}`);
document.title = `${eventName} scramble`;

customElements.whenDefined("twisty-player").then(() => {
  player.style.opacity = "1";
});

setDebug({ scramblePrefetchLevel: "immediate" });
async function go() {
  player.alg = "";
  generating.textContent = `Generating a fair, random ${eventName} scramble…`;
  const scramble = await randomScrambleForEvent(event);
  generating.textContent = "";
  player.hintFacelets = event === "minx" ? "none" : "floating";
  player.alg = scramble;
  player.timestamp = 0;
  player.play();
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

// TODO: Avoid trying to run for local dev?
if (location.hostname === "scramble.cubing.net") {
  window.addEventListener("load", () => {
    navigator.serviceWorker?.register("/sw.js");
  });
}
