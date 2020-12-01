'use sctrict';

const popapPlace = document.querySelector('main');
const popapMessageTemplate = document.querySelector('.popap__template--message');
const popapSuccessTemplate = document.querySelector('.popap__template--success');
const talkButton = document.querySelector('.page-footer__button');
const mainSection  = document.querySelectorAll('.company, .goods, .clients');
let popapMessage;
let email;


const errors = {
  400: 'Неверный запрос',
};

function newRequest(onSuccess, onError) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  xhr.addEventListener('load', function () {

    if (xhr.status === 200) {
      onSuccess(xhr.response);
    } else {
      onError('Cтатус ответа: ' + xhr.status + ' ' + errors[xhr.status]);
    }
  });

  xhr.addEventListener('error', function () {
    onError('Произошла ошибка соединения');
  });

  xhr.addEventListener('timeout', function () {
    onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
  });

  xhr.timeout = 10000; // 10s
  return xhr;
}

function uploadForm(url, data, onSuccess, onError) {
  var xhr = newRequest(onSuccess, onError);
  xhr.open('POST', url);
  xhr.send(data);
}

function validateEmail (email) {
  const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  if(reg.test(email.value) === false) {
    email.classList.add('form__item--alert');
     return false;
  } else {
    email.classList.remove('form__item--alert');
    return true;
  }
};

function validateName (name) {
  const reg = /^[0-9]$/;

  if(reg.test(name.value) === true || (!name.value)){
    name.classList.add('form__item--alert');
    return false;
  }  else {
    name.classList.remove('form__item--alert');
    return true;
  }
};

function validateMessage (text) {
  if(!text.value) {
    text.classList.add('form__item--alert');
    return false;
  } else {
    text.classList.remove('form__item--alert');
    return true;
  }
};


talkButton.addEventListener(`click`, function() {

  for (let i = 0; i < mainSection.length; i++) {
    mainSection[i].classList.add('none')
  }

  popapMessage = popapMessageTemplate.cloneNode(true);
  popapMessage.classList.remove('popap__template');

  const form = popapMessage.querySelector('.contact-page__form');
  const button = popapMessage.querySelector('.form__button');

  popapPlace.appendChild(popapMessage);

  talkButton.disabled = true;
  window.scrollTo(top);

  button.addEventListener('click', function (evt) {

  let email = popapMessage.querySelector('#email');
  let name = popapMessage.querySelector('#name');
  let message = popapMessage.querySelector('#message');

  evt.preventDefault();

  if(validateEmail(email) && validateName(name) && validateMessage(message)) {
    const newData = new FormData(form);
    uploadForm('http://httpbin.org/post', form, (() => successMessage()), (() => alert('Что-то пошла не так')));
    }
  })
});


function successMessage () {
  const popapSuccess = popapSuccessTemplate.cloneNode(true);
  popapSuccess.classList.remove('popap__template');

  popapPlace.appendChild(popapSuccess);

  function onPopapKeydown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      popapPlace.removeChild(popapSuccess);
      document.removeEventListener('keydown', onPopapKeydown);
      document.removeEventListener('click', onOverlayClick);
    }
  }

  function onOverlayClick() {
      popapPlace.removeChild(popapSuccess);
      document.removeEventListener('click', onOverlayClick);
      document.removeEventListener('keydown', onPopapKeydown);
  }


  document.addEventListener('keydown', onPopapKeydown);
  document.addEventListener('click', onOverlayClick);
}

