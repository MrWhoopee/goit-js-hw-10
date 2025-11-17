import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import errorUrl from '../img/error.svg';
import warningUrl from '../img/caution.svg';
import successUrl from '../img/success.svg';

const refs = {
  snackbarFormEl: document.querySelector('form'),
};

function submitSnackbarForm(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const delay = Number(form.elements.delay.value * 1000);
  const state = form.elements.state.value;

  if (delay < 0) {
    return iziToast.warning({
      title: 'Caution',
      message: 'Please dont input negative values',
      position: 'topRight',
      backgroundColor: '#ffa000',
      titleColor: '#fff',
      messageColor: '#fff',
      progressBarColor: '#bb7b10',
      iconUrl: warningUrl,
      close: true,
      class: 'my-toast',
    });
  }

  return new Promise((resolve, reject) => {
    if (state === 'fulfilled') {
      resolve(`Fulfilled promise in ${delay}ms`);
      return;
    } else {
      reject(`Rejected promise in ${delay}ms`);
    }
  }, delay)
    .then(msg => {
      setTimeout(() => {
        iziToast.success({
          title: 'OK',
          message: msg,
          position: 'topRight',
          backgroundColor: '#59a10d',
          titleColor: '#fff',
          messageColor: '#fff',
          progressBarColor: '#326101',
          iconUrl: successUrl,
          close: true,
          class: 'my-toast',
        });
      }, delay);
    })
    .catch(msg => {
      setTimeout(() => {
        iziToast.error({
          title: 'Error',
          message: msg,
          position: 'topRight',
          backgroundColor: '#ef4040',
          titleColor: '#fff',
          messageColor: '#fff',
          progressBarColor: '#b51b1b',
          iconUrl: errorUrl,
          close: true,
          class: 'my-toast',
        });
      }, delay);
    });
}

refs.snackbarFormEl.addEventListener('submit', submitSnackbarForm);
