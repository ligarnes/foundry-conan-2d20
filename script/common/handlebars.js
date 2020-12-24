export const initializeHandlebars = () => {
  registerHandlebarsHelpers();
  preloadHandlebarsTemplates();
};

function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/conan2d20/template/sheet/player-sheet.html",
    "systems/conan2d20/template/sheet/tab/player-main.html",
    "systems/conan2d20/template/sheet/tab/player-attribute.html",
    "systems/conan2d20/template/sheet/tab/player-equipment.html",
    "systems/conan2d20/template/sheet/tab/player-bio.html",
    "systems/conan2d20/template/sheet/tab/player-note.html",
    "systems/conan2d20/template/sheet/item-sheet.html"
  ];
  return loadTemplates(templatePaths);
}

function registerHandlebarsHelpers() {
  Handlebars.registerHelper("removeMarkup", function (text) {
    const markup = /<(.*?)>/gi;
    return text.replace(markup, "");
  });
}
