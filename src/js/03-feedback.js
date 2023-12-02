// storage
const save = (key, value) => {
  try {
    const serializedData = JSON.stringify(value);
    localStorage.setItem(key, serializedData);
  } catch (err) {
    console.error(err);
  }
};

const load = key => {
  try {
    const serializedData = localStorage.getItem(key);
    return serializedData === null ? undefined : JSON.parse(serializedData);
  } catch (error) {
    console.error(error);
  }
};

const clear = () => {
  localStorage.clear();
};

// functionalitati
import throttle from 'lodash.throttle';

const feedbackForm = document.querySelector('.feedback-form');
const emailInput = document.getElementById('myemail');
const messageInput = document.getElementById('myInput');

const FEEDBACK_KEY = 'feedback';
const STATE_KEY = 'feedback-form-state';

// cerinta 1: Urmăriți în formular evenimentul de input și la fiecare
// modificare să se salveze local un obiect cu câmpurile email și message,
// unde vor fi stocate valorile curente ale câmpurilor din formular.Cheia
// obiectului va fi "feedback-form-state"
const throttledSaveState = throttle(() => {
  const currentState = {
    email: emailInput.value.trim(),
    message: messageInput.value.trim(),
  };

  // Cerinta 4: Asigurați-vă că datele vor fi stocate și actualizate doar
  // o dată la 500 de milisecunde.Pentru a face acest lucru, adăugați la
  // proiect și utilizați librăria lodash.throttle.
  save(STATE_KEY, currentState);
}, 500);

function addFeedbackToStorage(email, message) {
  let feedbackList = load(FEEDBACK_KEY) || [];
  const newFeedback = createFeedbackObject(email, message);
  feedbackList.push(newFeedback);
  save(FEEDBACK_KEY, feedbackList);
  throttledSaveState();
}

function createFeedbackObject(email, message) {
  const timestamp = new Date().toISOString();
  return { email, message, timestamp };
}

function clearForm() {
  emailInput.value = '';
  messageInput.value = '';
}

emailInput.addEventListener('input', throttledSaveState);
messageInput.addEventListener('input', throttledSaveState);

// Cerinta 2: La încărcarea paginii, verificați starea storage-ului, iar
// dacă există date salvate, completați câmpurile formularului
// cu aceste date.În caz contrar, câmpurile vor fi goale.
window.addEventListener('DOMContentLoaded', () => {
  const savedState = load(STATE_KEY);
  if (savedState) {
    emailInput.value = savedState.email || '';
    messageInput.value = savedState.message || '';
  }
});

// Cerinta 3: Când se trimite formularul, la evenimentul submit,
// ștergeți câmpurile din local storage și afișați în consolă obiectul
//  cu câmpurile email, message și valorile lor curente.
feedbackForm.addEventListener('submit', event => {
  event.preventDefault();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();
  addFeedbackToStorage(email, message);
  clearForm();
  console.log('Submit Data:', { email, message });
  localStorage.removeItem(STATE_KEY);
});
