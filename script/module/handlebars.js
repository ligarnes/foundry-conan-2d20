export const initializeHandlebars = () => {
  registerHandlebarsHelpers();
  preloadHandlebarsTemplates();
};

function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/conan2d20/template/sheet/player-sheet.html",
    "systems/conan2d20/template/sheet/tab/player-main.html",
    "systems/conan2d20/template/sheet/tab/player-attribute.html",
    "systems/conan2d20/template/sheet/tab/player-talent.html",
    "systems/conan2d20/template/sheet/tab/player-equipment.html",
    "systems/conan2d20/template/sheet/tab/player-attack.html",
    "systems/conan2d20/template/sheet/tab/player-note.html",
    "systems/conan2d20/template/sheet/item-sheet.html",
    "systems/conan2d20/template/sheet/rule-sheet.html",
    "systems/conan2d20/template/sheet/attack-sheet.html",
    "systems/conan2d20/template/sheet/npc-sheet.html",
    "systems/conan2d20/template/sheet/npc/npc-main.html",
    "systems/conan2d20/template/app/counter.html",
  ];
  return loadTemplates(templatePaths);
}

function registerHandlebarsHelpers() {
  Handlebars.registerHelper("removeMarkup", function (text) {
    const markup = /<(.*?)>/gi;
    return text.replace(markup, "");
  });
}
