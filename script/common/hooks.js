import { ConanActor } from "./actor.js";
import { SimpleItemSheet } from "../sheet/item-sheet.js";
import { SimpleTalentSheet } from "../sheet/talent-sheet.js";
import { PlayerSheet } from "../sheet/player.js";
import { initializeHandlebars } from "./handlebars.js";
import { migrateWorld } from "./migration.js";

Hooks.once("init", () => {
  console.log(`Initializing Conan 2d20 System`);
  CONFIG.Combat.initiative = { formula: "1d20", decimals: 2 };

  CONFIG.Actor.entityClass = ConanActor;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("conan2d20", PlayerSheet, { types: ["player"], makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("conan2d20", SimpleItemSheet, { types: ["item"], makeDefault: true });
  Items.registerSheet("conan2d20", SimpleTalentSheet, { types: ["talent"], makeDefault: true });

  initializeHandlebars();

  game.settings.register("conan2d20", "worldSchemaVersion", {
      name: "World Version",
      hint: "Used to automatically upgrade worlds data when the system is upgraded.",
      scope: "world",
      config: true,
      default: 0,
      type: Number,
  });
});

Hooks.once("ready", () => {
    migrateWorld();
});

Hooks.on("preCreateActor", (createData) => {
    mergeObject(createData, {
        "token.bar1" :{ "attribute" : "health.vigor" },
        "token.bar2" :{ "attribute" : "health.wound" },
        "token.displayName" : CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
        "token.displayBars" : CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
        "token.disposition" : CONST.TOKEN_DISPOSITIONS.NEUTRAL,
        "token.name" : createData.name
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
    if (createData.type === "item"){
      createData.img = "systems/conan2d20/asset/image/equipment.png"
    }
    if (createData.type === "talent"){
      createData.img = "systems/conan2d20/asset/image/talent.png"
    }
  }
});

Hooks.once('diceSoNiceReady', (dice3d) => {
    dice3d.addSystem({id:"conan2d20",name:"conan2d20"}, true);
    dice3d.addColorset({
        name: 'conan2d20',
        description: "conan2d20",
        category: "conan2d20",
        foreground: '#211f19',
        background: "#d6b076",
        outline: "#3b3832",
        texture: 'stars',
        edge: '#211f19'
    },"default");
})
