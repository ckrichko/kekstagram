'use strict';
// модуль для валидации заполнения поля хэштега

(function () {
  var MIN_HASHTAG_LENGTH = 3;
  var MAX_HASHTAG_LENGTH = 20;
  var MAX_HASHTAG_NUMBER = 5;
  var HASTAG_FIRST_SYMBOL = '#';
  var ERROR = {
    invalidFirstSymbol: 'Хэштег должен начинаться с символа "#"',
    manyTags: 'Допускается добавлять не более 5 хэштегов',
    invalidLength: 'Хэштег должен содержать не менее 3-х и не более 20 символов',
    invalidUniqueness: 'Хэштеги не должны повторяться',
    style: '2px solid red'
  };
  var hashTag = document.querySelector('.upload-form-hashtags');

  // при заполнении поля hashtag проверяет его валидность
  hashTag.addEventListener('input', function () {
    checkHashtagValid(hashTag);
  });

  /**
   * checkHashtagValid - проверяет валидность заполнения поля
   *
   * @param {Node} tag поле ввода
   */
  function checkHashtagValid(tag) {
    var error;
    // убирает пробелы и переводит текст в нижний регистр
    var value = tag.value.trim().toLowerCase();
    if (value.length === 0) {
      error = '';
    }
    // формирует массив тегов
    var tags = value.split(' ');
    // проверяет на соответствие требованиям
    if (tags.length > MAX_HASHTAG_NUMBER) {
      error = ERROR.manyTags;
      tag.style.outline = ERROR.style;
    } else if (!checkTagLength(tags)) {
      error = ERROR.invalidLength;
      tag.style.outline = ERROR.style;
    } else if (!checkFirstSymbol(tags)) {
      error = ERROR.invalidFirstSymbol;
      tag.style.outline = ERROR.style;
    } else if (!checkUnique(tags)) {
      error = ERROR.invalidUniqueness;
      tag.style.outline = ERROR.style;
    } else {
      error = '';
      tag.style.outline = '';
    }

    tag.setCustomValidity(error);
  }

  /**
   * checkFirstSymbol - проверяет все элементы массива по значению первого символа
   *
   * @param {Array} tags массив тегов
   * @return {boolean}
   */
  function checkFirstSymbol(tags) {
    return tags.every(function (tag) {
      return tag[0] === HASTAG_FIRST_SYMBOL;
    });
  }

  /**
   * checkTagLength - проверяет все элементы массива на количество символов
   *
   * @param {Array} tags массив тэгов
   * @return {boolean}
   */
  function checkTagLength(tags) {
    return tags.every(function (tag) {
      return tag.length <= MAX_HASHTAG_LENGTH && tag.length >= MIN_HASHTAG_LENGTH;
    });
  }

  /**
   * checkUnique - проверяет все элементы массива на уникальность
   *
   * @param {Array} tags массив тэгов
   * @return {boolean}
   */
  function checkUnique(tags) {
    return tags.every(function (item, index, arr) {
      return arr.indexOf(item) === index;
    });
  }
})();
