import {prepareRollSkill} from "../common/dialog.js";
import {rollDamage} from "../common/rolls/damage.js";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class SimpleAttackSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["conan2d20", "sheet", "attack"],
      template: "systems/conan2d20/template/sheet/attack-sheet.html",
      width: 500,
      height: 240,
      resizable: false,
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    return data;
  }

  /* -------------------------------------------- */

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".roll-attack").click(async ev => await this._prepareRollAttack(ev));
    html.find(".roll-damage").click(async ev => await this._prepareRollDamage(ev));
  }

  /* -------------------------------------------- */

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    return buttons;
  }

  async _prepareRollAttack(event) {
    event.preventDefault();
    const name = this.item.data.name;
    const image = this.item.data.img;
    const targetNumber = this.item.data.data.combatSkill;
    const attributeData = {name: this.item.data.name, value: targetNumber};
    const skillData = {name: name, expertise: 0, focus: this.item.data.data.combatFocus};

    await prepareRollSkill(name, skillData, attributeData, image);
  }

  async _prepareRollDamage(event) {
    event.preventDefault();
    await rollDamage(name, this.item);
  }
}
