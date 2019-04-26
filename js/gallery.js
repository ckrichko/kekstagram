'use strict';

(function () {

  var filter = document.querySelector('.filters');
  var randomFilter = document.querySelector('.filters-item:last-child');
  var pictureTemplate = document.querySelector('#picture-template').content.querySelector('.picture');
  var picturesGallery = document.querySelector('.pictures');
  var dataPhotos;
  var pictures = [];
  var draggedPicture = null;

  // загружает информацию с сервера
  // и показывает фотографии при успешной загрузке
  window.backend.load(showPhotos, window.utils.renderErrorPopup);

  // при смене значения фильтра обновляет фотографии
  filter.addEventListener('change', function () {
    window.utils.debounce(updatePhotos);
  });

  // при клике на кнопку "случайные" обновляет фотографии
  randomFilter.addEventListener('click', function () {
    window.utils.debounce(updatePhotos);
  });

  /**
   * showPhotos - сохраняет полученные данные в переменную и отрисовывает фотографии
   *
   * @param {Array} data
   */
  function showPhotos(data) {
    dataPhotos = data;
    renderPictures(data);
  }

  /**
   * updatePhotos - получает текущее значение фильтра
   * и в зависимости от него выполняет сортировку и отрисовку фотографий
   *
   */
  function updatePhotos() {
    // текущее значение фильтра
    var currentValue = filter.querySelector('.filters-radio:checked').value;
    // удаляет все отрисованные фотографии
    pictures.forEach(function (item) {
      item.remove();
    });
    // копирует массив в новую переменную
    var photos = dataPhotos.slice(0);
    // создаёт массивы отсортированных значений
    // в зависимости от выбранного параметра
    var popularPhotos = dataPhotos.slice(0).sort(function (a, b) {
      return b.likes - a.likes;
    });
    var discussedPhotos = dataPhotos.slice(0).sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
    var randomPhotos = dataPhotos.slice(0).sort(function () {
      return Math.random() - 0.5;
    });
    // объединяет в объект значение фильтра и результат сортировки
    var result = {
      'recommend': photos,
      'popular': popularPhotos,
      'discussed': discussedPhotos,
      'random': randomPhotos
    };
    // вызывает функцию отрисовки фотографий с полученным значением
    renderPictures(result[currentValue]);
  }

  /**
   * renderPictures - показывает фото, отрисованные с данных массива
   *
   * @param {Array} photos массив данных
   */
  function renderPictures(photos) {
    // создаёт фрагмент
    var fragment = document.createDocumentFragment();
    // для каждого элемента массива создаёт HTML-элемент и добавляет его во фрагмент
    photos.forEach(function (photo) {
      fragment.appendChild(createPictureElement(pictureTemplate, photo));
    });
    // вставляет фрагмент в блок-контейнер
    document.querySelector('.pictures').appendChild(fragment);
    // показывает фильтры
    filter.classList.remove('filters-inactive');
  }

  /**
   * createPictureElement - создает копию элемента по шаблону
   *
   * @param  {Node} template шаблон
   * @param  {Object} photo объект со значениями свойств элемента
   * @return {Object} копия элемента
   */
  function createPictureElement(template, photo) {
    // копирование шаблона
    var clone = template.cloneNode(true);
    var image = clone.querySelector('a img');
    var likes = clone.querySelector('.picture-likes');
    var comments = clone.querySelector('.picture-comments');
    // заполнение данными
    fillAttributes(image, likes, comments, photo);
    // создаёт HTML-разметку блоков для их перетаскивания
    clone.setAttribute('draggable', true);
    // установка обработчиков клика
    clone.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.preview.show(photo);
    });
    // добавление элемента в массив фотографий
    pictures.push(clone);
    return clone;
  }

  /**
   * fillElementAttributes - заполнение данными свойства/атрибуты элементов
   *
   * @param  {Object} img элемент фотографии
   * @param  {Object} likes элемент лайков
   * @param  {Object} comments элемент комментариев
   * @param  {Object} photo объект с данными
   */
  function fillAttributes(img, likes, comments, photo) {
    img.setAttribute('src', photo.url);
    likes.textContent = photo.likes;
    comments.textContent = photo.comments.length;
  }

  /**
   * перетаскивание фото в галерее
   */

  picturesGallery.addEventListener('dragstart', function (evt) {

    if (evt.target.parentNode.className === 'picture') {
      draggedPicture = evt.target.parentNode;
      evt.dataTransfer.setData('text/plain', draggedPicture.className);
    }
  });

  picturesGallery.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });

  function setBoxShadowPicture(evt, value) {
    if (evt.target.parentNode.className === 'picture') {
      evt.target.parentNode.style.boxShadow = value;
    }
  }

  picturesGallery.addEventListener('dragenter', function (evt) {
    setBoxShadowPicture(evt, '-10px 0px 0px #efd41f');
    evt.preventDefault();
  });

  picturesGallery.addEventListener('dragleave', function (evt) {
    setBoxShadowPicture(evt, '');
    evt.preventDefault();
  });

  picturesGallery.addEventListener('drop', function (evt) {
    setBoxShadowPicture(evt, '');
    evt.currentTarget.insertBefore(draggedPicture, evt.target.parentNode);
    evt.preventDefault();
  });

  window.gallery = {
    fill: fillAttributes
  };
})();
