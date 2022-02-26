import { wcaEventInfo } from "cubing/puzzles";
import { randomScrambleForEvent } from "cubing/scramble";
import { setDebug } from "cubing/search";
import "cubing/twisty";
import { PuzzleID, TwistyPlayer } from "cubing/twisty";

function updateURLParam(key, value, defaultValue): void {
  const url = new URL(location.href);
  if (value === defaultValue) {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  window.history.replaceState("", "", url.toString());
}

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
const optionsElem = document.querySelector("#options") as HTMLElement;
const textElem = document.querySelector("#text") as HTMLElement;
const player = document.querySelector("#main") as TwistyPlayer;
function toggleOptions(e?: Event, force?: boolean) {
  e?.preventDefault();
  // Important: this is *not* equivalent to: `force !== optionsElem.hidden` (`force` can be `undefined`)
  if (force === !optionsElem.hidden) {
    return;
  }
  optionsElem.hidden = !optionsElem.hidden;
  textElem.hidden = !textElem.hidden;
  player.hidden = !player.hidden;
}
cubingIcon.addEventListener("click", toggleOptions);
if (searchParams.get("debug-options") === "true") {
  toggleOptions();
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Slash") {
    toggleOptions();
    e.preventDefault();
  }
});

for (const button of document.querySelectorAll("#event-grid button")) {
  button.addEventListener("click", () => {
    updateURLParam("event", button.getAttribute("data-event"), "333");
    location.reload();
  });
}

const tempoScale = parseFloat(searchParams.get("tempo-scale") ?? "10");
player.tempoScale = tempoScale;
const tempoSlider = document.querySelector(
  "#speed-wrapper input"
) as HTMLInputElement;
tempoSlider.addEventListener("input", () => {
  player.tempoScale = parseFloat(tempoSlider.value);
  updateURLParam("tempo-scale", tempoSlider.value, "10");
});
tempoSlider.value = tempoScale.toString();

const visualization2DCheckbox = optionsElem.querySelector(
  "#visualization-2D"
) as HTMLInputElement;
visualization2DCheckbox.addEventListener("input", () => {
  const newVisualization = visualization2DCheckbox.checked ? "2D" : "auto";
  player.visualization = newVisualization;
  updateURLParam("visualization", newVisualization, "auto");
});
const visualizationIs2D = searchParams.get("visualization") === "2D";
visualization2DCheckbox.checked = visualizationIs2D;
if (visualizationIs2D) {
  player.visualization = "2D";
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
async function rescramble() {
  toggleOptions(undefined, false);
  player.alg = "";
  generating.textContent = `Generating a fair, random ${eventName} scramble…`;
  const scramble = await randomScrambleForEvent(event);
  generating.textContent = "";
  player.hintFacelets = event === "minx" ? "none" : "floating";
  player.alg = scramble;
  player.timestamp = 0;
  player.play();
}
rescramble();

const rescrambleElem = document.querySelector("#rescramble");
rescrambleElem.addEventListener("click", rescramble);
const showRescrambleCheckbox = document.querySelector(
  "#show-rescramble"
) as HTMLInputElement;
if (
  (navigator as any).standalone // Safari workaround
) {
  rescrambleElem.classList.add("force-show");
  showRescrambleCheckbox.checked = true;
  showRescrambleCheckbox.disabled = true;
} else {
  const showRescramble =
    new URL(location.href).searchParams.get("show-rescramble") === "true";
  showRescrambleCheckbox.checked = showRescramble;
  rescrambleElem.classList.toggle("force-show", showRescramble);
  showRescrambleCheckbox.addEventListener("input", (e) => {
    e.preventDefault();
    const showRescramble = showRescrambleCheckbox.checked;
    updateURLParam("show-rescramble", showRescramble.toString(), "false");
    rescrambleElem.classList.toggle("force-show", showRescramble);
  });
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    rescramble(); // TODO: Avoid queueing multiple.
  }
});

// TODO: Avoid trying to run for local dev?
if (location.hostname === "scramble.cubing.net") {
  window.addEventListener("load", () => {
    navigator.serviceWorker?.register("/sw.js");
  });
}
