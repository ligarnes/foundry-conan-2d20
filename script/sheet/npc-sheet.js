import {prepareRollAttribute, prepareRollSkill} from "../common/dialog.js";
import {rollDamage} from "../common/rolls/damage.js";

export class NpcSheet extends ActorSheet {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["conan2d20", "sheet", "npc"],
      template: "systems/conan2d20/template/sheet/npc-sheet.html",
      width: 500,
      height: 700,
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

    info.data.attacks = [];
    info.data.abilities = [];
    for (const [key, s] of Object.entries(info.items)) {
      if (s.type === 'attack') {
        info.data.attacks.push(s);
      }
      if (s.type === 'rule') {
        info.data.abilities.push(s);
      }
    }

    return info;
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".roll-attribute").click(async ev => await this._prepareRollAttribute(ev));
    html.find(".roll-skill").click(async ev => await this._prepareRollSkill(ev));

    // Attacks
    html.find(".attack-roll").click(async ev => await this._rollAttack(ev));
    html.find(".damage-roll").click(async ev => await this._rollDamage(ev));
    html.find(".attack-view").click(async ev => await this._viewAttack(ev));
    html.find(".attack-melee-create").click(async ev => await this._newMeleeAttack(ev));
    html.find(".attack-ranged-create").click(async ev => await this._newRangedAttack(ev));
    html.find(".attack-delete").click(async ev => await this._deleteAttack(ev));

    // Abilities
    html.find(".ability-create").click(async ev => await this._newAbility(ev));
    html.find(".ability-view").click(async ev => await this._viewAbility(ev));
    html.find(".ability-delete").click(async ev => await this._deleteAbility(ev));
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

  async _rollAttack(event) {
    const character = this.actor.data.name;
    const itemId = $(event.currentTarget)[0].dataset.attribute;
    let attack = this.actor.getOwnedItem(itemId);
    await this._prepareRollAttack(character, attack);
  }

  async _rollDamage(event) {
    const character = this.actor.data.name;
    const itemId = $(event.currentTarget)[0].dataset.attribute;
    let attack = this.actor.getOwnedItem(itemId);
    console.log(`${JSON.stringify(attack)}`);

    await this._prepareRollDamage(character, attack);
  }

  async _newMeleeAttack(event) {
    const combat = this.actor.data.data.fieldOfExpertise.combat;
    const attribute = this.actor.data.data.attributes["agility"].value;

    const character = {
      "name": "New Attack",
      "type": "attack",
      "data": {
        "type": "melee",
        "range": "reach-2",
        "combatSkill": combat + attribute,
        "combatFocus": combat,
        "damage": 3,
        "size": "1H",
        "qualities": ""
      },
      "img": "systems/conan2d20/asset/image/weapon.png",
      "effects": []
    };
    this.actor.createOwnedItem(character, {renderSheet: true});
  }

  async _newRangedAttack(event) {
    const combat = this.actor.data.data.fieldOfExpertise.combat;
    const attribute = this.actor.data.data.attributes["coordination"].value;

    const character = {
      "name": "New Attack",
      "type": "attack",
      "data": {
        "type": "range",
        "range": "close",
        "combatSkill": attribute + combat,
        "combatFocus": combat,
        "damage": 3,
        "size": "2H",
        "qualities": ""
      },
      "img": "systems/conan2d20/asset/image/weapon.png",
      "effects": []
    };
    this.actor.createOwnedItem(character, {renderSheet: true});
  }

  async _viewAttack(event) {
    const attackId = $(event.currentTarget)[0].dataset.attribute;
    let attack = this.actor.getOwnedItem(attackId);
    attack.sheet.render(true);
  }

  async _deleteAttack(event) {
    const itemId = $(event.currentTarget)[0].dataset.attribute;
    await this.actor.deleteEmbeddedEntity("OwnedItem", itemId); // Deletes multiple EmbeddedEntity objects
  }

  async _prepareRollAttack(characterName, attack) {
    const image = attack.data.img;
    const targetNumber = attack.data.data.combatSkill;
    const attributeData = {name: attack.data.name, value: targetNumber};
    const skillData = {name: attack.data.name, expertise: 0, focus: attack.data.data.combatFocus};

    await prepareRollSkill(characterName, skillData, attributeData, image);
  }

  async _prepareRollDamage(characterName, attack) {
    await rollDamage(characterName, attack);
  }

  async _newAbility(event) {
    const ability = {
      "name": "New ability",
      "type": "rule",
      "data": {
        "description": "some description"
      },
      "img": "systems/conan2d20/asset/image/weapon.png",
      "effects": []
    };
    this.actor.createOwnedItem(ability, {renderSheet: true});
  }

  async _editAbility(event) {
    const abilityId = $(event.currentTarget)[0].dataset.attribute;
    let ability = this.actor.getOwnedItem(abilityId);
    ability.sheet.render(true);
  }

  async _viewAbility(event) {
    const attackId = $(event.currentTarget)[0].dataset.attribute;
    let item = this.actor.getOwnedItem(attackId);
    item.sheet.render(true);
  }

  async _deleteAbility(event) {
    const itemId = $(event.currentTarget)[0].dataset.attribute;
    await this.actor.deleteEmbeddedEntity("OwnedItem", itemId); // Deletes multiple EmbeddedEntity objects
  }
}
