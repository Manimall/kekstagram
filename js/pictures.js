'use strict';

var NUMBER_OF_OBJECTS = 25; // нужное кол-во обьектов
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var AVATARS_MAX = 6;

// константы для слайдера
var RESIZE_STEP = 25;
var RESIZE_MAX = 100;
var RESIZE_MIN = 25;
var RESIZE_DEFAULT_VALUE = 100;

var KeyCodes = {
  ESC: 27,
  ENTER: 13
};

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var DESCRIPTION = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var picturesList = document.querySelector('.pictures'); // место для отрисовки сгенерированных DOM-элементов
var picturesTemplate = document.querySelector('#picture').content.querySelector('.picture__link'); // искомый шаблон и нужный элемент в нем
var bigPicture = document.querySelector('.big-picture');
var bigPictureBtnClose = bigPicture.querySelector('.big-picture__cancel'); // кнопка закрытия большой фотки
var pictureLinks = document.querySelectorAll('.picture__link'); // выбираем все нащи фотки

/**
 * Функция генерации случайного числа
 * @param {integer} min - номер первого элемента из массива
 * @param {integer} max - номер последнего элемента из массива - не включая это значение
 * @return {integer} - номер случайного элемента из массива
 */
var getRandomNum = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

/**
 * Вспомогательная функция для сортировки массива в произвольном порядке
 * @return {integer} - псевдослучайное число из диапазона [0, 1), то есть, от 0 (включительно) до 1 (но не включая 1)
 */
var compareRandom = function () {
  return Math.random() - 0.5;
};

/**
 * Генерируем комментарии случайным образом, для каждого комментария берем 1 или 2 строки из массива COMMENTS
 * @return {Array} - массив с одним или двумя комментариями
 */
var generateComment = function () {
  var commentsCopy = COMMENTS.slice();
  commentsCopy.sort(compareRandom);

  var commentsSmallCopy = commentsCopy.slice(0, getRandomNum(1, 2));

  return commentsSmallCopy;
};

/**
 * Создаем обьект через функцию конструктор
 * @param {integer} n - текущий номер обьекта
 */
var PhotoDescription = function (n) {
  this.url = 'photos/' + (n + 1) + '.jpg';
  this.likes = getRandomNum(MIN_LIKES, MAX_LIKES);
  this.comments = generateComment(COMMENTS);
  this.description = DESCRIPTION[getRandomNum(0, DESCRIPTION.length)];
};

/**
 * Создаем массив оденотипных обьектов
 * @param {Object} ObjectSample - обьект-прототип, на основе которого будут сгенерированы остальные обьекты
 * @param {integer} count - количество обьектов для генерации
 * @return {Array} - массив из n-ого кол-ва сгенерированных обьектов
 */
var createArrayOfPhoto = function (ObjectSample, count) {
  var photos = []; // массив для описания фоток
  for (var i = 0; i < count; i++) {
    photos.push(new ObjectSample(i));
  }
  return photos;
};

/**
 * Cоздаем DOM-элементы, заполняем их данными
 * @param {Object} photo - обьект для изменения данных
 * @return {Node} - нужный нам шаблон с измененными данными
 */
var createPictureElements = function (photo) {
  var pictureElement = picturesTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = photo.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = photo.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = photo.comments.length;
  pictureElement.dataset.id = photo.id;

  return pictureElement;
};

/**
 * Отрисовываем сгенерированные DOM-элементы на странице
 * @param {Array} arrayOfObjects - массив из нужного кол-ва обьектов
 * @param {Node} parentNode - блок для вставки на страницу сгенерированных DOM-элементов
*/
var insertPhotos = function (arrayOfObjects, parentNode) {
  var fragment = document.createDocumentFragment();
  arrayOfObjects.forEach(function (element) {
    fragment.appendChild(createPictureElements(element));
  });

  parentNode.appendChild(fragment);
};

// работаем с фотками
/**
 * Разворачиваем полную версию фотографии с комментариями и описанием
 * @param {Object} photo - обьект, на основе которого будут изменяться данные
 */
var setupBigPicture = function (photo) {
  bigPicture.classList.remove('hidden'); // показываем большое фото
  bigPicture.querySelector('.big-picture__img').src = photo.url;
  bigPicture.querySelector('.likes-count').textContent = photo.likes;
  bigPicture.querySelector('.social__caption').textContent = photo.description;
  bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
};

