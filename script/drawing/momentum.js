import {CONFIG} from "../common/hooks.js";

export class Momentums extends Application {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: 'counter',
      classes: ["conan2d20", "counter"],
      template: 'systems/conan2d20/template/app/counter.html',
      popOut: false,
      height: 62,
      width: 'auto'
    });
  }

  /* -------------------------------------------- */
  /**
   * Provide data to the HTML template for rendering
   * @type {Object}
   */
  getData() {
    const data = super.getData();
    data.momentum = game.settings.get('conan2d20', 'momentum');
    data.doom = game.settings.get('conan2d20', 'doom');
    data.displayMomentumDoom = game.settings.get('conan2d20', 'displayMomentumDoom') === 's';

    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Call changeCounter when +/- is used
    html.find('.incr,.decr').click(ev => {
      const type = $(ev.currentTarget).parents('.counter').attr('data-type');
      const multiplier = $(ev.currentTarget).hasClass('incr') ? 1 : -1;
      Momentums.changeCounter(1 * multiplier, type);
    });
  }

  // ************************* STATIC FUNCTIONS ***************************

  /**
   * Set the counter of (type) to (value)
   * @param value Value to set counter to
   * @param type  Type of counter, "momentum" or "doom"
   */
  static async setCounter(value, type) {
    Momentums.checkCounterUpdate(value, type);
    value = Math.round(value);

    if (!game.user.isGM) {
      game.socket.emit('system.conan2d20', {
        type: 'setCounter',
        payload: {value, type},
      });
      return;
    }

    if (value > 6 && type === 'momentum') {
      value = 6;
    } else if (value < 0) {
      value = 0;
    }

    await game.settings.set('conan2d20', type, value);
    CONFIG.CONAN.CounterOverlay.render(true);

    // Emit socket event for users to rerender their counters
    game.socket.emit('system.conan2d20', {type: 'updateCounter'});
  }

  /**
   * Change the counter of (type) by (value)
   * @param diff How much to change the counter
   * @param type  Type of counter, "momentum" or "doom"
   */
  static async changeCounter(diff, type) {
    Momentums.checkCounterUpdate(diff, type);
    let value = game.settings.get("conan2d20", type);
    if (value + diff > 6 && type === 'momentum') {
      value = 6;
    } else if (value + diff < 0) {
      value = 0;
    } else {
      value += diff;
    }
    Momentums.setCounter(value, type);
  }

  // Check user entry. Rerender if error is detected to reset to the correct value
  static checkCounterUpdate(value, type) {
    const updateError = {
      counter: 'Conan 2D20 | Error updating CounterOverlay: Invalid CounterOverlay Type',
      value: 'Conan 2D20 | Error updating CounterOverlay: Invalid Value Type',
    };

    if (type !== 'doom' && type !== 'momentum') {
      ui.notifications.error('Error updating CounterOverlay: Invalid CounterOverlay Type');
      CONFIG.CONAN.CounterOverlay.render(true);
      throw updateError.counter;
    }

    if (Number.isNaN(value)) {
      ui.notifications.error('Error updating CounterOverlay: Invalid Value Type');
      CONFIG.CONAN.CounterOverlay.render(true);
      throw updateError.value;
    }
  }
}
