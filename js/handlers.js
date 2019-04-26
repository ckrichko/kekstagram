'use strict';

(function () {

  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  /**
   * isEscPressed - при нажатии клавиши Esc вызывает функцию
   *
   * @param {Event} evt
   * @param {function} action
   */
  function isEscPressed(evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  }

  /**
   * isEnterPressed - при нажатии клавиши Enter вызывает функцию
   *
   * @param {Event} evt
   * @param {function} action
   */
  function isEnterPressed(evt, action) {
    if (evt.keyCode === ENTER_KEYCODE) {
      action();
    }
  }

  window.handlers = {
    isEscPressed: isEscPressed,
    isEnterPressed: isEnterPressed
  };
})();