// Удаляем старые комментарии
var removeOldComments = function () {
  var pictureComments = bigPicture.querySelector('.social__comments');
  var removedComments = bigPicture.querySelectorAll('.social__comment');
  removedComments.forEach(function (oldcomment) {
    pictureComments.removeChild(oldcomment);
  });
};

/**
 * Добавляем комментарии к большой фотке
 * @param {Object} photo - любой обьект из сгенерированного массива
 */
var addComments = function (photo) {
  photo.comments.forEach(function (comment) {
    var pictureComments = bigPicture.querySelector('.social__comments');

    var pictureComment = document.createElement('li');
    pictureComment.classList.add('social__comment');
    pictureComments.appendChild(pictureComment);

    var pictureCommentImg = document.createElement('img');
    pictureCommentImg.classList.add('social__picture');
    pictureCommentImg.src = 'img/avatar-' + getRandomNum(1, AVATARS_MAX) + '.svg';
    pictureCommentImg.alt = 'Аватар комментатора фотографии';
    pictureCommentImg.width = 35;
    pictureCommentImg.height = 35;
    pictureComment.appendChild(pictureCommentImg);

    var pictureCommentText = document.createElement('p');
    pictureCommentText.classList.add('social__text');
    pictureCommentText.textContent = comment;
    pictureComment.appendChild(pictureCommentText);
  });
};

/**
 * Прячем блок счётчика комментариев и блок загрузки новых комментариев
 */
var hideCommentsElements = function () {
  var social = bigPicture.querySelector('.social');
  social.querySelector('.social__loadmore').classList.add('visually-hidden');
  social.querySelector('.social__comment-count').classList.add('visually-hidden');
};

/**
 * Отрисовываем полную версию фотографии с комментариями
 * @param {Object} photo - первое фото из массива
 */
var renderBigPicture = function (photo) {
  setupBigPicture(photo);
  removeOldComments();
  addComments(photo);
  hideCommentsElements();
};

// вызываем главные функции
var readyPhotos = createArrayOfPhoto(PhotoDescription, NUMBER_OF_OBJECTS); // создаем массив из n кол-ва обьектов
insertPhotos(readyPhotos, picturesList); // добавляем данные DOM-элементы в нужное место на странице
// renderBigPicture(readyPhotos[0]); // Отрисовываем большую фотографию с комментариями и описанием

// Элементы загрузки новых фоток
var uploadFile = document.querySelector('#upload-file'); // инпут с типом file - элемент для загрузки изображения
var uploadCancel = document.querySelector('#upload-cancel'); // кнопка закрытия формы редактирования изображения
var imageUpload = document.querySelector('.img-upload__overlay'); // оверлэй для редактирования фото после ее загрузки

// изменение масштаба фотки
var resizeControlPanel = document.querySelector('.img-upload__resize');
var resizeControlMinus = document.querySelector('.resize__control--minus');
var resizeControlPlus = document.querySelector('.resize__control--plus');
var resizeControlValue = document.querySelector('.resize__control--value');
var imagePreview = document.querySelector('.img-upload__preview');

// панель применения эффектов к оверлэю
var effectControls = document.querySelectorAll('.effects__radio'); // радио-кнопки для выбора эффекта
var scalePin = document.querySelector('.scale__pin'); // ползунок регулирования интенсивности эффекта
var scaleValue = document.querySelector('.scale__value'); // Уровень эффекта - число от 0 до 100 - изначально 100
var imagePreviewImg = document.querySelector('.img-upload__preview img'); // картинка внутри .img-upload__preview
var imageSlider = document.querySelector('.img-upload__scale'); // сам слайдер

var togglePopup = function (popup) {
  popup.classList.toggle('hidden');
};

var bigPictureKeydownHandler = function (evt) {
  if (evt.keyCode === KeyCodes.ESC) {
    hideBigPicture();
  }
};

var showBigPicture = function () {
  togglePopup(bigPicture);
  document.addEventListener('keydown', bigPictureKeydownHandler);
};

var hideBigPicture = function () {
  togglePopup(bigPicture);
  document.removeEventListener('keydown', bigPictureKeydownHandler);
};

var uploadCancelKeydownHandler = function (evt) {
  if (evt.keyCode === KeyCodes.ESC && evt.target === uploadCancel) {
    hideUploadImage();
  }
};

