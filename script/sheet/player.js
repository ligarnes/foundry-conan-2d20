import { prepareRollAttribute, prepareRollSkill } from "../common/dialog.js";

export class PlayerSheet extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["conan2d20", "sheet", "actor"],
            template: "systems/conan2d20/template/sheet/player-sheet.html",
            width: 700,
            height: 1000,
            resizable: false,
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "main",
                },
            ]
        });
    }

    getData() {
        const data = super.getData();
        for (const [key, s] of Object.entries(data.data.skills)) {
            data.data.skills[key] = {expertise: s.expertise, focus: s.focus, label: s.label, attribute: data.data.attributes[s.attribute]};
        }
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".roll-attribute").click(async ev => await this._prepareRollAttribute(ev));
        html.find(".roll-skill").click(async ev => await this._prepareRollSkill(ev));
    }

    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();
        if (this.actor.owner) {
            buttons = [
                {
                    label: game.i18n.localize("BUTTON.FORTUNE"),
                    class: "recover-death-roll",
                    icon: "fas fa-heartbeat",
                    onclick: () => console.log("click")
                }
            ].concat(buttons);
        }
        return buttons;
    }

    async _prepareRollAttribute(event) {
        event.preventDefault();
        const attributeName = $(event.currentTarget).data("attribute");
        const attribute = this.actor.data.data.attributes[attributeName];
        const attributeData = {name: game.i18n.localize(attribute.label), value: attribute.value};
        await prepareRollAttribute(attributeData);
    }

    async _prepareRollSkill(event) {
        event.preventDefault();
        const skillName = $(event.currentTarget)[0].dataset.attribute;
        const skill = this.actor.data.data.skills[skillName];
        const skillData = {name: game.i18n.localize(skill.label), expertise: skill.expertise, focus: skill.focus}
        const attribute = this.actor.data.data.attributes[skill.attribute];
        const attributeData = {name: game.i18n.localize(attribute.label), value: attribute.value};

        await prepareRollSkill(skillData, attributeData);
    }
}
