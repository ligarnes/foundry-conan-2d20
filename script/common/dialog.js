import {rollAttribute, rollSkill} from "./rolls/roll.js";

export async function prepareRollAttribute(characterName, attribute, imagePath = "systems/conan2d20/asset/image/unknown-actor.png") {
  const html = await renderTemplate("systems/conan2d20/template/chat/dialog.html", {});
  let dialog = new Dialog({
    title: attribute.name,
    content: html,
    buttons: {
      roll: {
        icon: '<i class="fas fa-check"></i>',
        label: game.i18n.localize("BUTTON.ROLL"),
        callback: async (html) => {
          const diceCount = html.find("#dice_count")[0].value;
          await rollAttribute(characterName, attribute, diceCount, imagePath);
        },
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize("BUTTON.CANCEL"),
        callback: () => {
        },
      },
    },
    default: "roll",
    close: () => {
    },
  });
  dialog.render(true);
}

export async function prepareRollSkill(characterName, skill, attribute, imagePath = "systems/conan2d20/asset/image/unknown-actor.png") {
  const html = await renderTemplate("systems/conan2d20/template/chat/dialog.html", {});
  let dialog = new Dialog({
    title: attribute.name,
    content: html,
    buttons: {
      roll: {
        icon: '<i class="fas fa-check"></i>',
        label: game.i18n.localize("BUTTON.ROLL"),
        callback: async (html) => {
          const diceCount = html.find("#dice_count")[0].value;
          await rollSkill(characterName, skill, attribute, diceCount, imagePath);
        },
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize("BUTTON.CANCEL"),
        callback: () => {
        },
      },
    },
    default: "roll",
    close: () => {
    },
  });
  dialog.render(true);
}

export async function prepareRollDamage(characterName, imagePath = "systems/conan2d20/asset/image/unknown-actor.png") {
  const html = await renderTemplate("systems/conan2d20/template/chat/dialog.html", {});
  let dialog = new Dialog({
    title: attribute.name,
    content: html,
    buttons: {
      roll: {
        icon: '<i class="fas fa-check"></i>',
        label: game.i18n.localize("BUTTON.ROLL"),
        callback: async (html) => {
          const diceCount = html.find("#dice_count")[0].value;
          await rollSkill(characterName, skill, attribute, diceCount, imagePath);
        },
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize("BUTTON.CANCEL"),
        callback: () => {
        },
      },
    },
    default: "roll",
    close: () => {
    },
  });
  dialog.render(true);
}
