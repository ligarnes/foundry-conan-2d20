/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class SimpleRuleSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["conan2d20", "sheet", "rule"],
      template: "systems/conan2d20/template/sheet/rule-sheet.html",
      width: 370,
      height: 370,
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    return data;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
  }

  /* -------------------------------------------- */

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    return buttons;
  }
}
