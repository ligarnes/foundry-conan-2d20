import {CONFIG} from "../common/hooks.js";

export default function () {
  game.settings.register("conan2d20", "worldSchemaVersion", {
    name: "World Version",
    hint: "Used to automatically upgrade worlds data when the system is upgraded.",
    scope: "world",
    config: true,
    default: 1,
    type: Number,
  });
  game.settings.register("conan2d20", "displayMomentumDoom", {
    name: "Display Momentum/Doom",
    hint: "Wherever to display or hide the Momentum/Doom bar",
    scope: "client",
    config: true,
    type: String,
    choices: {
      "s": "Show Momentum/Doom",
      "h": "Hide Momentum/Doom"
    },
    default: "s",
    onChange: value => CONFIG.CONAN.CounterOverlay.render(true)
  });
  game.settings.register("conan2d20", "momentum", {
    name: "Momentum",
    hint: "The current momentum of the game",
    scope: "world",
    config: false,
    default: 0,
    type: Number,
  });
  game.settings.register("conan2d20", "doom", {
    name: "Doom",
    hint: "The current doom of the game",
    scope: "world",
    config: false,
    default: 0,
    type: Number,
  });
}