export const migrateWorld = () => {
  const schemaVersion = 1;
  const worldSchemaVersion = Number(game.settings.get("conan2d20", "worldSchemaVersion"));
  if (worldSchemaVersion !== schemaVersion && game.user.isGM) {
    ui.notifications.info(`Upgrading the world from ${worldSchemaVersion} to ${schemaVersion}, please wait...`);
    ui.notifications.info("Upgrade complete!");
  }
};
