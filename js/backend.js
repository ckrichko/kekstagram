'use strict';

(function () {
  var SERVER_URL = 'https://js.dump.academy/kekstagram';
  var URL = 'https://js.dump.academy/kekstagram/data';
  var STATUS_OK = 200;
  var TIMEOUT = 5000;
  var RESPONSE_TYPE = 'json';

  /**
   * setup - создает новый XMLHttpRequest запрос,
   * устанавливает ему обработчики успешного ответа и ошибок
   *
   * @param {function} onLoad выполняется при успешном ответе сервера
   * @param {function} onError выполняется при ошибке
   * @return {Object} xhr
   */
  function setup(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = RESPONSE_TYPE;

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        onLoad(xhr.response);
      } else {
        onError('Произошла ошибка. Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;
    return xhr;
  }

  /**
   * load - функция загрузки данных с сервера
   * @param {function} onLoad обработчик успешной загрузки
   * @param {function} onError обработчик ошибок
   */
  function load(onLoad, onError) {
    var xhr = setup(onLoad, onError);
    xhr.open('GET', URL);
    xhr.send();
  }

  /**
   * функция загрузки данных на сервер
   * @param {Object} data данные, отправляемые на сервер
   * @param {function} onLoad обработчик успешной загрузки
   * @param {function} onError обработчик ошибок
   */
  function save(data, onLoad, onError) {
    var xhr = setup(onLoad, onError);
    xhr.open('POST', SERVER_URL);
    xhr.send(data);
  }

  window.backend = {
    load: load,
    save: save
  };
})();
