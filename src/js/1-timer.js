import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import errorUrl from '../img/error.svg';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  dateTimePicker: document.querySelector('#datetime-picker'),
  dayEl: document.querySelector('[data-days]'),
  hourEl: document.querySelector('[data-hours]'),
  minuteEl: document.querySelector('[data-minutes]'),
  secondEl: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let timerId = null;

// Block Button
refs.startBtn.disabled = true;

// Format date with zero
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// UpdateTimer in page
function updateTimer({ days, hours, minutes, seconds }) {
  refs.dayEl.textContent = addLeadingZero(days);
  refs.hourEl.textContent = addLeadingZero(hours);
  refs.minuteEl.textContent = addLeadingZero(minutes);
  refs.secondEl.textContent = addLeadingZero(seconds);
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const chosenDate = selectedDates[0];

    if (chosenDate.getTime() <= Date.now()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        backgroundColor: '#ef4040',
        titleColor: '#fff',
        messageColor: '#fff',
        // theme: 'dark',
        // timeout: 3000,
        progressBarColor: '#b51b1b',
        iconUrl: errorUrl,
        close: true,
        class: 'my-toast',
      });

      refs.startBtn.disabled = true;
      return;
    }

    userSelectedDate = chosenDate;
    refs.startBtn.disabled = false;
  },
};

flatpickr(refs.dateTimePicker, options);

// Start Timer
function onStartTimerClick() {
  if (!userSelectedDate) return;

  refs.startBtn.disabled = true;
  refs.dateTimePicker.disabled = true;

  function tick() {
    const diff = userSelectedDate.getTime() - Date.now();
    if (diff <= 0) {
      clearInterval(timerId);
      updateTimer({
        days: addLeadingZero(0),
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      refs.dateTimePicker.disabled = false;
      refs.startBtn.disabled = true;
      return;
    }
    const time = convertMs(diff);
    updateTimer({
      days: time.days,
      hours: time.hours,
      minutes: time.minutes,
      seconds: time.seconds,
    });
  }

  // start update
  tick();
  timerId = setInterval(tick, 1000);
}

refs.startBtn.addEventListener('click', onStartTimerClick);
