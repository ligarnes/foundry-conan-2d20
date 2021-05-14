import {ConanActor} from "./actor.js";
import {SimpleItemSheet} from "../sheet/item-sheet.js";
import {SimpleAttackSheet} from "../sheet/attack-sheet.js";
import {SimpleTalentSheet} from "../sheet/talent-sheet.js";
import {SimpleRuleSheet} from "../sheet/rule-sheet.js";
import {PlayerSheet} from "../sheet/player.js";
import {NpcSheet} from "../sheet/npc-sheet.js";
import {initializeHandlebars} from "./handlebars.js";

Hooks.once("init", () => {
  console.log(`Initializing Conan 2d20 System`);
  CONFIG.Combat.initiative = {formula: "1d20", decimals: 2};
  CONFIG.Actor.entityClass = ConanActor;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("conan2d20", PlayerSheet, {types: ["player"], makeDefault: true});
  Actors.registerSheet("conan2d20", NpcSheet, {types: ["npc"], makeDefault: false});
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("conan2d20", SimpleItemSheet, {types: ["item"], makeDefault: true});
  Items.registerSheet("conan2d20", SimpleTalentSheet, {types: ["talent"], makeDefault: false});
  Items.registerSheet("conan2d20", SimpleAttackSheet, {types: ["attack"], makeDefault: false});
  Items.registerSheet("conan2d20", SimpleRuleSheet, {types: ["rule"], makeDefault: false});

  initializeHandlebars();
  game.settings.register("conan2d20", "worldSchemaVersion", {
    name: "World Version",
    hint: "Used to automatically upgrade worlds data when the system is upgraded.",
    scope: "world",
    config: true,
    default: 0,
    type: Number,
  });

  game.settings.register('conan2d20', 'momentum', {
    name: 'Momentum',
    scope: 'world',
    config: false,
    default: 0,
    type: Number,
  });
  game.settings.register('conan2d20', 'doom', {
    name: 'Doom',
    scope: 'world',
    config: false,
    default: 0,
    type: Number,
  });


});

Hooks.once("ready", () => {
  //migrateWorld();

  try {
    CONFIG.CONAN = {};

    /*
    CONFIG.CONAN.CounterOverlay = new Momentums();

    game.socket.on('system.conan2d20', event => {
      if (event.type === 'setCounter' && game.user.isGM) {
        CONFIG.CONAN.CounterOverlay.setCounter(event.payload.value, event.payload.type);
      }

      if (event.type === 'updateCounter') {
        CONFIG.CONAN.CounterOverlay.render(true);
      }
    });

    CONFIG.CONAN.CounterOverlay.render(true);
    console.log("Render overlay")
    */
  } catch (e) {
    console.log(e);
  }
});

Hooks.on("preCreateActor", (createData) => {
  console.log("createData: ", createData);
  mergeObject(createData, {
    "token.bar1": {"attribute": "health.vigor"},
    "token.bar2": {"attribute": "health.wound"},
    "token.displayName": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
    "token.displayBars": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
    "token.disposition": CONST.TOKEN_DISPOSITIONS.NEUTRAL,
    "token.name": createData.name
  });
  if (!createData.img) {
    createData.img = "systems/conan2d20/asset/image/unknown-actor.png"
  }
  if (createData.type === "player") {
    createData.token.vision = true;
    createData.token.actorLink = true;
  }
});

Hooks.on("createOwnedItem", (actor, item) => {

});

Hooks.on("preCreateItem", (createData) => {
  if (!createData.img) {
    if (createData.type === "item") {
      createData.img = "systems/conan2d20/asset/image/equipment.png"
    }
    if (createData.type === "talent") {
      createData.img = "systems/conan2d20/asset/image/talent.png"
    }
    if (createData.type === "attack") {
      createData.img = "systems/conan2d20/asset/image/weapon.png"
    }
  }
});

Hooks.once('diceSoNiceReady', (dice3d) => {
  dice3d.addSystem({id: "conan2d20", name: "conan2d20"}, true);
  dice3d.addColorset({
    name: 'conan2d20',
    description: "conan2d20",
    category: "conan2d20",
    foreground: '#211f19',
    background: "#d6b076",
    outline: "#3b3832",
    texture: 'stars',
    edge: '#211f19'
  }, "default");
})