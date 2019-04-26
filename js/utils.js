'use strict';

(function () {

  var SUCCESS_COLOR = '#43A047';
  var ERROR_COLOR = '#BF360C';
  var INTERVAL = 500;
  var currentTimeout;

  /**
   * debounce - устанавливает setTimeout для заданной функции, устраняя слишком частые ее вызовы
   *
   * @param {function} action
   */
  function debounce(action) {
    if (currentTimeout) {
      window.clearTimeout(currentTimeout);
    }
    currentTimeout = window.setTimeout(action, INTERVAL);
  }

  /**
   * показывает сообщение об отправке данных
   * @param {String} message - сообщение
   * @param {String} backgroundColor - цвет фона сообщения
   */
  function createPopup(message, backgroundColor) {
    var popup = document.createElement('div');
    popup.classList.add('popup');
    popup.style.background = backgroundColor;
    popup.textContent = message;
    document.body.insertAdjacentElement('afterbegin', popup);
    // события для закрытия попапа
    document.addEventListener('click', onPageClick);
    document.addEventListener('keydown', onPageEscPress);

    function onPageClick(evt) {
      evt.preventDefault();
      closePopup();
    }

    function onPageEscPress(evt) {
      evt.preventDefault();
      window.handlers.isEscPressed(evt, closePopup);
    }

    /**
     * Закрывет попап; удаляет обработчики
     */
    function closePopup() {
      popup.remove();
      document.removeEventListener('click', onPageClick);
      document.removeEventListener('keydown', onPageEscPress);
    }
  }

  /**
   * выдаёт сообщение об успешной отправке
   */
  function renderSuccessPopup() {
    createPopup('Данные отправлены успешно!', SUCCESS_COLOR);
  }

  /**
   * Выдаёт сообщение об ошибке
   * @param {String} message
   */
  function renderErrorPopup(message) {
    createPopup(message, ERROR_COLOR);
  }

  window.utils = {
    renderSuccessPopup: renderSuccessPopup,
    renderErrorPopup: renderErrorPopup,
    debounce: debounce
  };
})();