var showUploadImage = function () {
  togglePopup(imageUpload);
  document.addEventListener('keydown', uploadCancelKeydownHandler);
  resizeControlValue.value = RESIZE_DEFAULT_VALUE + '%';
  scaleValue.value = RESIZE_MAX;
  resizeControlMinus.addEventListener('click', onResizeControlClick);
  resizeControlPlus.addEventListener('click', onResizeControlClick);
  applyEffect();
};


var hideUploadImage = function () {
  togglePopup(imageUpload);
  document.removeEventListener('keydown', uploadCancelKeydownHandler);
  uploadFile.value = '';
};

var UploadCancelClickHandler = function () {
  hideUploadImage();
};

var uploadFileChangeClickHandler = function () {
  showUploadImage();
};

var onResizeControlClick = function (evt) {
  var currentValue = parseInt(resizeControlValue.value, 10);

  if (evt.target === resizeControlMinus) {
    if (currentValue > RESIZE_MIN) {
      currentValue -= RESIZE_STEP;
    }
  } else if (evt.target === resizeControlPlus) {
    if (currentValue < RESIZE_MAX) {
      currentValue += RESIZE_STEP;
    }
  }

  var scale = 'scale' + '(' + (currentValue / 100) + ')';
  imagePreviewImg.style.transform = scale;

  resizeControlValue = (currentValue + '%');
};

resizeControlPanel.addEventListener('click', onResizeControlClick, true);
resizeControlMinus.addEventListener('click', onResizeControlClick);
resizeControlPlus.addEventListener('click', onResizeControlClick);

// обработчики
uploadCancel.addEventListener('click', UploadCancelClickHandler);
uploadFile.addEventListener('change', uploadFileChangeClickHandler);
// pictureLinks.forEach(function (picture) {
//   picture.addEventListener('click', showBigPicture);
// });
document.addEventListener('click', function (evt) {
  if (evt.target.classList.contains('picture__img')) {
    showBigPicture();
  }
});

bigPictureBtnClose.addEventListener('click', hideBigPicture);
bigPicture.addEventListener('keydown', bigPictureKeydownHandler);
bigPictureBtnClose.addEventListener('focus', function (evt) {
  if (evt.keyCode === KeyCodes.ENTER) {
    hideBigPicture();
  }
});

var effectsMap = {
  none: {
    className: '',
    calcFilterValue: function () {
      return null;
    }
  },
  chrome: {
    className: 'effects__preview--chrome',
    calcFilterValue: function (value) {
      return 'grayscale(' + value / 100 + ')';
    }
  },
  sepia: {
    className: 'effects__preview--sepia',
    calcFilterValue: function (value) {
      return 'sepia(' + value / 100 + ')';
    }
  },
  marvin: {
    className: 'effects__preview--marvin',
    calcFilterValue: function (value) {
      return 'invert(' + value + '%)';
    }
  },
  phobos: {
    className: 'effects__preview--phobos',
    calcFilterValue: function (value) {
      return 'blur(' + value / 100 * 3 + 'px)';
    }
  },
  heat: {
    className: 'effects__preview--heat',
    calcFilterValue: function (value) {
      return 'brightness(' + (1 + value / 100 * 2) + ')';
    }
  }
};

var applyEffect = function () {
  var currentEffect = document.querySelector('.effects__radio:checked').value;
  imagePreviewImg.className = effectsMap[currentEffect].className;
  imagePreviewImg.style.filter = effectsMap[currentEffect].calcFilterValue(scaleValue.value);
  if (currentEffect === 'none') {
    imageSlider.classList.add('hidden');
  } else if (imageSlider.classList.contains('hidden')) {
    imageSlider.classList.remove('hidden');
  }
};

var calcEffectScale = function () {
  var scaleLineElement = document.querySelector('.scale__line');
  var scaleLevelElement = document.querySelector('.scale__level');
  var maxValue = scaleLineElement.offsetWidth;
  var currentValue = scaleLevelElement.offsetWidth;
  return Math.round(currentValue / maxValue * 100);
};

var onScalePinControlMouseup = function () {
  scaleValue.value = calcEffectScale();
  applyEffect();
};

var onEffectControlChange = function () {
  scaleValue.value = 100;
  applyEffect();
};

scalePin.addEventListener('mouseup', onScalePinControlMouseup);

for (var i = 0; i < effectControls.length; i++) {
  effectControls[i].addEventListener('change', onEffectControlChange);
}

effectControls.forEach(function (control) {
  control.addEventListener('change', onEffectControlChange);
};
