'use strict';

(function () {
  var uploadFileElement = document.querySelector('#upload-file');
  var uploadCancelElement = document.querySelector('#upload-cancel');
  var imageUploadElement = document.querySelector('.img-upload__overlay');

  var imageUploadForm = document.querySelector('.img-upload__form');

  /**
   * Показываем загруженный пользователем файл, ставим масштаб файла + эффект по умолчанию
   */
  var showImageUploadElement = function () {

    if (!window.loadUserFile(uploadFileElement)) {
      return;
    }

    window.helpers.toggleOverlay(imageUploadElement, onUploadFileEscPress);

    window.resize.setDefaultSize();
    window.effects.applyEffect(true);
  };

  /**
   * Прячем popup с загрузкой нового файла, делаем reset формы
   */
  var hideImageUploadElement = function () {
    window.helpers.toggleOverlay(imageUploadElement, onUploadFileEscPress);
    uploadFileElement.value = '';
    imageUploadForm.reset();
    window.validation.setSuccessInput();
  };

  /**
   * Показываем блок с классом img-upload__message--error при Ошибке загрузки файла
   */
  var showUploadErrorBlock = function () {
    document.querySelector('.img-upload__message--error').classList.remove('hidden');
  };

  /**
   * Показываем popup загрузки нового файла
   */
  var onUploadFileChange = function () {
    showImageUploadElement();
  };

  /**
   * Функция-обработчик события, отменяющая загрузку нового файла и закрывающая popup с загрузкой
   */
  var onUploadCancelClick = function () {
    hideImageUploadElement();
  };

  /**
   * Обработчик события, закрывающий загрузку файла при нажатии на ESC
   * (не сработает, когда в фокусе находятся поле ввода ХэшТэгов и поле добаления комментария)
   * @param  {Object} evt - объект события
   */
  var onUploadFileEscPress = function (evt) {
    if (evt.keyCode === window.helpers.KeyCode.ESC &&
      evt.target !== document.querySelector('.text__hashtags') &&
      evt.target !== document.querySelector('.text__description')) {
      hideImageUploadElement();
    }
  };

  /**
   * Функция-Обработчик отправки формы;
   * Отменяем действие формы по умолчанию, отправляем данные формы через XHR;
   * При успешной загрузке данных на сервер - закрываем окно редактирования фотографии
   * (которую загрузил пользователь) и сбрасываем значения формы на значения по умолчанию;
   * При ошибке - закрываем окно редактирования фотографии и показываем блок ошибки загрузки файла
   * @param  {Object} evt - объект события
   */
  var onSubmitImageUplodForm = function (evt) {
    evt.preventDefault();

    var onLoad = function () {
      imageUploadForm.reset();
      hideImageUploadElement();
    };

    var onError = function () {
      hideImageUploadElement();
      showUploadErrorBlock();
    };

    if (imageUploadForm.reportValidity()) {
      var formData = new FormData(imageUploadForm);

      window.backend.sendData(formData, onLoad, onError);
    }
  };

  // обработчики событий
  uploadFileElement.addEventListener('change', onUploadFileChange);
  uploadCancelElement.addEventListener('click', onUploadCancelClick);

  imageUploadForm.addEventListener('submit', onSubmitImageUplodForm);
})();
