/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class SimpleRuleSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["conan2d20", "sheet", "item"],
      template: "systems/conan2d20/template/sheet/rule-sheet.html",
      width: 370,
      height: 370,
    });
  }

  isEditable2 = false;

  /**
   * Get the correct HTML template path to use for rendering this particular sheet
   * @type {String}
   */
  get template() {
    if (this.isEditable2) return "systems/conan2d20/template/sheet/rule-sheet-edit.html";
    return "systems/conan2d20/template/sheet/rule-sheet.html";
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

    let btnEdit = {
      label: "Edit",
      class: "btn-sheet-edit",
      icon: "fas fa-edit",
      onclick: () => this._edit()
    };

    let btnView = {
      label: "View",
      class: "btn-sheet-view",
      icon: "fas fa-eye",
      onclick: () => this._view()
    }

    buttons = [btnView, btnEdit].concat(buttons);

    return buttons;
  }

  /* -------------------------------------------- */
  _edit() {
    document.getElementById("rule-view").style.display = "none";
    document.getElementById("rule-edit").style.display = "block";

    document.getElementsByClassName("btn-sheet-view")[0].style.display = "block";
    document.getElementsByClassName("btn-sheet-edit")[0].style.display = "none";
  }

  _view() {
    document.getElementById("rule-view").style.display = "block";
    document.getElementById("rule-edit").style.display = "none";

    document.getElementsByClassName("btn-sheet-view")[0].style.display = "none";
    document.getElementsByClassName("btn-sheet-edit")[0].style.display = "block";
  }
}
