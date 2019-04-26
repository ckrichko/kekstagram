'use strict';

(function () {

  var picture = document.querySelector('.gallery-overlay');
  var pictureImage = picture.querySelector('.gallery-overlay-image');
  var pictureLikes = picture.querySelector('.likes-count');
  var pictureComments = picture.querySelector('.comments-count');
  var closeButton = picture.querySelector('.gallery-overlay-close');

  /**
   * showPreview - показывает увеличенный элемент с фотографией и инфо-блоком
   *
   * @param {Object} photo объект с данными для элемента
   */
  function showPreview(photo) {
    picture.classList.remove('hidden');
    window.gallery.fill(pictureImage, pictureLikes, pictureComments, photo);
    // навешиваем обработчики
    closeButton.addEventListener('click', onCloseClick);
    closeButton.addEventListener('keydown', onCloseEnterPress);
    document.addEventListener('keydown', onPictureEscPress);
  }

  /**
   * onCloseClick - обработчик клика мыши по кнопке close
   *
   * @param {Event} evt
   */
  function onCloseClick(evt) {
    evt.preventDefault();
    closePreview();
  }

  /**
   * onCloseEnterPress - обработчик нажатия Enter при фокусе кнопки close
   *
   * @param {Event} evt
   */
  function onCloseEnterPress(evt) {
    window.handlers.isEnterPressed(evt, closePreview);
  }

  /**
   * onPictureEscPress - обработчик нажатия Esc при открытом ревью картинки
   *
   * @param {Event} evt
   */
  function onPictureEscPress(evt) {
    window.handlers.isEscPressed(evt, closePreview);
  }

  /**
   * onPictureEscPress - прячет ревью картинки и снимает с картинки обработчики
   *
   */
  function closePreview() {
    picture.classList.add('hidden');
    closeButton.removeEventListener('click', onCloseClick);
    closeButton.removeEventListener('keydown', onCloseEnterPress);
    document.removeEventListener('keydown', onPictureEscPress);
  }

  window.preview = {
    show: showPreview
  };
})();
