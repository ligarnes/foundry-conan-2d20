import { prepareRollAttribute, prepareRollSkill } from "../common/dialog.js";

export class PlayerSheet extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["conan2d20", "sheet", "actor"],
            template: "systems/conan2d20/template/sheet/player-sheet.html",
            width: 700,
            height: 870,
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
        const info = super.getData();

        for (const [key, s] of Object.entries(info.data.attributes)) {
            info.data.attributes[key].skills = [];
        }

        for (const [key, s] of Object.entries(info.data.skills)) {
            const attribute = info.data.attributes[s.attribute];
            const tn = attribute.value+s.expertise;
            const skill = {expertise: s.expertise, focus: s.focus, label: s.label, targetNumber: tn, key: key};
            info.data.skills[key] = skill;
            info.data.attributes[s.attribute].skills.push(skill);
        }

        info.data.items = [];
        info.data.talents = [];
        let totalWeight = 0;
        for (const [key, s] of Object.entries(info.items)) {
            if (s.type === 'item'){
                s.data["isMin"] = s.data.quantity === 1;
                info.data.items.push(s);
                totalWeight += s.data.weight * s.data.quantity;
            }
            if (s.type === 'talent'){
                if (s.data.rank === undefined){
                    s.data["rank"] = 1;
                }
                s.data["isMin"] = s.data.rank === 1;
                s.data["isMax"] = s.data.rank === s.data.maximumRank;
                info.data.talents.push(s);
            }
        }
        info.data.totalWeight = totalWeight;

        return info;
    }


    activateListeners(html) {
        super.activateListeners(html);
        html.find(".roll-attribute").click(async ev => await this._prepareRollAttribute(ev));
        html.find(".roll-skill").click(async ev => await this._prepareRollSkill(ev));

        // Items
        html.find(".item-add").click(async ev => await this._addItem(ev));
        html.find(".item-remove").click(async ev => await this._removeItem(ev));
        html.find(".item-delete").click(async ev => await this._deleteItem(ev));
        html.find(".item-view").click(async ev => await this._showItem(ev));

        // Talents
        html.find(".talent-add").click(async ev => await this._addTalent(ev));
        html.find(".talent-remove").click(async ev => await this._removeTalent(ev));
        html.find(".talent-delete").click(async ev => await this._deleteTalent(ev));
        html.find(".talent-view").click(async ev => await this._showTalent(ev));
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
        const name = this.actor.data.name;
        const image = this.actor.data.img;
        const attributeName = $(event.currentTarget).data("attribute");
        const attribute = this.actor.data.data.attributes[attributeName];
        const attributeData = {name: game.i18n.localize(attribute.label), value: attribute.value};
        await prepareRollAttribute(name, attributeData, image);
    }

    async _prepareRollSkill(event) {
        event.preventDefault();
        const name = this.actor.data.name;
        const skillName = $(event.currentTarget)[0].dataset.attribute;
        const skill = this.actor.data.data.skills[skillName];
        const skillData = {name: game.i18n.localize(skill.label), expertise: skill.expertise, focus: skill.focus}
        const attribute = this.actor.data.data.attributes[skill.attribute];
        const attributeData = {name: game.i18n.localize(attribute.label), value: attribute.value};
        const image = this.actor.data.img;

        await prepareRollSkill(name, skillData, attributeData, image);
    }

    async _addItem(event) {
        const itemId = $(event.currentTarget)[0].dataset.attribute;
        let item = this.actor.items.find(item => item._id === itemId).data;
        item.data.quantity = item.data.quantity + 1;
        await this.actor.updateEmbeddedEntity("OwnedItem", item);
    }

    async _removeItem(event) {
        const itemId = $(event.currentTarget)[0].dataset.attribute;
        let item = this.actor.items.find(item => item._id === itemId).data;
        const newQuantity = item.data.quantity - 1;
        if (newQuantity >= 0){
            item.data.quantity = newQuantity;
            await this.actor.updateEmbeddedEntity("OwnedItem", item);
        }
    }

    async _deleteItem(event) {
        const itemId = $(event.currentTarget)[0].dataset.attribute;
        await this.actor.deleteEmbeddedEntity("OwnedItem", itemId); // Deletes multiple EmbeddedEntity objects
    }

    async _showItem(event) {
        const itemId = $(event.currentTarget)[0].dataset.attribute;
        let item = this.actor.getOwnedItem(itemId);
        item.sheet.render(true);
    }

    async _addTalent(event) {
        const talentId = $(event.currentTarget)[0].dataset.attribute;
        let talent = this.actor.items.find(item => item._id === talentId).data;
        const newRank = (talent.data.rank ? talent.data.rank : 1) + 1;
        if (newRank <= talent.data.maximumRank){
            talent.data.rank = newRank;
            await this.actor.updateEmbeddedEntity("OwnedItem", talent);
        }
    }

    async _removeTalent(event) {
        const itemId = $(event.currentTarget)[0].dataset.attribute;
        let item = this.actor.items.find(item => item._id === itemId).data;
        const newQuantity = item.data.rank - 1;
        if (newQuantity >= 1){
            item.data.rank = newQuantity;
            await this.actor.updateEmbeddedEntity("OwnedItem", item);
        }
    }

    async _deleteTalent(event) {
        const talentId = $(event.currentTarget)[0].dataset.attribute;
        await this.actor.deleteEmbeddedEntity("OwnedItem", talentId);
    }

    async _showTalent(event) {
        const talentId = $(event.currentTarget)[0].dataset.attribute;
        let talent = this.actor.getOwnedItem(talentId);
        talent.sheet.render(true);
    }
}
