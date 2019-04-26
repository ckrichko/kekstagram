'use strict';

(function () {

  var SIZE_STEP = 25;
  var SIZE_MIN = 25;
  var SIZE_MAX = 100;
  var DEFAULT_PERCENT_VALUE = 100;
  var DEFAULT_RESIZE_VALUE = 100;
  var DEFAULT_EFFECT = document.querySelector('#upload-effect-none');

  var form = document.querySelector('#upload-select-image');
  var formUpload = document.querySelector('.upload-form');
  var popupInput = form.querySelector('#upload-file');
  var popupClose = form.querySelector('#upload-cancel');
  var popupPhoto = form.querySelector('.upload-overlay');
  var popupComment = form.querySelector('.upload-form-description');
  // переменные блока смены эффектов
  var effectsField = form.querySelector('.upload-effect-controls');
  var image = form.querySelector('.effect-image-preview');
  var scale = form.querySelector('.upload-effect-level');
  var effectPreviews = form.querySelectorAll('.upload-effect-preview');
  // переменные блока смены размера
  var resizeControl = form.querySelector('.upload-resize-controls');
  var resizeField = form.querySelector('.upload-resize-controls-value');
  var sizePrev = form.querySelector('.upload-resize-controls-button-dec');
  var sizeNext = form.querySelector('.upload-resize-controls-button-inc');

  // открывает/закрывает форму редактирования фото
  popupInput.addEventListener('change', function () {
    uploadFiles(popupInput);
    popupPhoto.classList.remove('hidden');
    // устанавливает обработчики
    popupClose.addEventListener('click', onPopupCloseClick);
    popupClose.addEventListener('keydown', onPopupCloseEnterPress);
    document.addEventListener('keydown', onPopupEscPress);
    effectsField.addEventListener('change', onEffectFieldChange);
    resizeControl.addEventListener('click', onResizeControlClick);
    form.addEventListener('submit', onFormSubmit);
  });

  /**
   * uploadFiles - добавляет загруженные файлы в FileReader и показывает превью изображений
   *
   * @param {Node} input инпут для загрузки изображений
   */
  function uploadFiles(input) {
    // загружает файлы
    var file = input.files[0];
    // проверяет на тип файла
    if (!file.type.match(/image.*/)) {
      window.utils.renderErrorPopup('Загружать можно только картинки!');
      return;
    }
    if (file) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        // добавляет адрес картинки в главную картинку и превью эффектов
        image.src = reader.result;
        Array.from(effectPreviews).forEach(function (item) {
          item.style.backgroundImage = 'url(' + reader.result + ')';
        });
      });
      reader.readAsDataURL(file);
    }
  }

  /**
   * onPopupCloseClick - обработчик события клика мыши на кнопке close
   *
   * @param {Event} evt
   */
  function onPopupCloseClick(evt) {
    evt.preventDefault();
    closePopup();
  }

  /**
   * onPopupEscPress - обработчик нажатия
   * клавиши ESC при открытом окне редактирования фото
   *
   * @param {Event} evt
   */
  function onPopupEscPress(evt) {
    if (evt.target !== popupComment) {
      window.handlers.isEscPressed(evt, closePopup);
    }
  }

  /**
   * onPopupCloseEnterPress - обработчик события
   * нажатия клавиши Enter при фокусе на крестике
   *
   * @param {Event} evt
   */
  function onPopupCloseEnterPress(evt) {
    window.handlers.isEnterPressed(evt, closePopup);
  }

  /**
   * onPopupEscPress - закрывает окно редактирования фото
   *
   */
  function closePopup() {
    setDefaultValues();
    formUpload.reset();
    popupPhoto.classList.add('hidden');
    popupClose.removeEventListener('click', onPopupCloseClick);
    popupClose.removeEventListener('keydown', onPopupCloseEnterPress);
    document.removeEventListener('keydown', onPopupEscPress);
    effectsField.removeEventListener('change', onEffectFieldChange);
    resizeControl.removeEventListener('click', onResizeControlClick);
  }

  /**
   * onEffectFieldChange - обработчик изменения поля выбора эффекта
   *
   */
  function onEffectFieldChange() {
    window.slider.setAttributes(DEFAULT_PERCENT_VALUE, window.slider.changeFilter);
  }

  /**
   * onResizeControlClick - обработчик клика на кнопке изменения размера
   *
   * @param {Event} evt
   */
  function onResizeControlClick(evt) {
    // ловит события клика на кнопках, меняет значение поля
    if (evt.target === sizePrev) {
      resizeField.value = parseInt(resizeField.value, 10) - SIZE_STEP + '%';
    }
    if (evt.target === sizeNext) {
      resizeField.value = parseInt(resizeField.value, 10) + SIZE_STEP + '%';
    }
    // дизейблит кнопки при определенном значении поля
    sizeNext.disabled = parseInt(resizeField.value, 10) === SIZE_MAX;
    sizePrev.disabled = parseInt(resizeField.value, 10) === SIZE_MIN;
    // сразу прописывается размер фото
    var size = parseInt(resizeField.value, 10) / 100;
    image.style.transform = 'scale(' + size + ')';
  }

  /**
   * setDefaultValues - возвращает элементам значения по умолчанию
   *
   */
  function setDefaultValues() {
    image.style = '';
    image.src = '#';
    scale.classList.add('hidden');
    resizeField.value = DEFAULT_RESIZE_VALUE + '%';
    DEFAULT_EFFECT.checked = true;
  }

  /**
   * onFormSubmit - обработчик события отправки формы, отправляет данные формы на сервер
   *
   * @param {Event} evt
   */
  function onFormSubmit(evt) {
    evt.preventDefault();
    window.backend.save(new FormData(form), window.utils.renderSuccessPopup, window.utils.renderErrorPopup);
    resetForm();
  }

  /**
   * resetForm - сбрасывает значения полей формы
   * на значения по умолчанию
   *
   */
  function resetForm() {
    form.reset();
    setDefaultValues();
    closePopup();
  }
})();
