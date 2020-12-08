import { rollAttribute, rollSkill } from "./roll.js";

export async function prepareRollAttribute(attribute) {
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
                    await rollAttribute(attribute, diceCount);
                },
            },
            cancel: {
                icon: '<i class="fas fa-times"></i>',
                label: game.i18n.localize("BUTTON.CANCEL"),
                callback: () => {},
            },
        },
        default: "roll",
        close: () => {},
    });
    dialog.render(true);
}

export async function prepareRollSkill(skill, attribute) {
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
                    await rollSkill(skill, attribute, diceCount);
                },
            },
            cancel: {
                icon: '<i class="fas fa-times"></i>',
                label: game.i18n.localize("BUTTON.CANCEL"),
                callback: () => {},
            },
        },
        default: "roll",
        close: () => {},
    });
    dialog.render(true);
}
